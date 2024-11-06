import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useLanguage } from '../../i18n';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
  text?: string;
}

const LoadingSpinner = ({
  size = 'md',
  fullScreen = false,
  className,
  text
}: LoadingSpinnerProps) => {
  const { t } = useLanguage();

  // Size-based styles
  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  // Text size based on spinner size
  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const spinner = (
    <div className={cn(
      'flex flex-col items-center justify-center',
      fullScreen && 'fixed inset-0 bg-white bg-opacity-80 z-50',
      className
    )}>
      <Loader2 
        className={cn(
          'animate-spin text-primary',
          sizeStyles[size]
        )} 
      />
      {text && (
        <p className={cn(
          'mt-2 text-content-light font-medium',
          textSizeStyles[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  // If fullScreen, render with portal to ensure it's always on top
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Convenience components for common use cases
LoadingSpinner.FullScreen = () => (
  <LoadingSpinner
    size="lg"
    fullScreen
    text="common.loading"
  />
);

LoadingSpinner.Section = () => (
  <div className="flex justify-center p-8">
    <LoadingSpinner
      size="md"
      text="common.loading"
    />
  </div>
);

LoadingSpinner.Inline = () => (
  <LoadingSpinner size="sm" />
);

export default LoadingSpinner;
