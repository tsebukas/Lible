import { Fragment, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useLanguage } from '../../i18n';
import Button from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className
}: DialogProps) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  // Size-based max-width styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        aria-hidden="true"
      />

      {/* Dialog overlay */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        onClick={handleOverlayClick}
        aria-labelledby="dialog-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Dialog panel */}
          <div
            className={cn(
              'w-full rounded-lg bg-white shadow-xl',
              'transform transition-all',
              sizeStyles[size],
              className
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-b px-4 py-3">
                {title && (
                  <h2
                    id="dialog-title"
                    className="text-lg font-medium text-content"
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 text-content-light hover:bg-gray-100 hover:text-content"
                    aria-label={t('common.close')}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-4 py-4">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="border-t px-4 py-3 bg-gray-50 rounded-b-lg">
                <div className="flex justify-end gap-2">{footer}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// Convenience components for common dialog actions
Dialog.Footer = {
  Buttons: ({ 
    onCancel, 
    onConfirm, 
    cancelText, 
    confirmText,
    isLoading
  }: {
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
    isLoading?: boolean;
  }) => {
    const { t } = useLanguage();
    return (
      <>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText || t('common.cancel')}
        </Button>
        <Button
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText || t('common.save')}
        </Button>
      </>
    );
  }
};

export default Dialog;
