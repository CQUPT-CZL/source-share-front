import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-24 right-6 z-[100] animate-fade-in-left">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md ${
        isSuccess 
          ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800' 
          : 'bg-rose-50/90 border-rose-100 text-rose-800'
      }`}>
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-500" />
        )}
        
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>

        <button 
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-black/5 transition-colors ${
            isSuccess ? 'text-emerald-500' : 'text-rose-500'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
