import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  PieChart,
  HardDrive,
  Files
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AntigravityBackground from '../../components/AntigravityBackground';
import TopNavigation from '../../components/TopNavigation';
import { api } from '../../utils/api';

const SYSTEM_START_DATE = new Date(2025, 11, 1).getTime();
const daysOnline = Math.floor((Date.now() - SYSTEM_START_DATE) / (1000 * 60 * 60 * 24));

const formatBytes = (bytes, decimals = 1) => {
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Get user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const user = {
    name: storedUser.realName || "崔子梁",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedUser.username || 'Felix'}`,
    role: storedUser.role || "牛马研究生",
    email: storedUser.email || "",
    grade: storedUser.grade || ""
  };

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await api.getStatistics();
            if (response && response.code === 200) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        } finally {
            setLoadingStats(false);
        }
    };
    fetchStats();
  }, []);

  const processedFileTypes = React.useMemo(() => {
    if (!stats?.fileTypeCounts) return [];
    const counts = stats.fileTypeCounts;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top4 = sorted.slice(0, 4);
    const othersCount = sorted.slice(4).reduce((acc, curr) => acc + curr[1], 0);
    const result = top4.map(([type, count]) => ({ type, count }));
    if (othersCount > 0) {
        result.push({ type: 'OTHER', count: othersCount });
    }
    return result;
  }, [stats]);

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
      title: "综合资源", 
      enTitle: "OTHERS",
      icon: <Activity className="w-8 h-8 text-amber-600" />, 
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



  const handleCardClick = (item) => {
    // External links
    if (item.path.startsWith('http')) {
      window.open(item.path, '_blank');
      return;
    }

    // Navigate immediately to show loading state in the next page
    navigate(item.path, { 
      state: { 
        category: item.enTitle,
        rootName: item.title
      } 
    });
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
        <header className="mb-12 relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative">
            <div className="absolute -left-20 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-transparent opacity-30"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-orbitron tracking-tight">
                WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">{user.name}</span>
            </h2>
            <p className="text-slate-500 mt-2 font-mono flex items-center gap-2 font-medium">
                <Activity className="w-4 h-4 text-emerald-500" />
                SYSTEM STATUS: ONLINE // DAY {daysOnline}
            </p>
          </div>

          {/* Stats Widget */}
          {!loadingStats && stats && (
            <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 flex gap-6 shadow-sm animate-fade-in-left">
                <div className="flex flex-col gap-1 pr-6 border-r border-slate-200">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <HardDrive className="w-4 h-4" />
                        <span className="text-[10px] font-bold font-orbitron tracking-wider">TOTAL SIZE</span>
                    </div>
                    <span className="text-xl font-bold text-slate-800 font-mono">{formatBytes(stats.totalSize)}</span>
                    <span className="text-xs text-slate-400 font-medium">{stats.totalCount} Files</span>
                </div>
                
                <div className="flex gap-3 items-center">
                    {processedFileTypes.map((item, idx) => (
                        <div key={item.type} className="flex flex-col items-center gap-1 min-w-[3rem]">
                            <div className={`
                                w-8 h-1 rounded-full 
                                ${idx === 0 ? 'bg-cyan-500' : 
                                  idx === 1 ? 'bg-purple-500' : 
                                  idx === 2 ? 'bg-emerald-500' : 
                                  idx === 3 ? 'bg-rose-500' : 'bg-slate-400'}
                            `}></div>
                            <span className="text-xs font-bold text-slate-600 uppercase">{item.type}</span>
                            <span className="text-[10px] font-mono text-slate-400">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}
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
      </main>
    </div>
  );
};

export default Dashboard;
