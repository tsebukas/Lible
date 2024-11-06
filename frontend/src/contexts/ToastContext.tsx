import { createContext, useContext, ReactNode } from 'react';
import { useToast as useToastHook, UseToastReturn } from '../hooks/useToast';
import ToastContainer from '../components/ui/ToastContainer';

const ToastContext = createContext<UseToastReturn | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toast = useToastHook();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer
        toasts={toast.toasts}
        onRemove={toast.removeToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
