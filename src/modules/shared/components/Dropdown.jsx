'use client';

import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ 
  trigger, 
  children, 
  className = '',
  position = 'bottom-left' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-1';
      case 'bottom-right':
        return 'top-full right-0 mt-1';
      case 'top-left':
        return 'bottom-full left-0 mb-1';
      case 'top-right':
        return 'bottom-full right-0 mb-1';
      default:
        return 'top-full left-0 mt-1';
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className={`absolute z-50 w-48 bg-white border border-black rounded-lg shadow-lg ${getPositionClasses()}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ 
  children, 
  onClick, 
  className = '',
  disabled = false 
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        px-4 py-2 text-sm text-black cursor-pointer transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function DropdownDivider({ className = '' }) {
  return (
    <div className={`border-t border-black ${className}`} />
  );
}
