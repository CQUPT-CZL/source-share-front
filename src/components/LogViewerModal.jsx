import React, { useState, useEffect } from 'react';
import { X, Activity, Clock, User, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

const LogViewerModal = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.getLogs(page, pageSize);
      if (response && response.code === 200 && response.data) {
        setLogs(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      } else {
        console.error('Failed to fetch logs:', response);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    // Handle array format [yyyy, MM, dd, HH, mm, ss] if necessary, or ISO string
    if (Array.isArray(dateString)) {
        const [year, month, day, hour, minute, second] = dateString;
        return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
    }
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-100 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h3 className="text-lg font-bold font-orbitron text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" /> SYSTEM LOGS
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-mono">
                TOTAL: {totalElements}
            </span>
            <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 hover:bg-slate-100"
            >
                <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-0">
            {loading && logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-sm">Loading logs...</p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <div className="flex items-center gap-2"><User className="w-3 h-3" /> User</div>
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <div className="flex items-center gap-2"><Activity className="w-3 h-3" /> Action</div>
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> Resource</div>
                            </th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> Time</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.length > 0 ? logs.map((log, index) => (
                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-3 text-sm text-slate-700 font-medium">
                                    {log.realName || 'Unknown'}
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                                        log.operationType === 'DELETE' 
                                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                                            : log.operationType === 'UPLOAD' || log.operationType === 'CREATE'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                        {log.operationType}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-600 font-mono">
                                    {log.resourceName || '-'}
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-500">
                                    {formatDate(log.operationTime)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">
                                    No logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>

        {/* Footer / Pagination */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 shrink-0 flex justify-between items-center">
            <span className="text-xs text-slate-500">
                Page {page + 1} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0 || loading}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1 || loading}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewerModal;