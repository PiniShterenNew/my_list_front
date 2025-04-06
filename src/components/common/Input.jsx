import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      id,
      name,
      type = 'text',
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      className = '',
      icon,
      iconPosition = 'right',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={id || name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-error mr-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={id || name}
            name={name}
            type={type}
            className={`input-field ${error ? 'border-error focus:ring-error focus:border-error' : ''} ${
              icon && iconPosition === 'left' ? 'pr-10' : ''
            } ${icon && iconPosition === 'right' ? 'pl-10' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;