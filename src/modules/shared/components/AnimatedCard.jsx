'use client';

import { useState } from 'react';

export default function AnimatedCard({ children, className = '', hover = true }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out transform ${
        hover ? 'hover:scale-105 hover:shadow-xl' : ''
      } ${isHovered ? 'scale-105 shadow-xl' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}
