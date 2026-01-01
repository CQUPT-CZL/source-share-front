import React from 'react';
import { X, FileText, Download, Trash2 } from 'lucide-react';
import { getFileConfig, formatSize, formatTime } from '../../../utils/resourceUtils.jsx';

const FileDetailModal = ({ isOpen, onClose, resource, onDownload, onDelete, currentUser }) => {
  if (!isOpen || !resource) return null;

  const fileConfig = getFileConfig(resource.properties?.extension);
  
  // Permission Check
  const isOwner = currentUser?.id && String(resource.createdBy) === String(currentUser.id);
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';
  const canDelete = isOwner || isAdmin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg border border-slate-100 overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold font-orbitron text-slate-800 flex items-center gap-2">
            <fileConfig.icon className={`w-5 h-5 ${fileConfig.color}`} /> FILE DETAILS
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className={`w-24 h-24 mb-4 ${fileConfig.bgColor} rounded-2xl flex items-center justify-center shadow-inner`}>
                <fileConfig.icon className={`w-12 h-12 ${fileConfig.color}`} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 text-center break-all px-4">
                {resource.nodeName}
            </h2>
            <span className={`mt-2 px-3 py-1 ${fileConfig.bgColor} ${fileConfig.color} text-xs font-mono rounded-full font-bold uppercase tracking-wider border ${fileConfig.borderColor}`}>
                {fileConfig.label} TYPE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Uploaded By</p>
                <p className="font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
                        {resource.ownerName?.[0] || 'U'}
                    </div>
                    {resource.ownerName || 'Unknown'}
                </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">File Size</p>
                <p className="font-mono font-medium text-slate-700">
                    {formatSize(resource.properties?.size || resource.size)}
                </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created At</p>
                <p className="font-mono text-xs font-medium text-slate-700 mt-1">
                    {formatTime(resource.createdAt)}
                </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Updated At</p>
                <p className="font-mono text-xs font-medium text-slate-700 mt-1">
                    {formatTime(resource.updatedAt)}
                </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button 
                onClick={() => onDownload(resource)}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/30 hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-3 group"
            >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>DOWNLOAD FILE</span>
            </button>
            
            {canDelete && (
                <button 
                    onClick={() => onDelete(resource)}
                    className="text-xs font-bold text-slate-300 hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5 py-2"
                >
                    <Trash2 className="w-3 h-3" />
                    <span>DELETE THIS RESOURCE</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailModal;
