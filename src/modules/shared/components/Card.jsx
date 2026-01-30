'use client';

import { useState } from 'react';

export default function Card({ 
  children, 
  className = '', 
  hover = true, 
  clickable = false,
  onClick,
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (clickable) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    if (clickable) {
      setIsPressed(false);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const baseClasses = 'bg-white rounded-lg shadow border border-black transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105' : '';
  const clickableClasses = clickable ? 'cursor-pointer active:scale-95' : '';
  const transformClasses = isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${transformClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-6 border-b border-black ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`p-6 border-t border-black ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-black ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-black mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}
