import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import TopNavigation from '../../components/TopNavigation';
import AntigravityBackground from '../../components/AntigravityBackground';
import { api } from '../../utils/api';

// Components
import ResourceHeader from './components/ResourceHeader';
import ResourceList from './components/ResourceList';
import CreateDirectoryModal from './components/CreateDirectoryModal';
import UploadFileModal from './components/UploadFileModal';
import FileDetailModal from './components/FileDetailModal';

const CATEGORY_MAP = {
  '/homework': { en: 'COURSEWORK', cn: '课程作业' },
  '/proposal': { en: 'PROPOSAL', cn: '开题报告' },
  '/midterm': { en: 'MIDTERM', cn: '中期考核' },
  '/thesis': { en: 'THESIS', cn: '毕业设计' },
  '/message-board': { en: 'MESSAGE BOARD', cn: '留言板' },
};

const ResourceBrowser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [currentPath, setCurrentPath] = useState([]);
  const [resources, setResources] = useState([]);
  const [rootId, setRootId] = useState(null);
  const [rootName, setRootName] = useState('ROOT');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
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
      
      // Check if URL has specific folder intent (Deep Linking)
      const urlFolderId = searchParams.get('folder');
      
      if (storedJson) {
        const stored = JSON.parse(storedJson);
        // If stored state matches URL (or URL is empty and stored is root), use stored state to preserve breadcrumbs
        const lastStoredId = stored.currentPath?.length > 0 
            ? stored.currentPath[stored.currentPath.length - 1].id 
            : stored.rootId;
            
        // If URL matches stored state, OR if no URL param (meaning we want what's stored), restore it
        if (!urlFolderId || String(urlFolderId) === String(lastStoredId)) {
            if (stored.rootId) {
                console.log('Restoring session state...');
                setCurrentPath(stored.currentPath || []);
                setRootId(stored.rootId);
                setRootName(stored.rootName || 'ROOT');

                const targetId = lastStoredId;
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
                return;
            }
        }
      }

      // 4. Priority: Deep Link (URL param present, no matching session state)
      if (urlFolderId) {
         setLoading(true);
         try {
             const categoryInfo = CATEGORY_MAP[location.pathname] || { en: 'COURSEWORK', cn: '资源' };
             setRootName(categoryInfo.cn);
             
             // We need root ID for context
             const rootIdRes = await api.getResourcesRootId(categoryInfo.en);
             const fetchedRootId = rootIdRes.data;
             setRootId(fetchedRootId);
             
             // Fetch the target folder directly
             const response = await api.getResourcesChildren(urlFolderId);
             const children = response.data || response;
             setResources(Array.isArray(children) ? children : []);
             
             // We don't have breadcrumbs history for deep link, so currentPath is empty or we could try to fetch it
             setCurrentPath([]); 
             
         } catch (error) {
             console.error('Deep link failed:', error);
             // Fallback to root if deep link fails
             navigate(location.pathname);
         } finally {
             setLoading(false);
         }
         return;
      }
      
      // 5. Priority: Raw URL navigation without params (e.g. user typed /homework)
      if (!location.state && !urlFolderId) {
         const categoryInfo = CATEGORY_MAP[location.pathname];
         if (categoryInfo) {
             setLoading(true);
             try {
                 setRootName(categoryInfo.cn);
                 const rootIdRes = await api.getResourcesRootId(categoryInfo.en);
                 const fetchedRootId = rootIdRes.data;
                 setRootId(fetchedRootId);
                 
                 const childrenRes = await api.getResourcesChildren(fetchedRootId);
                 const children = childrenRes.data || childrenRes;
                 setResources(Array.isArray(children) ? children : []);
                 setCurrentPath([]);
             } catch (error) {
                 console.error('Failed to load initial resources:', error);
             } finally {
                 setLoading(false);
             }
         }
      }
      
    };
    init();
  }, [location.state, location.pathname]); 

  // Sync URL with Current Path
  useEffect(() => {
    if (currentPath.length > 0) {
        const lastFolder = currentPath[currentPath.length - 1];
        setSearchParams({ folder: lastFolder.id });
    } else {
        // At root
        if (rootId) {
             // We can remove the param to show clean URL
             setSearchParams({});
        }
    }
  }, [currentPath, setSearchParams, rootId]);

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

  const handleCreateDirectory = async (folderName) => {
    if (!folderName.trim()) return;

    const parentId = getCurrentParentId();
    if (!parentId) {
      alert('无法获取当前目录ID，请刷新页面重试');
      return;
    }

    setCreating(true);
    try {
      await api.createResource({
        parentId: parentId,
        nodeName: folderName,
        resourceType: 'DIRECTORY'
      });
      
      // Refresh current directory
      const response = await api.getResourcesChildren(parentId);
      const children = response.data || response;
      setResources(Array.isArray(children) ? children : []);
      
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create directory:', error);
      alert('创建目录失败');
    } finally {
      setCreating(false);
    }
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

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
      for (const file of files) {
        try {
          // 1. Upload file
          const uploadResult = await api.uploadFile(file);
          const { data } = uploadResult; 

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

  return (
    <div className="min-h-screen bg-slate-50 font-rajdhani text-slate-800">
      <AntigravityBackground />
      
      {/* Top Navigation */}
      <TopNavigation />

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        <ResourceHeader 
            currentPath={currentPath}
            rootName={rootName}
            onBreadcrumbClick={handleBreadcrumbClick}
            onBack={handleGoBack}
            onCreateFolder={() => setShowCreateModal(true)}
            onUpload={() => setShowUploadModal(true)}
            viewMode={viewMode}
            setViewMode={setViewMode}
        />

        <ResourceList 
            resources={resources}
            viewMode={viewMode}
            loading={loading}
            onResourceClick={handleResourceClick}
            onDownload={handleDownload}
        />

      </main>

      {/* Modals */}
      <CreateDirectoryModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDirectory}
        loading={creating}
      />

      <UploadFileModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
        uploading={uploading}
      />

      <FileDetailModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        resource={selectedDetailResource}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default ResourceBrowser;
