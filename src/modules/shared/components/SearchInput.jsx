'use client';

import { useState, useEffect, useRef } from 'react';

export default function SearchInput({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onClear,
  className = '',
  suggestions = [],
  showSuggestions = false 
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    setShowSuggestionsList(showSuggestions && isFocused && suggestions.length > 0);
  }, [isFocused, showSuggestions, suggestions]);

  const handleKeyDown = (e) => {
    if (!showSuggestionsList) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          onChange(suggestions[selectedIndex]);
          setShowSuggestionsList(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestionsList(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border border-black rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${isFocused ? 'ring-2 ring-black' : ''} ${className}`}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={() => {
              onClear();
              setShowSuggestionsList(false);
              setSelectedIndex(-1);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
          >
            ×
          </button>
        )}
        {isFocused && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        )}
      </div>

      {showSuggestionsList && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                index === selectedIndex 
                  ? 'bg-black text-white' 
                  : 'hover:bg-gray-100 text-black'
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
