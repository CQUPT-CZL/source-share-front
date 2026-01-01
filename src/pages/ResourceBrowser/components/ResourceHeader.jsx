import React from 'react';
import { ArrowLeft, ChevronRight, Plus, Upload, Grid, List } from 'lucide-react';

const ResourceHeader = ({ 
  currentPath, 
  rootName, 
  onBreadcrumbClick, 
  onBack, 
  onCreateFolder, 
  onUpload, 
  viewMode, 
  setViewMode 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div>
         <button 
           onClick={onBack}
           className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors mb-4 group"
         >
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           <span className="font-mono text-xs font-bold tracking-wider uppercase">Back</span>
         </button>
         
         {/* Breadcrumbs */}
         <div className="flex items-center gap-2 text-xl font-bold text-slate-800 font-orbitron flex-wrap">
           <span className="text-slate-400 cursor-pointer hover:text-cyan-600 transition-colors" onClick={() => onBreadcrumbClick(-1)}>
             {rootName}
           </span>
           {currentPath.map((folder, index) => (
             <React.Fragment key={folder.id}>
               <ChevronRight className="w-5 h-5 text-slate-300" />
               <span 
                 className={`cursor-pointer transition-colors ${index === currentPath.length - 1 ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}
                 onClick={() => onBreadcrumbClick(index)}
               >
                 {folder.nodeName.toUpperCase()}
               </span>
             </React.Fragment>
           ))}
         </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onCreateFolder}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">NEW FOLDER</span>
        </button>
        
        <button 
          onClick={onUpload}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/10 font-bold text-sm"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">UPLOAD</span>
        </button>
        
        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ResourceHeader;
