import React, { useState } from 'react';
import { 
  Search,
  Bell,
  User,
  LogOut,
  Cpu,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import CreateUserModal from './CreateUserModal';
import Toast from './Toast';

const TopNavigation = () => {
  const navigate = useNavigate();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

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
            <div className="hidden md:flex items-center bg-slate-100/80 border border-slate-200 rounded-full px-4 py-2 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-md transition-all w-64 group">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH DATABASE..." 
                className="bg-transparent border-none outline-none ml-2 text-sm text-slate-600 w-full placeholder:text-slate-400 font-mono"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-cyan-600 hover:bg-slate-100 rounded-full relative transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-sm animate-pulse"></span>
              </button>
              
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
                      <button 
                        onClick={() => setShowCreateUserModal(true)}
                        className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-cyan-600 flex items-center gap-3 transition-colors font-medium"
                      >
                        <UserPlus className="w-4 h-4" /> 分配用户
                      </button>
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
    </>
  );
};

export default TopNavigation;
