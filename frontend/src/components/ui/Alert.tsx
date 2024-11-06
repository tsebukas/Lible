import { ReactNode, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../utils/styles';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
}

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  showIcon = true
}: AlertProps) => {
  // Variant-based styles
  const variantStyles = {
    success: {
      wrapper: 'bg-green-50 text-green-800',
      icon: 'text-green-500',
      closeButton: 'hover:bg-green-100'
    },
    error: {
      wrapper: 'bg-red-50 text-red-800',
      icon: 'text-red-500',
      closeButton: 'hover:bg-red-100'
    },
    warning: {
      wrapper: 'bg-orange-50 text-orange-800',
      icon: 'text-orange-500',
      closeButton: 'hover:bg-orange-100'
    },
    info: {
      wrapper: 'bg-blue-50 text-blue-800',
      icon: 'text-blue-500',
      closeButton: 'hover:bg-blue-100'
    }
  };

  // Variant icons
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const Icon = icons[variant];

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg p-4',
        variantStyles[variant].wrapper,
        className
      )}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon className={cn('h-5 w-5 mt-0.5', variantStyles[variant].icon)} />
        )}
        
        <div className="flex-1">
          {title && (
            <h3 className="font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-lg p-1.5 -mr-1.5 -mt-1.5',
              variantStyles[variant].closeButton
            )}
          >
            <span className="sr-only">Sulge</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Convenience components for common use cases
Alert.Success = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="success" {...props} />
);

Alert.Error = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="error" {...props} />
);

Alert.Warning = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="warning" {...props} />
);

Alert.Info = (props: Omit<AlertProps, 'variant'>) => (
  <Alert variant="info" {...props} />
);

// Toast style alert that auto-dismisses
interface ToastProps extends AlertProps {
  duration?: number;
}

Alert.Toast = ({ duration = 5000, ...props }: ToastProps) => {
  useEffect(() => {
    if (duration > 0 && props.onClose) {
      const timer = setTimeout(props.onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, props.onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
      <Alert {...props} />
    </div>
  );
};

export default Alert;
