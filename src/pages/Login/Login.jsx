import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Lock, Mail, Eye, EyeOff, Cpu, Activity, Disc } from 'lucide-react';
import AntigravityBackground from '../../components/AntigravityBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-rajdhani text-slate-900 selection:bg-slate-900 selection:text-white bg-slate-50">
      <AntigravityBackground />
      
      {/* 科技感网格装饰背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />

      {/* 第一阶段：未来实验室风格主页 */}
      <div 
        className={`
          absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)
          ${hasEntered ? 'opacity-0 scale-95 pointer-events-none blur-sm' : 'opacity-100 scale-100 blur-0'}
        `}
      >
        <div className="text-center space-y-8 max-w-4xl px-6 relative">
          
          {/* 装饰元素：顶部数据流 */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs font-mono text-slate-400 opacity-60">
            <span className="animate-pulse-slow">SYS.READY</span>
            <span className="w-12 h-[1px] bg-slate-300"></span>
            <span>V.2.0.45</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mb-10 animate-fade-in-up">
            <div className="relative">
              <div className="absolute inset-0 bg-slate-200 rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center relative z-10 rotate-45 group transition-transform duration-500 hover:rotate-90">
                <Cpu className="text-slate-800 -rotate-45 group-hover:-rotate-90 transition-transform duration-500" size={32} strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 border border-slate-200 bg-white/50 backdrop-blur-sm px-4 py-1 rounded-full">
               <Activity size={14} className="text-slate-500" />
               <span className="text-sm font-mono tracking-widest text-slate-500 uppercase">LL-Group // System</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-black tracking-tighter text-slate-900 leading-[0.9] animate-fade-in-up delay-100 uppercase mix-blend-multiply whitespace-nowrap">
            资源共享
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500">平台</span>
          </h1>
          
          <p className="text-xl font-rajdhani font-medium text-slate-600 max-w-lg mx-auto leading-relaxed animate-fade-in-up delay-200 mt-6 border-l-2 border-slate-900 pl-6 text-left">
            深度整合课程与学位论文核心资产<br/>
            实现小组知识的结构化沉淀与高效传承。
          </p>

          <div className="pt-12 animate-fade-in-up delay-300">
            <button 
              onClick={() => setHasEntered(true)}
              className="group relative px-10 py-5 bg-slate-900 text-white font-orbitron font-bold tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] clip-path-polygon"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              <span className="flex items-center gap-3">
                启动会话 <ArrowRight size={20} />
              </span>
            </button>
            <div className="mt-4 font-mono text-xs text-slate-400">
              安全连接已建立
            </div>
          </div>
        </div>
      </div>

      {/* 第二阶段：HUD风格登录卡片 */}
      <div 
        className={`
          absolute inset-0 flex items-center justify-center z-10 p-4 transition-all duration-700 ease-out
          ${hasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}
        `}
      >
        <div className="w-full max-w-md relative">
           <button 
            onClick={() => setHasEntered(false)}
            className="absolute -top-16 left-0 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 font-mono text-xs tracking-widest uppercase group"
          >
            <div className="p-1 border border-slate-300 rounded group-hover:bg-slate-200 transition-colors">
               <ChevronRight className="rotate-180" size={14} /> 
            </div>
            返回封面
          </button>

          {/* 科技感边框容器 */}
          <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200 p-1 md:p-1">
            {/* 角标装饰 */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-slate-900"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-slate-900"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-slate-900"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-slate-900"></div>

            <div className="p-8 md:p-10 border border-slate-100 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.02)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px]">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h2 className="text-3xl font-orbitron font-bold text-slate-900 uppercase">用户访问</h2>
                    <p className="text-slate-500 font-mono text-xs tracking-wider mt-1">身份验证</p>
                 </div>
                 <Disc className="text-slate-900 animate-spin-slow" size={32} strokeWidth={1} />
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-5">
                  <div className="relative group">
                     <label className="block text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">User // Email</label>
                     <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-slate-900 focus:ring-0 transition-all font-mono text-sm"
                          placeholder="user@ll-group.io"
                          required
                        />
                     </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-mono text-slate-500 mb-1 uppercase tracking-wider">Key // Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-slate-900 focus:ring-0 transition-all font-mono text-sm"
                        placeholder="••••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-900"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded-none border-slate-300 text-slate-900 focus:ring-slate-900 bg-slate-50"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs font-mono text-slate-500 uppercase">
                      保持登录
                    </label>
                  </div>
                  <div className="text-xs font-mono">
                    <a href="#" className="text-slate-500 hover:text-slate-900 uppercase underline decoration-1 underline-offset-4">
                      找回密码?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-4 px-4 border-2 border-slate-900 bg-slate-900 text-white font-orbitron font-bold tracking-widest hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase text-sm relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? '验证中...' : '执行登录'}
                    {!isLoading && <ArrowRight size={16} />}
                  </span>
                </button>
              </form>
              
               <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-200 border-dashed" />
                </div>
                <div className="relative flex justify-center text-xs font-mono uppercase">
                  <span className="bg-white px-2 text-slate-400">Or_Connect_Via</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-900 transition-colors group">
                   <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-slate-900">GOOGLE</span>
                </button>
                <button className="flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-900 transition-colors group">
                   <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-slate-900">GITHUB</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
