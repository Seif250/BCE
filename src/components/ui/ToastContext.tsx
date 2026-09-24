import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-2 pointer-events-none px-4 max-w-md w-full"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#062A67] to-[#0a3580] text-white shadow-xl border border-bc-teal-400/40 text-xs sm:text-sm font-black animate-fade-in"
            style={{ animationDuration: '200ms' }}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
            ) : (
              <Info className="w-4 h-4 text-bc-teal-300 flex-shrink-0" aria-hidden="true" />
            )}
            <span className="tracking-tight">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
