import { useState, useCallback } from 'react';
import { AlertVariant } from '../components/ui/Alert';
import { appConfig } from '../config/app.config';

export interface Toast {
  id: string;
  message: string;
  variant: AlertVariant;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((
    message: string,
    variant: AlertVariant = 'info',
    customDuration?: number
  ) => {
    const id = Math.random().toString(36).substring(2);
    
    // Get duration based on variant from config, fallback to custom duration or info duration
    const duration = customDuration ?? appConfig.toast.duration[variant] ?? appConfig.toast.duration.info;

    const toast: Toast = {
      id,
      message,
      variant,
      duration
    };

    setToasts(prev => {
      // Remove oldest toasts if we exceed maxToasts
      const newToasts = [...prev, toast];
      if (newToasts.length > appConfig.toast.maxToasts) {
        return newToasts.slice(-appConfig.toast.maxToasts);
      }
      return newToasts;
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  // Convenience methods with pre-configured durations
  const success = useCallback((message: string, duration?: number) => 
    addToast(message, 'success', duration), [addToast]);

  const error = useCallback((message: string, duration?: number) => 
    addToast(message, 'error', duration), [addToast]);

  const warning = useCallback((message: string, duration?: number) => 
    addToast(message, 'warning', duration), [addToast]);

  const info = useCallback((message: string, duration?: number) => 
    addToast(message, 'info', duration), [addToast]);

  // Method to remove all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Method to update an existing toast
  const updateToast = useCallback((
    id: string,
    updates: Partial<Omit<Toast, 'id'>>
  ) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
    updateToast
  };
}

export type UseToastReturn = ReturnType<typeof useToast>;
