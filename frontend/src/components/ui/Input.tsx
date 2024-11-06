import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '../../utils/styles';
import { useLanguage } from '../../i18n';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  helperText,
  fullWidth = false,
  startIcon,
  endIcon,
  type = 'text',
  disabled,
  required,
  ...props
}, ref) => {
  const { t } = useLanguage();

  // Base styles
  const baseInputStyles = `
    block rounded-md border px-3 py-2 text-content
    placeholder:text-gray-400
    disabled:cursor-not-allowed disabled:opacity-50
    focus:outline-none focus:ring-2 focus:ring-offset-0
  `;

  // State-based styles
  const stateStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-primary focus:ring-primary';

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Icon padding
  const iconPadding = {
    left: startIcon ? 'pl-10' : '',
    right: endIcon ? 'pr-10' : ''
  };

  return (
    <div className={cn('flex flex-col', fullWidth && 'w-full')}>
      {label && (
        <label 
          className={cn(
            'mb-1 text-sm font-medium',
            error ? 'text-red-500' : 'text-content-light'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-content-light">
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          className={cn(
            baseInputStyles,
            stateStyles,
            widthStyles,
            iconPadding.left,
            iconPadding.right,
            className
          )}
          {...props}
        />

        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-content-light">
            {endIcon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p 
          id={`${props.id}-error`}
          className={cn(
            'mt-1 text-sm',
            error ? 'text-red-500' : 'text-content-light'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
