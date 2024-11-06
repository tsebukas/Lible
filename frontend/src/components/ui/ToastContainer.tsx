import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Alert from './Alert';
import type { Toast } from '../../hooks/useToast';
import { appConfig } from '../../config/app.config';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { position, maxToasts, animation } = appConfig.toast;

  // Position styles
  const positionStyles = {
    top: {
      right: 'top-4 right-4',
      center: 'top-4 left-1/2 -translate-x-1/2',
      left: 'top-4 left-4'
    },
    bottom: {
      right: 'bottom-4 right-4',
      center: 'bottom-4 left-1/2 -translate-x-1/2',
      left: 'bottom-4 left-4'
    }
  };

  // Animation variants
  const variants = {
    initial: {
      opacity: 0,
      y: position.vertical === 'top' ? -20 : 20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: position.vertical === 'top' ? -20 : 20
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  // Take only the latest toasts up to maxToasts
  const visibleToasts = toasts.slice(-maxToasts);

  return createPortal(
    <div 
      className={`fixed z-[${appConfig.ui.theme.zIndex.toast}] pointer-events-none
        flex flex-col ${position.vertical === 'top' ? 'gap-2' : 'gap-2 flex-col-reverse'}
        ${positionStyles[position.vertical][position.horizontal]}
        max-w-md w-full`}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="sync" initial={false}>
        {visibleToasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{
              duration: animation.enter / 1000, // Convert to seconds
              ease: [0.4, 0, 0.2, 1]
            }}
            className="pointer-events-auto"
          >
            <Alert
              variant={toast.variant}
              onClose={() => onRemove(toast.id)}
              className="shadow-lg"
            >
              {toast.message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default ToastContainer;
