import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useLanguage } from '../../i18n';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  error,
  helperText,
  fullWidth = false,
  options,
  value,
  onChange,
  disabled,
  required,
  startIcon,
  endIcon,
  ...props
}, ref) => {
  const { t } = useLanguage();

  // Base styles
  const baseSelectStyles = `
    block rounded-md border px-3 py-2 text-content
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
    right: 'pr-10' // Always have right padding for chevron
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Convert to number if the value is numeric
    const newValue = !isNaN(Number(e.target.value)) ? Number(e.target.value) : e.target.value;
    onChange(newValue);
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

        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          className={cn(
            baseSelectStyles,
            stateStyles,
            widthStyles,
            iconPadding.left,
            iconPadding.right,
            'appearance-none',
            className
          )}
          {...props}
        >
          <option value="">{t('common.select')}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {endIcon ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-content-light">
            {endIcon}
          </div>
        ) : (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-content-light">
            <ChevronDown className="h-4 w-4" />
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

Select.displayName = 'Select';

export default Select;
