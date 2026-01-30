'use client';

import React from 'react';

// Bar Chart Component
export function BarChart({ data, className = '' }) {
  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = 100 / data.length;

  return (
    <div className={`w-full h-64 bg-white border border-black rounded-lg p-4 ${className}`}>
      <div className="flex items-end justify-between h-full">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-end flex-1"
            style={{ marginLeft: index > 0 ? '4px' : '0' }}
          >
            <div className="text-xs text-black mb-2 text-center">
              {item.value}
            </div>
            <div
              className="w-full bg-black transition-all duration-500"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: '4px'
              }}
            />
            <div className="text-xs text-black mt-2 text-center max-w-full truncate">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Line Chart Component
export function LineChart({ data, className = '' }) {
  const maxValue = Math.max(...data.map(item => item.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={`w-full h-64 bg-white border border-black rounded-lg p-4 ${className}`}>
      <svg className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={`${y}%`}
            x2="100%"
            y2={`${y}%`}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
        
        {/* Points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.value / maxValue) * 100;
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="4"
              fill="black"
            />
          );
        })}
        
        {/* Labels */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          return (
            <text
              key={index}
              x={`${x}%`}
              y="95%"
              textAnchor="middle"
              className="text-xs fill-black"
            >
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// Pie Chart Component
export function PieChart({ data, className = '' }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const paths = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    currentAngle = endAngle;
    
    return {
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(1)
    };
  });

  const colors = ['#000000', '#333333', '#666666', '#999999', '#cccccc'];

  return (
    <div className={`w-full h-64 bg-white border border-black rounded-lg p-4 ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {paths.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={colors[index % colors.length]}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="mt-4 space-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-black">{item.label}</span>
            </div>
            <span className="text-black font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Ring Component
export function ProgressRing({ 
  value, 
  size = 120, 
  strokeWidth = 8, 
  color = 'black',
  backgroundColor = '#e5e7eb',
  className = '' 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-lg font-bold text-black">{value}%</span>
      </div>
    </div>
  );
}

// Stats Card Component
export function StatsCard({ title, value, change, icon, className = '' }) {
  const isPositive = change > 0;
  
  return (
    <div className={`bg-white border border-black rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-black">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="mr-1">
                {isPositive ? '↑' : '↓'}
              </span>
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
