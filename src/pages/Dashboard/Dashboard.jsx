import React from 'react';
import { 
  BookOpen, 
  FileText, 
  Clock, 
  GraduationCap, 
  Zap,
  Activity,
  ChevronRight,
  Database,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AntigravityBackground from '../../components/AntigravityBackground';
import TopNavigation from '../../components/TopNavigation';
import { api } from '../../utils/api';

const SYSTEM_START_DATE = new Date(2025, 11, 1).getTime();
const daysOnline = Math.floor((Date.now() - SYSTEM_START_DATE) / (1000 * 60 * 60 * 24));

const Dashboard = () => {
  const navigate = useNavigate();

  // Get user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const user = {
    name: storedUser.realName || "崔子梁",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedUser.username || 'Felix'}`,
    role: storedUser.role || "牛马研究生",
    email: storedUser.email || "",
    grade: storedUser.grade || ""
  };

  const menuItems = [
    { 
      title: "课程作业", 
      enTitle: "COURSEWORK",
      icon: <BookOpen className="w-8 h-8 text-cyan-600" />, 
      desc: "接入学术任务核心数据库", 
      path: "/homework",
      color: "group-hover:text-cyan-600",
      borderColor: "group-hover:border-cyan-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(6,182,212,0.15)]",
      bgHover: "group-hover:bg-cyan-50"
    },
    { 
      title: "开题报告", 
      enTitle: "PROPOSAL",
      icon: <FileText className="w-8 h-8 text-purple-600" />, 
      desc: "初始化研究课题与方向", 
      path: "/proposal",
      color: "group-hover:text-purple-600",
      borderColor: "group-hover:border-purple-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(147,51,234,0.15)]",
      bgHover: "group-hover:bg-purple-50"
    },
    { 
      title: "中期考核", 
      enTitle: "MIDTERM",
      icon: <Clock className="w-8 h-8 text-emerald-600" />, 
      desc: "同步项目进度与里程碑", 
      path: "/midterm",
      color: "group-hover:text-emerald-600",
      borderColor: "group-hover:border-emerald-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]",
      bgHover: "group-hover:bg-emerald-50"
    },
    { 
      title: "毕业设计", 
      enTitle: "THESIS",
      icon: <GraduationCap className="w-8 h-8 text-rose-600" />, 
      desc: "最终学术成果归档系统", 
      path: "/thesis",
      color: "group-hover:text-rose-600",
      borderColor: "group-hover:border-rose-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.15)]",
      bgHover: "group-hover:bg-rose-50"
    },
    { 
      title: "留言板", 
      enTitle: "MESSAGE BOARD",
      icon: <MessageSquare className="w-8 h-8 text-amber-600" />, 
      desc: "团队内部交流与讨论", 
      path: "/message-board",
      color: "group-hover:text-amber-600",
      borderColor: "group-hover:border-amber-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(245,158,11,0.15)]",
      bgHover: "group-hover:bg-amber-50"
    },
    { 
      title: "服务器看板", 
      enTitle: "SERVER STATUS",
      icon: <img src="/rocket.svg" alt="Server" className="w-8 h-8" />, 
      desc: "高性能计算集群监控", 
      path: "https://monitor.cuizl.cn/",
      color: "group-hover:text-blue-600",
      borderColor: "group-hover:border-blue-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(37,99,235,0.15)]",
      bgHover: "group-hover:bg-blue-50"
    },
    { 
      title: "组内美食地图", 
      enTitle: "FOOD MAP",
      icon: <img src="/food.svg" alt="Food" className="w-8 h-8" />, 
      desc: "周边餐饮推荐与评价", 
      path: "http://food.cuizl.cn/",
      color: "group-hover:text-orange-600",
      borderColor: "group-hover:border-orange-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(249,115,22,0.15)]",
      bgHover: "group-hover:bg-orange-50"
    },
    { 
      title: "组会安排", 
      enTitle: "MEETING SCHEDULE",
      icon: <img src="/meeting.svg" alt="Meeting" className="w-8 h-8" />, 
      desc: "定期学术汇报时间表", 
      path: "https://meeting.cuizl.cn/",
      color: "group-hover:text-indigo-600",
      borderColor: "group-hover:border-indigo-400",
      shadow: "group-hover:shadow-[0_4px_20px_-4px_rgba(79,70,229,0.15)]",
      bgHover: "group-hover:bg-indigo-50"
    },
  ];



  const handleCardClick = async (item) => {
    // External links
    if (item.path.startsWith('http')) {
      window.open(item.path, '_blank');
      return;
    }

    try {
      // 1. Get Root ID
      const data = await api.getResourcesRootId(item.enTitle);
      console.log('Step 1 - Got Root ID:', data);
      
      // 2. Get Subdirectories (Real API Call)
      // URL: /api/resources/{id}/children
      console.log(`Step 2 - Fetching subdirectories for ID: ${data.data}`);
      const childrenData = await api.getResourcesChildren(data.data);
      console.log('Step 2 - Got Children:', childrenData);

      // 3. Navigate
      // Pass both children data AND the root ID itself
      navigate(item.path, { 
        state: { 
          resourceData: childrenData,
          rootId: data.data 
        } 
      });

    } catch (error) {
      console.error('Navigation Error:', error);
      // Optional: Navigate anyway or show error
      // navigate(item.path); 
      alert('Failed to connect to resource server. Please ensure backend is running at http://localhost:8080');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 overflow-x-hidden font-rajdhani text-slate-800 selection:bg-cyan-100 selection:text-cyan-900">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0">
        <AntigravityBackground />
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
        {/* Ambient Glows - Lighter for white theme */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      </div>

      {/* Top Navigation Bar */}
      <TopNavigation />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 relative">
          <div className="absolute -left-20 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent opacity-30"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-orbitron tracking-tight">
            WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">{user.name}</span>
          </h2>
          <p className="text-slate-500 mt-2 font-mono flex items-center gap-2 font-medium">
            <Activity className="w-4 h-4 text-emerald-500" />
            SYSTEM STATUS: ONLINE // DAY {daysOnline}
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {menuItems.map((item, index) => {
            const isExternal = item.path.startsWith('http');
            return (
            <div 
              key={index}
              onClick={() => handleCardClick(item)}
              className={`
                group relative bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-slate-200 
                hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden
                ${item.shadow} hover:-translate-y-1 ${item.bgHover}
              `}
            >
              {/* External Link Indicator */}
              {isExternal && (
                <div className="absolute top-0 right-0 p-0">
                  <div className="bg-slate-100 text-slate-400 text-[9px] font-bold px-2 py-1 rounded-bl-lg border-l border-b border-slate-200 flex items-center gap-1">
                    LINK <ExternalLink className="w-2 h-2" />
                  </div>
                </div>
              )}
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl bg-white border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  {!isExternal && (
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors font-bold">
                      0{index + 1}
                    </span>
                  )}
                </div>
                
                <div className="mt-auto">
                  <p className="text-xs font-bold text-slate-400 tracking-widest mb-1 font-orbitron flex items-center gap-1">
                    {item.enTitle}
                  </p>
                  <h3 className={`text-xl font-bold text-slate-800 mb-2 ${item.color} transition-colors flex items-center gap-2`}>
                    {item.title}
                    {isExternal && <ExternalLink className="w-4 h-4 opacity-50" />}
                  </h3>
                  <p className="text-sm text-slate-500 group-hover:text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  {isExternal ? (
                    <ExternalLink className={`w-5 h-5 ${item.color}`} />
                  ) : (
                    <ChevronRight className={`w-5 h-5 ${item.color}`} />
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>

        {/* Information Center / Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200 p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Database className="w-24 h-24 text-slate-900" />
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-800 tracking-wider font-orbitron">SYSTEM LOGS & NOTIFICATIONS</h3>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="group flex items-start gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-cyan-200 hover:shadow-sm transition-all cursor-default">
                  <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-slate-700 group-hover:text-cyan-700 transition-colors">
                        <span className="text-cyan-600 font-mono mr-2 font-bold">[INFO]</span>
                        新的课程作业 "高级人工智能" 已发布
                      </p>
                      <span className="text-xs font-mono text-slate-400 font-medium">10:30 AM</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      /system/notifications/coursework_update
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats / Mini Module */}
          <div className="bg-gradient-to-b from-white/80 to-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200 p-1 relative group shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-200/30 to-purple-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
            <div className="relative h-full bg-white/50 rounded-xl p-6 flex flex-col justify-between overflow-hidden">
               {/* Decorative Circles */}
               <div className="absolute -right-10 -top-10 w-32 h-32 border border-slate-100 rounded-full"></div>
               <div className="absolute -right-6 -top-6 w-24 h-24 border border-slate-200 rounded-full"></div>

               <div>
                 <h3 className="text-lg font-bold text-slate-800 tracking-wider font-orbitron mb-1">PROJECT PROGRESS</h3>
                 <p className="text-xs text-slate-500 font-mono font-bold">Current Research Status</p>
               </div>

               <div className="my-8 flex justify-center relative">
                 <div className="w-32 h-32 rounded-full border-4 border-slate-100 flex items-center justify-center relative bg-white shadow-inner">
                   <div className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent border-l-transparent rotate-45"></div>
                   <div className="text-center">
                     <span className="text-3xl font-bold text-slate-800 font-orbitron">75<span className="text-sm text-slate-500">%</span></span>
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between text-xs text-slate-500 font-mono font-bold mb-1">
                     <span>DATA ANALYSIS</span>
                     <span className="text-cyan-600">COMPLETE</span>
                   </div>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500 w-full shadow-[0_0_10px_rgba(6,182,212,0.3)]"></div>
                   </div>
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-xs text-slate-500 font-mono font-bold mb-1">
                     <span>DOCUMENTATION</span>
                     <span className="text-purple-600">IN PROGRESS</span>
                   </div>
                   <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500 w-[60%] shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
