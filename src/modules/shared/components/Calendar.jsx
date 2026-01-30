'use client';

import { useState } from 'react';

export default function Calendar({ 
  selectedDate, 
  onDateSelect, 
  events = [], 
  className = '',
  minDate,
  maxDate 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateSelectable = (date) => {
    if (!date) return false;
    
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    
    return true;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    if (isDateSelectable(date)) {
      onDateSelect(date);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white border border-black rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-black">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-black">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays().map((date, index) => {
          const isSelected = isDateSelected(date);
          const isTodayDate = isToday(date);
          const isSelectable = isDateSelectable(date);
          const dayEvents = date ? getEventsForDate(date) : [];

          return (
            <div
              key={index}
              className={`
                relative p-2 text-center rounded-lg cursor-pointer transition-colors
                ${!date ? 'invisible' : ''}
                ${isSelectable ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}
                ${isSelected ? 'bg-black text-white' : 'text-black'}
                ${isTodayDate && !isSelected ? 'border-2 border-black' : ''}
              `}
              onClick={() => date && handleDateClick(date)}
            >
              {date && (
                <>
                  <div className="text-sm font-medium">
                    {date.getDate()}
                  </div>
                  {dayEvents.length > 0 && (
                    <div className="flex justify-center mt-1">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 bg-red-500 rounded-full mx-0.5"
                          title={event.title}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Events list */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-black mb-2">
            {selectedDate.toLocaleDateString()}
          </h4>
          {getEventsForDate(selectedDate).length > 0 ? (
            <div className="space-y-1">
              {getEventsForDate(selectedDate).map((event, index) => (
                <div key={index} className="text-xs text-black p-2 bg-white rounded border border-black">
                  {event.title}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-black">No events</p>
          )}
        </div>
      )}
    </div>
  );
}
