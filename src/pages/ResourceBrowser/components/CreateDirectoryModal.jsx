import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const CreateDirectoryModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [newFolderName, setNewFolderName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onSubmit(newFolderName);
      setNewFolderName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-100 transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-orbitron text-slate-800">NEW DIRECTORY</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-mono font-bold text-slate-500 uppercase mb-2">Directory Name</label>
            <input 
              type="text" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name..."
              autoFocus
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium"
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              CANCEL
            </button>
            <button 
              type="submit"
              disabled={loading || !newFolderName.trim()}
              className="flex-1 px-4 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>CREATE <Plus className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDirectoryModal;
