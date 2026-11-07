import React, { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold tracking-wider text-forme-text-primary uppercase mb-1.5">
            {label}
            {props.required && <span className="text-forme-status-danger ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border transition-colors duration-150 rounded-sm placeholder:text-forme-text-muted focus:outline-none focus:ring-1 focus:ring-forme-primary ${
            error
              ? 'border-forme-status-danger focus:border-forme-status-danger focus:ring-forme-status-danger'
              : 'border-forme-border hover:border-neutral-400 focus:border-forme-primary'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-forme-status-danger">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-forme-text-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

InputField.displayName = 'InputField';
