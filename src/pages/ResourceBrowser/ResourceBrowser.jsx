import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Folder, 
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
  X,
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileArchive,
  MonitorPlay // For PPT
} from 'lucide-react';
import TopNavigation from '../../components/TopNavigation';
import AntigravityBackground from '../../components/AntigravityBackground';
import { api } from '../../utils/api';

const ResourceBrowser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState([]);
  const [resources, setResources] = useState([]);
  const [rootId, setRootId] = useState(null);
  const [rootName, setRootName] = useState('ROOT');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailResource, setSelectedDetailResource] = useState(null);

  // State Persistence & Initialization
  useEffect(() => {
    const init = async () => {
      // 1. Priority: Fresh navigation from Dashboard (Legacy direct data pass - unlikely now)
      if (location.state?.resourceData) {
        const initialData = location.state.resourceData.data || location.state.resourceData;
        setResources(Array.isArray(initialData) ? initialData : []);
        setRootId(location.state.rootId);
        setRootName(location.state.rootName || 'ROOT');
        setCurrentPath([]);
        return;
      }

      // 2. Priority: New "Category Intent" navigation (Dashboard passes category name, we fetch)
      if (location.state?.category) {
        setLoading(true);
        try {
            const category = location.state.category;
            setRootName(location.state.rootName || 'ROOT');
            
            // Step 1: Get Root ID
            const rootIdRes = await api.getResourcesRootId(category);
            const fetchedRootId = rootIdRes.data;
            setRootId(fetchedRootId);
            
            // Step 2: Get Children
            const childrenRes = await api.getResourcesChildren(fetchedRootId);
            const children = childrenRes.data || childrenRes;
            setResources(Array.isArray(children) ? children : []);
            setCurrentPath([]);
        } catch (error) {
            console.error('Failed to load category resources:', error);
            alert('Failed to load resources. Please try again.');
        } finally {
            setLoading(false);
        }
        return;
      }

      // 3. Fallback: Restore from sessionStorage (Refresh scenario)
      const storageKey = `resource_state_${location.pathname}`;
      const storedJson = sessionStorage.getItem(storageKey);
      if (storedJson) {
        const stored = JSON.parse(storedJson);
        // Simple check: if stored rootId exists, we assume it's valid to restore
        if (stored.rootId) {
          console.log('Restoring session state...');
          setCurrentPath(stored.currentPath || []);
          setRootId(stored.rootId);
          setRootName(stored.rootName || 'ROOT');

          const lastFolder = stored.currentPath && stored.currentPath.length > 0 
            ? stored.currentPath[stored.currentPath.length - 1] 
            : null;
          const targetId = lastFolder ? lastFolder.id : stored.rootId;

          if (targetId) {
            setLoading(true);
            try {
              const response = await api.getResourcesChildren(targetId);
              const children = response.data || response;
              setResources(Array.isArray(children) ? children : []);
            } catch (error) {
              console.error('Failed to restore resources:', error);
            } finally {
              setLoading(false);
            }
          }
        }
      }
    };
    init();
  }, [location.state, location.pathname]);

  // Save state on change
  useEffect(() => {
    if (rootId) {
      const storageKey = `resource_state_${location.pathname}`;
      const stateToSave = {
        currentPath,
        rootId,
        rootName,
        timestamp: Date.now()
      };
      sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }
  }, [currentPath, rootId, rootName, location.pathname]);

  const getCurrentParentId = () => {
    // 1. If we are deep in folders, use the last folder's ID from path
    if (currentPath.length > 0) {
      return currentPath[currentPath.length - 1].id;
    }
    
    // 2. Use stored rootId state
    if (rootId) {
      return rootId;
    }
    
    // 3. Fallback to location.state (for very first render before effect runs)
    if (location.state?.rootId) {
      return location.state.rootId;
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


  const formatSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '--';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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
      // Handle file detail view
      setSelectedDetailResource(resource);
      setShowDetailModal(true);
    }
  };

  const handleDownload = (resource) => {
    if (resource?.properties?.url) {
        window.open(resource.properties.url, '_blank');
    } else {
        alert('文件链接无效');
    }
  };

  const handleBreadcrumbClick = async (index) => {
    // Navigate back to a previous directory in the path
    if (index === -1) {
        // Reset to root of this resource browser
        setCurrentPath([]);
        if (rootId) {
             setLoading(true);
             try {
                 const response = await api.getResourcesChildren(rootId);
                 const children = response.data || response;
                 setResources(Array.isArray(children) ? children : []);
             } catch (error) {
                 console.error('Failed to load root resources:', error);
             } finally {
                 setLoading(false);
             }
        }
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
      navigate('/dashboard');
  };

  const getFileIcon = (extension) => {
    const ext = extension?.toLowerCase() || '';
    
    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
        return <FileImage className="w-8 h-8 text-purple-500" strokeWidth={1.5} />;
    }
    // Documents
    if (['doc', 'docx', 'pdf', 'txt', 'rtf'].includes(ext)) {
        return <FileText className="w-8 h-8 text-blue-500" strokeWidth={1.5} />;
    }
    // Slides / PPT
    if (['ppt', 'pptx'].includes(ext)) {
        return <MonitorPlay className="w-8 h-8 text-orange-500" strokeWidth={1.5} />;
    }
    // Spreadsheets / Excel
    if (['xls', 'xlsx', 'csv'].includes(ext)) {
        return <FileSpreadsheet className="w-8 h-8 text-green-500" strokeWidth={1.5} />;
    }
    // Code
    if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'c', 'cpp'].includes(ext)) {
        return <FileCode className="w-8 h-8 text-slate-600" strokeWidth={1.5} />;
    }
    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
        return <FileArchive className="w-8 h-8 text-yellow-600" strokeWidth={1.5} />;
    }
    // Video
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
        return <FileVideo className="w-8 h-8 text-red-500" strokeWidth={1.5} />;
    }
    // Audio
    if (['mp3', 'wav', 'ogg'].includes(ext)) {
        return <FileAudio className="w-8 h-8 text-pink-500" strokeWidth={1.5} />;
    }
    
    // Default
    return <File className="w-8 h-8 text-slate-400" strokeWidth={1.5} />;
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--';
    try {
        const date = new Date(isoString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(/\//g, '-');
    } catch {
        return isoString;
    }
  };

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

      {/* File Detail Modal */}
      {showDetailModal && selectedDetailResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg border border-slate-100 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold font-orbitron text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-600" /> FILE DETAILS
              </h3>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 mb-4 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">
                    {getFileIcon(selectedDetailResource.properties?.extension)}
                </div>
                <h2 className="text-xl font-bold text-slate-800 text-center break-all px-4">
                    {selectedDetailResource.nodeName}
                </h2>
                <span className="mt-2 px-3 py-1 bg-slate-100 text-slate-500 text-xs font-mono rounded-full font-bold uppercase tracking-wider">
                    {selectedDetailResource.properties?.extension || 'UNKNOWN'} TYPE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Uploaded By</p>
                    <p className="font-medium text-slate-700 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">
                            {selectedDetailResource.ownerName?.[0] || 'U'}
                        </div>
                        {selectedDetailResource.ownerName || 'Unknown'}
                    </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">File Size</p>
                    <p className="font-mono font-medium text-slate-700">
                        {formatSize(selectedDetailResource.properties?.size || selectedDetailResource.size)}
                    </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created At</p>
                    <p className="font-mono text-xs font-medium text-slate-700 mt-1">
                        {formatTime(selectedDetailResource.createdAt)}
                    </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Updated At</p>
                    <p className="font-mono text-xs font-medium text-slate-700 mt-1">
                        {formatTime(selectedDetailResource.updatedAt)}
                    </p>
                </div>
              </div>

              <button 
                onClick={() => handleDownload(selectedDetailResource)}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/30 hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-3 group"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                <span>DOWNLOAD FILE</span>
              </button>
            </div>
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
               <span className="text-slate-400 cursor-pointer hover:text-cyan-600 transition-colors" onClick={() => handleBreadcrumbClick(-1)}>
                 {rootName}
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
            {resources.length > 0 ? (
              resources.map((item) => (
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
                      getFileIcon(item.properties?.extension)
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
                                {formatTime(item.updatedAt)} • {item.size || '--'}
                            </span>
                        )}
                    </div>

                    {viewMode === 'grid' && (
                        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(item.updatedAt)}</span>
                        </div>
                    )}
                  </div>

                  {/* Actions / Hover Effect */}
                  {item.resourceType !== 'DIRECTORY' && (
                    <div 
                        className={`absolute ${viewMode === 'grid' ? 'top-3 right-3' : 'right-4'} opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the main card click
                            handleDownload(item);
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
