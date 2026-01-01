import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md border border-slate-100 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold font-orbitron text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" /> 
            {title || 'CONFIRM ACTION'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 text-sm font-medium leading-relaxed">
            {message || 'Are you sure you want to proceed with this action? This cannot be undone.'}
          </p>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              disabled={loading}
            >
              CANCEL
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>DELETE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
