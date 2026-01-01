import React from 'react';
import { Folder, Clock, Download, HardDrive, Trash2 } from 'lucide-react';
import { getFileConfig, formatTime, formatSize } from '../../../utils/resourceUtils.jsx';

const ResourceList = ({ resources, viewMode, loading, onResourceClick, onDownload, onDelete, currentUser }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-400 font-mono text-sm animate-pulse tracking-widest">LOADING DATA STREAM...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <HardDrive className="w-10 h-10 text-slate-300" />
        </div>
        <p className="font-orbitron font-bold text-lg text-slate-500">NO RESOURCES FOUND</p>
        <p className="text-sm font-mono opacity-60 mt-2">This directory is empty</p>
      </div>
    );
  }

  return (
    <div className={`
      ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-3'}
    `}>
      {resources.map((item) => {
        const isDir = item.resourceType === 'DIRECTORY';
        const fileConfig = isDir ? null : getFileConfig(item.properties?.extension);
        
        // Permission Check
          const itemOwnerId = item?.createdBy || item?.creatorId || item?.userId || item?.ownerId;
          const isOwner = currentUser?.id && itemOwnerId && String(itemOwnerId) === String(currentUser.id);
          const isAdmin = currentUser?.role && currentUser.role.toLowerCase() === 'admin';
          const canDelete = isOwner || isAdmin;

        return (
          <div 
            key={item.id}
            onClick={() => onResourceClick(item)}
            className={`
              group relative overflow-hidden cursor-pointer transition-all duration-300
              ${viewMode === 'grid' 
                ? 'bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-cyan-200' 
                : 'bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4 hover:bg-slate-50 hover:border-cyan-200'
              }
            `}
          >
            {/* Grid View Content */}
            {viewMode === 'grid' && (
              <>
                {/* Top Accent Line */}
                <div className={`h-1 w-full absolute top-0 left-0 ${isDir ? 'bg-amber-400' : fileConfig.color.replace('text-', 'bg-')}`} />
                
                {/* Card Body */}
                <div className="p-6 flex flex-col items-center h-full">
                    {/* Icon Container */}
                    <div className={`
                        w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-500
                        ${isDir ? 'bg-amber-50 text-amber-500' : `${fileConfig.bgColor} ${fileConfig.color}`}
                    `}>
                        {isDir ? (
                            <Folder className="w-10 h-10 fill-current" strokeWidth={1.5} />
                        ) : (
                            <fileConfig.icon className="w-10 h-10" strokeWidth={1.5} />
                        )}
                    </div>

                    {/* File Info */}
                    <div className="text-center w-full">
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2 group-hover:text-cyan-700 transition-colors h-10 flex items-center justify-center">
                            {item.nodeName}
                        </h3>
                        
                        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400 font-mono uppercase tracking-wide">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(item.updatedAt).split(' ')[0]}
                            </span>
                            {!isDir && (
                                <span className={`px-1.5 py-0.5 rounded ${fileConfig.bgColor} ${fileConfig.color} font-bold`}>
                                    {item.properties?.extension?.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hover Overlay Actions (for files) - NO BLUR, just simple buttons */}
                {/* Only show for files, and use simple positioning */}
                {!isDir && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDownload(item);
                            }}
                            className="p-2 bg-white text-slate-500 rounded-lg hover:bg-cyan-500 hover:text-white shadow-md border border-slate-100 transition-colors"
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                )}
              </>
            )}

            {/* List View Content */}
            {viewMode === 'list' && (
              <>
                <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center shrink-0
                    ${isDir ? 'bg-amber-50 text-amber-500' : `${fileConfig.bgColor} ${fileConfig.color}`}
                `}>
                    {isDir ? (
                        <Folder className="w-6 h-6 fill-current" strokeWidth={1.5} />
                    ) : (
                        <fileConfig.icon className="w-6 h-6" strokeWidth={1.5} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-700 text-sm truncate group-hover:text-cyan-700 transition-colors">
                        {item.nodeName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span>{formatTime(item.updatedAt)}</span>
                        {!isDir && (
                            <>
                                <span>•</span>
                                <span>{formatSize(item.properties?.size || 0)}</span>
                            </>
                        )}
                    </div>
                </div>

                {!isDir && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload(item);
                        }}
                        className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        title="Download"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResourceList;
