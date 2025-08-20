import React, { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  mobileOptimized?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | string;
}

export default function ResponsiveContainer({ 
  children, 
  className = '', 
  mobileOptimized = false,
  padding = 'md'
}: ResponsiveContainerProps) {
  const paddingClasses = {
    sm: 'px-2 sm:px-4 lg:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16'
  };

  const paddingClass = paddingClasses[padding as keyof typeof paddingClasses] || padding;

  return (
    <div className={`w-full max-w-7xl mx-auto ${paddingClass} ${mobileOptimized ? 'mobile-optimized' : ''} ${className}`}>
      {children}
    </div>
  );
}
