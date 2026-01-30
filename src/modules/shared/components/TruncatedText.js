'use client';

import { useState } from 'react';

export default function TruncatedText({ text, maxWords = 5, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const words = text.split(' ');
  const isLong = words.length > maxWords;
  const displayText = isLong && !isHovered 
    ? words.slice(0, maxWords).join(' ') + '...' 
    : text;

  return (
    <div 
      className={`${className} ${isLong ? 'cursor-help' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isLong ? text : ''}
    >
      {displayText}
    </div>
  );
}
