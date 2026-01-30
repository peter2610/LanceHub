'use client';

import { useState, useEffect } from 'react';

export default function ProgressBar({ 
  value = 0, 
  max = 100, 
  size = 'md', 
  color = 'default',
  showLabel = true,
  animated = true,
  className = ''
}) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min(Math.max((currentValue / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const colors = {
    default: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  const getColor = () => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 60) return colors.default;
    if (percentage >= 40) return colors.warning;
    if (percentage >= 20) return colors.purple;
    return colors.danger;
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-black mb-2">
          <span className="font-medium">Progress</span>
          <span className="font-bold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 10 && (
            <div className="h-full flex items-center justify-end pr-2">
              <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CircularProgress({ 
  value = 0, 
  size = 40, 
  strokeWidth = 4,
  color = 'default',
  showLabel = true,
  className = ''
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const colors = {
    default: 'stroke-blue-500',
    success: 'stroke-green-500',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-500'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className={`transform -rotate-90`}
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colors[color]} transition-all duration-500 ease-out`}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-bold text-black">
          {value}%
        </span>
      )}
    </div>
  );
}
