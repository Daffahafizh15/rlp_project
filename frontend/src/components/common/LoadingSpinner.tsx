import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; className?: string }> = ({
  message = 'Memuat data...',
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-8 h-8 border-2 border-forme-primary border-t-transparent rounded-full animate-spin"></div>
      {message && <p className="mt-3 text-xs tracking-wider text-forme-text-secondary uppercase">{message}</p>}
    </div>
  );
};
