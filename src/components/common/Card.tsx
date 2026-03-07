import React, { useState } from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export function Card({
  title,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className = ''
}: CardProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {title && (
        <div
          className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${collapsible ? 'cursor-pointer' : ''}`}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
            {collapsible && (
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      )}
      {(!collapsible || !isCollapsed) && (
        <div className="px-4 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
