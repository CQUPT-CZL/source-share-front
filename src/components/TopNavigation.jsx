import React, { useState, useRef, useEffect } from 'react';
import { 
  Search,
  User,
  LogOut,
  Cpu,
  UserPlus,
  Activity,
  File,
  Folder,
  Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import CreateUserModal from './CreateUserModal';
import LogViewerModal from './LogViewerModal';
import Toast from './Toast';

const TopNavigation = ({ currentFolderId, onFileClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setShowResults(true);
    try {
      const res = await api.searchResources(searchQuery, currentFolderId);
      if (res && res.code === 200) {
        setSearchResults(res.data || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleResultClick = (item) => {
    // 1. If it's a file, trigger the callback to show detail modal
    if (item.resourceType === 'FILE') {
        if (onFileClick) {
            onFileClick(item);
        } else {
            console.warn('File click handler not provided to TopNavigation');
        }
        setShowResults(false);
        return;
    }

    // 2. If it's a directory, navigate to it
    let targetPath = location.pathname;
    if (targetPath === '/dashboard' || targetPath === '/') {
        // Map category/displayPath to route if possible, otherwise default to homework
        // This is a simple heuristic; robust solution would map root ID to route
        targetPath = '/homework'; 
    }
    
    // Use the ID directly for folder navigation
    navigate(`${targetPath}?folder=${item.id}`);
    setShowResults(false);
  };

  // Get user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const user = {
    name: storedUser.realName || "崔子梁",
    username: storedUser.username || "Felix",
    role: storedUser.role || "牛马研究生",
    email: storedUser.email || "",
    grade: storedUser.grade || ""
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCreateUser = async (formData) => {
    setCreatingUser(true);
    try {
      const response = await api.registerUser(formData);
      if (response && response.code === 200) {
        setShowCreateUserModal(false);
        setToast({ message: 'User created successfully!', type: 'success' });
      } else {
        setToast({ 
          message: response?.message || 'Failed to create user: ' + (response?.code || 'Unknown error'), 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      setToast({ message: 'Network error or server unreachable.', type: 'error' });
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, message: '' })} 
      />
      <nav className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 px-6 py-4 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-200/40 blur-lg rounded-full group-hover:bg-cyan-300/50 transition-all duration-500"></div>
              <div className="relative bg-white p-2 rounded-lg border border-slate-200 shadow-sm group-hover:border-cyan-300 transition-colors">
                <Cpu className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-wider font-orbitron">
                LL-GROUP <span className="text-cyan-600">内部资源共享仓</span>
              </h1>
              <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase font-bold">Academic Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div ref={searchRef} className="relative hidden md:flex flex-col z-50">
              <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-full px-4 py-2 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-md transition-all w-64 group">
                <Search 
                  className={`w-4 h-4 transition-colors cursor-pointer ${searching ? 'text-cyan-500 animate-pulse' : 'text-slate-400 group-focus-within:text-cyan-500'}`} 
                  onClick={handleSearch}
                />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searching ? "SEARCHING..." : "SEARCH DATABASE..."}
                  className="bg-transparent border-none outline-none ml-2 text-sm text-slate-600 w-full placeholder:text-slate-400 font-mono"
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden max-h-80 overflow-y-auto animate-fade-in-up">
                  {searching ? (
                    <div className="p-4 flex items-center justify-center text-slate-400 gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs font-mono">SEARCHING...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => handleResultClick(item)}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none flex items-center gap-3 transition-colors group"
                        >
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-cyan-50 transition-colors">
                            {item.resourceType === 'DIRECTORY' ? (
                              <Folder className="w-4 h-4 text-amber-500" />
                            ) : (
                              <File className="w-4 h-4 text-cyan-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-700 truncate font-rajdhani group-hover:text-cyan-700 transition-colors">{item.nodeName}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono truncate">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                                {item.properties?.displayPath || 'ROOT'}
                              </span>
                              <span>•</span>
                              <span>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-xs font-mono">
                      NO RESULTS FOUND
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 tracking-wide">{user.name}</p>
                  <p className="text-[10px] text-cyan-600 uppercase tracking-wider font-mono font-bold">{user.role}</p>
                </div>
                
                <div className="relative group cursor-pointer">
                  {/* Outer Glow Ring */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur-md transition-all duration-500"></div>
                  
                  {/* Avatar Container */}
                  <div className="relative w-10 h-10 rounded-full border border-white/50 shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300 bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center overflow-hidden ring-2 ring-transparent group-hover:ring-cyan-400/30">
                    {/* Glass Reflection Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
                    
                    <span className="font-orbitron font-black text-white text-xs tracking-widest drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                      {user.username.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-4 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform origin-top-right border border-slate-100 z-50 translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">User Profile</p>
                      {user.grade && <p className="text-xs text-slate-500 font-medium mt-1">Grade: {user.grade}级</p>}
                      {user.email && <p className="text-xs text-slate-500 truncate mt-0.5" title={user.email}>{user.email}</p>}
                    </div>
                    <a href="#" className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-cyan-600 flex items-center gap-3 transition-colors font-medium">
                      <User className="w-4 h-4" /> 个人资料
                    </a>
                    {(user.role === 'admin' || user.role === 'ADMIN') && (
                      <>
                        <button 
                          onClick={() => setShowCreateUserModal(true)}
                          className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-cyan-600 flex items-center gap-3 transition-colors font-medium"
                        >
                          <UserPlus className="w-4 h-4" /> 分配用户
                        </button>
                        <button 
                          onClick={() => setShowLogModal(true)}
                          className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-cyan-600 flex items-center gap-3 transition-colors font-medium"
                        >
                          <Activity className="w-4 h-4" /> 用户活动
                        </button>
                      </>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" /> 退出系统
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <CreateUserModal 
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onSubmit={handleCreateUser}
        loading={creatingUser}
      />
      
      <LogViewerModal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
      />
    </>
  );
};

export default TopNavigation;
