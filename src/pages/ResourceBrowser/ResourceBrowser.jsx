import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  Download, 
  Upload,
  ArrowLeft,
  Search,
  Grid,
  List,
  Clock,
  HardDrive,
  Plus,
  X
} from 'lucide-react';
import TopNavigation from '../../components/TopNavigation';
import AntigravityBackground from '../../components/AntigravityBackground';
import { api } from '../../utils/api';

const ResourceBrowser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Initial data from navigation state
  useEffect(() => {
    if (location.state?.resourceData) {
      // Assuming the API returns a list of items directly or wrapped in data
      const initialData = location.state.resourceData.data || location.state.resourceData;
      setResources(Array.isArray(initialData) ? initialData : []);
    }
  }, [location.state]);

  const getCurrentParentId = () => {
    // 1. If we are deep in folders, use the last folder's ID from path
    if (currentPath.length > 0) {
      return currentPath[currentPath.length - 1].id;
    }
    
    // 2. If we are at root, use the rootId passed from Dashboard
    if (location.state?.rootId) {
      return location.state.rootId;
    }
    
    // 3. Fallback: Try to find parentId from the first resource (unreliable if empty)
    if (resources.length > 0) {
      return resources[0].parentId;
    }

    return null;
  };

  const handleCreateDirectory = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const parentId = getCurrentParentId();
    if (!parentId) {
      alert('无法获取当前目录ID，请刷新页面重试');
      return;
    }

    setCreating(true);
    try {
      await api.createResource({
        parentId: parentId,
        nodeName: newFolderName,
        resourceType: 'DIRECTORY'
      });
      
      // Refresh current directory
      const response = await api.getResourcesChildren(parentId);
      const children = response.data || response;
      setResources(Array.isArray(children) ? children : []);
      
      setNewFolderName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create directory:', error);
      alert('创建目录失败');
    } finally {
      setCreating(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    const parentId = getCurrentParentId();
    if (!parentId) {
      alert('无法获取当前目录ID，请刷新页面重试');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Loop through all selected files
      for (const file of selectedFiles) {
        try {
          // 1. Upload file
          const uploadResult = await api.uploadFile(file);
          const { data } = uploadResult; // Assuming response structure: { code: 200, data: { ... } }

          // 2. Create resource
          await api.createResource({
            parentId: parentId,
            nodeName: file.name, // Use original filename
            resourceType: 'FILE',
            properties: {
                url: data.url,
                size: data.size
            }
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          failCount++;
        }
      }
      
      // 3. Refresh
      const response = await api.getResourcesChildren(parentId);
      const children = response.data || response;
      setResources(Array.isArray(children) ? children : []);
      
      setSelectedFiles([]);
      setShowUploadModal(false);
      
      if (failCount > 0) {
        alert(`上传完成: ${successCount} 个成功, ${failCount} 个失败`);
      }
    } catch (error) {
      console.error('Batch upload error:', error);
      alert('批量上传过程中发生错误');
    } finally {
      setUploading(false);
    }
  };


  const handleResourceClick = async (resource) => {
    if (resource.resourceType === 'DIRECTORY') {
      setLoading(true);
      try {
        const response = await api.getResourcesChildren(resource.id);
        const children = response.data || response;
        
        setCurrentPath([...currentPath, resource]);
        setResources(Array.isArray(children) ? children : []);
      } catch (error) {
        console.error('Failed to load directory:', error);
        alert('无法加载目录内容');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle file download
      if (resource.properties && resource.properties.url) {
        window.open(resource.properties.url, '_blank');
      } else {
        console.warn('File URL not found:', resource);
        alert('文件链接无效或不存在');
      }
    }
  };

  const handleBreadcrumbClick = async (index) => {
    // Navigate back to a previous directory in the path
    if (index === -1) {
        // Root (Dashboard) - Handled by back button, but we can reset if we want "Root" breadcrumb
        navigate(-1); 
        return;
    }

    const targetFolder = currentPath[index];
    const newPath = currentPath.slice(0, index + 1);
    
    setLoading(true);
    try {
        // Re-fetch the clicked folder's content
        // Note: You might need to store the children in history to avoid re-fetching, 
        // but re-fetching ensures up-to-date data.
        const response = await api.getResourcesChildren(targetFolder.id);
        const children = response.data || response;
        
        setCurrentPath(newPath);
        setResources(Array.isArray(children) ? children : []);
    } catch (error) {
        console.error('Failed to navigate back:', error);
    } finally {
        setLoading(false);
    }
  };
  
  const handleGoBack = () => {
      if (currentPath.length > 0) {
          // Go up one level
          const parentIndex = currentPath.length - 2;
          if (parentIndex < 0) {
             // If we are at the first level deep, going back means resetting to initial state 
             // OR going back to dashboard. 
             // Since we don't have the initial "Root" ID easily available unless we stored it,
             // simpler to just navigate back to dashboard if path is empty.
             navigate('/dashboard');
          } else {
              handleBreadcrumbClick(parentIndex);
          }
      } else {
          navigate('/dashboard');
      }
  };


  const filteredResources = resources.filter(item => 
    item.nodeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-rajdhani text-slate-800">
      <AntigravityBackground />
      
      {/* Create Directory Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-100 transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-orbitron text-slate-800">NEW DIRECTORY</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateDirectory}>
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
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  disabled={creating || !newFolderName.trim()}
                  className="flex-1 px-4 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>CREATE <Plus className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-100 transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-orbitron text-slate-800">UPLOAD FILE</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFileUpload}>
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
                  onClick={() => setShowUploadModal(false)}
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
      )}

      {/* Top Navigation */}
      <TopNavigation />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
             <button 
               onClick={handleGoBack}
               className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors mb-4 group"
             >
               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               <span className="font-mono text-xs font-bold tracking-wider uppercase">Back</span>
             </button>
             
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 text-xl font-bold text-slate-800 font-orbitron flex-wrap">
               <span className="text-slate-400 cursor-pointer hover:text-cyan-600 transition-colors" onClick={() => navigate('/dashboard')}>
                 ROOT
               </span>
               {currentPath.map((folder, index) => (
                 <React.Fragment key={folder.id}>
                   <ChevronRight className="w-5 h-5 text-slate-300" />
                   <span 
                     className={`cursor-pointer transition-colors ${index === currentPath.length - 1 ? 'text-cyan-600' : 'text-slate-600 hover:text-cyan-600'}`}
                     onClick={() => handleBreadcrumbClick(index)}
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
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">NEW FOLDER</span>
            </button>
            
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-xl hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/10 font-bold text-sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">UPLOAD</span>
            </button>
            
            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Filter resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-transparent outline-none text-sm font-mono w-48 md:w-64 placeholder:text-slate-400"
              />
            </div>
            <div className="w-px h-6 bg-slate-200"></div>
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

        {/* Content Area */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-24">
             <div className="w-12 h-12 border-4 border-slate-100 border-t-cyan-500 rounded-full animate-spin"></div>
             <p className="mt-4 text-slate-400 font-mono text-sm animate-pulse">LOADING DATA STREAM...</p>
           </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'flex flex-col gap-3'}
          `}>
            {filteredResources.length > 0 ? (
              filteredResources.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleResourceClick(item)}
                  className={`
                    group bg-white/70 backdrop-blur-sm border border-slate-200 hover:border-cyan-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all cursor-pointer relative overflow-hidden
                    ${viewMode === 'grid' ? 'rounded-2xl p-6 flex flex-col items-center text-center hover:-translate-y-1' : 'rounded-xl p-4 flex items-center gap-4 hover:translate-x-1'}
                  `}
                >
                  {/* Item Icon */}
                  <div className={`
                    relative z-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors
                    ${viewMode === 'grid' ? 'w-16 h-16 mb-4 shadow-sm' : 'w-10 h-10'}
                  `}>
                    {item.resourceType === 'DIRECTORY' ? (
                      <Folder className="w-8 h-8 text-amber-400 fill-amber-400/20" strokeWidth={1.5} />
                    ) : (
                      <FileText className="w-8 h-8 text-cyan-500" strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Item Info */}
                  <div className={`${viewMode === 'grid' ? 'w-full' : 'flex-1 flex justify-between items-center'}`}>
                    <div className={`${viewMode === 'grid' ? '' : 'flex flex-col'}`}>
                        <h3 className="font-bold text-slate-700 text-sm group-hover:text-cyan-700 transition-colors truncate px-2">
                        {item.nodeName}
                        </h3>
                        {viewMode === 'list' && (
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {item.updatedAt || '2024-03-20'} • {item.size || '--'}
                            </span>
                        )}
                    </div>

                    {viewMode === 'grid' && (
                        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{item.updatedAt || '2024-03-20'}</span>
                        </div>
                    )}
                  </div>

                  {/* Actions / Hover Effect */}
                  {item.resourceType !== 'DIRECTORY' && (
                    <div 
                        className={`absolute ${viewMode === 'grid' ? 'top-3 right-3' : 'right-4'} opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the main card click
                            handleResourceClick(item);
                        }}
                    >
                        <Download className="w-4 h-4 text-slate-400 hover:text-cyan-600" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <HardDrive className="w-12 h-12 mb-4 text-slate-300" />
                <p className="font-mono text-sm">NO RESOURCES FOUND</p>
                <p className="text-xs opacity-60 mt-1">Directory is empty</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourceBrowser;
