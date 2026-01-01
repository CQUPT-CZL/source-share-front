import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const UploadFileModal = ({ isOpen, onClose, onUpload, uploading }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      // Reset after upload happens in parent or we can do it here if parent doesn't close immediately
      // But typically parent handles logic. We can clear on close.
    }
  };

  // Clear files when closed
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFiles([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-100 transform transition-all scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold font-orbitron text-slate-800">UPLOAD FILE</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-mono font-bold text-slate-500 uppercase mb-2">Select Files</label>
            <div className="relative">
              <input 
                type="file" 
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
              />
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-2 text-xs font-mono text-slate-500">
                <p className="mb-1 font-bold">{selectedFiles.length} file(s) selected:</p>
                <ul className="list-disc list-inside max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, idx) => (
                    <li key={idx} className="truncate">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              disabled={uploading || selectedFiles.length === 0}
              className="flex-1 px-4 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>UPLOAD ALL <Upload className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFileModal;
