import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      type = 'button',
      disabled = false,
      loading = false,
      fullWidth = false,
      icon = null,
      iconPosition = 'left',
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn inline-flex items-center justify-center transition-colors rounded-normal focus:outline-none font-medium';
    
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      danger: 'btn-danger',
      success: 'btn-success',
      link: 'text-primary hover:underline bg-transparent',
      icon: 'p-2 text-gray-600 hover:bg-gray-100 rounded-full',
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };
    
    // אם יש אייקון בלבד, נעדיף עיצוב מותאם לאייקון
    const buttonSize = variant === 'icon' ? {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3',
      xl: 'p-4',
    }[size] : sizeClasses[size];
    
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';
    
    return (
      <button
        ref={ref}
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${buttonSize} ${widthClass} ${disabledClass} ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="mr-2">
            <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
          </span>
        )}
        
        {icon && iconPosition === 'left' && !loading && (
          <span className={`${children ? 'ml-2' : ''}`}>{icon}</span>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && (
          <span className="mr-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;