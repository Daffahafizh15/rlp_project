import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-wide select-none';

  const variants = {
    primary: 'bg-forme-primary text-white hover:bg-neutral-800 focus:ring-neutral-900 border border-transparent shadow-sm',
    secondary: 'bg-white text-forme-text-primary hover:bg-neutral-100 focus:ring-neutral-300 border border-forme-border shadow-sm',
    outline: 'bg-transparent text-forme-text-primary hover:bg-neutral-100 border border-forme-primary focus:ring-neutral-900',
    danger: 'bg-forme-status-danger text-white hover:bg-red-700 focus:ring-red-600 border border-transparent',
    ghost: 'bg-transparent text-forme-text-primary hover:bg-neutral-200 border-none',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-sm',
    md: 'px-5 py-2.5 text-sm rounded-sm',
    lg: 'px-7 py-3.5 text-base rounded-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
