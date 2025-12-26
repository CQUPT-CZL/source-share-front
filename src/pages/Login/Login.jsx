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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-rajdhani text-slate-900 selection:bg-cyan-500 selection:text-white bg-slate-50">
      <AntigravityBackground />
      
      {/* 科技感网格装饰背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{
             backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />
      
      {/* 氛围光晕 */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* 第一阶段：未来实验室风格主页 */}
      <div 
        className={`
          absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)
          ${hasEntered ? 'opacity-0 scale-110 pointer-events-none blur-md' : 'opacity-100 scale-100 blur-0'}
        `}
      >
        <div className="text-center space-y-8 max-w-5xl px-6 relative">
          
          {/* 装饰元素：顶部数据流 */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs font-mono text-slate-400 opacity-60">
            <span className="animate-pulse-slow text-cyan-600">SYS.READY</span>
            <span className="w-16 h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent"></span>
            <span>V.2.0.45</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 mb-12 animate-fade-in-up">
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center relative z-10 rotate-45 group-hover:rotate-90 transition-all duration-700 ease-out">
                <Cpu className="text-slate-800 -rotate-45 group-hover:-rotate-90 transition-transform duration-700" size={40} strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 border border-slate-200/60 bg-white/40 backdrop-blur-sm px-5 py-1.5 rounded-full shadow-sm">
               <Activity size={14} className="text-cyan-600" />
               <span className="text-sm font-mono tracking-widest text-slate-600 uppercase">LL-Group // System</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black tracking-tighter text-slate-900 leading-[0.9] animate-fade-in-up delay-100 uppercase mix-blend-multiply whitespace-nowrap drop-shadow-sm">
            资源共享
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-cyan-900 to-slate-600 ml-4">平台</span>
          </h1>
          
          <p className="text-xl md:text-2xl font-rajdhani font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200 mt-8 text-center">
            深度整合课程与学位论文核心资产，实现小组知识的<span className="text-slate-900 font-bold border-b-2 border-cyan-400/30">结构化沉淀</span>与<span className="text-slate-900 font-bold border-b-2 border-cyan-400/30">高效传承</span>。
          </p>

          <div className="pt-16 animate-fade-in-up delay-300 flex justify-center">
            <button 
              onClick={() => setHasEntered(true)}
              className="group relative px-12 py-6 bg-slate-900 text-white font-orbitron font-bold tracking-widest transition-all hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden rounded-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-3 text-lg">
                启动会话 <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
          <div className="mt-6 font-mono text-xs text-slate-400 animate-fade-in-up delay-500">
            安全连接已建立 • 访问加密
          </div>
        </div>
      </div>

      {/* 第二阶段：HUD风格登录卡片 */}
      <div 
        className={`
          absolute inset-0 flex items-center justify-center z-10 p-4 transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1)
          ${hasEntered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}
        `}
      >
        <div className="w-full max-w-[480px] relative perspective-1000">
           <button 
            onClick={() => setHasEntered(false)}
            className="absolute -top-20 left-0 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3 font-mono text-xs tracking-widest uppercase group px-2 py-1"
          >
            <div className="p-1.5 border border-slate-200 rounded-md bg-white/50 group-hover:bg-white group-hover:border-slate-300 transition-all shadow-sm">
               <ChevronRight className="rotate-180" size={14} /> 
            </div>
            返回封面
          </button>

          {/* 主卡片容器 */}
          <div className="relative bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
            
            {/* 顶部装饰条 */}
            <div className="h-1.5 w-full bg-gradient-to-r from-slate-200 via-slate-900 to-slate-200"></div>

            <div className="p-10 md:p-12 relative">
              {/* 背景纹理 */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>

              <div className="relative flex items-center justify-between mb-12">
                 <div>
                    <h2 className="text-3xl font-orbitron font-bold text-slate-900 uppercase tracking-tight">用户访问</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <p className="text-slate-500 font-mono text-xs tracking-wider">SYSTEM ONLINE</p>
                    </div>
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                   <Disc className="text-slate-900 animate-spin-slow opacity-80" size={24} strokeWidth={1.5} />
                 </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                <div className="space-y-6">
                  <div className="relative group">
                     <label className="flex justify-between text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider font-semibold">
                       <span>User // Email</span>
                     </label>
                     <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" strokeWidth={1.5} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:bg-white transition-all font-rajdhani font-semibold text-lg shadow-sm"
                          placeholder="user@ll-group.io"
                          required
                        />
                     </div>
                  </div>

                  <div className="relative group">
                    <label className="flex justify-between text-xs font-mono text-slate-500 mb-2 uppercase tracking-wider font-semibold">
                      <span>Key // Password</span>
                    </label>
                    <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-600 transition-colors" strokeWidth={1.5} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 focus:bg-white transition-all font-rajdhani font-semibold text-lg shadow-sm"
                        placeholder="••••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors cursor-pointer z-10"
                      >
                        {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
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
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 bg-slate-50 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs font-mono text-slate-500 uppercase cursor-pointer hover:text-slate-700 select-none">
                      保持登录
                    </label>
                  </div>
                  <div className="text-xs font-mono">
                    <a href="#" className="text-slate-500 hover:text-cyan-600 uppercase transition-colors relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-cyan-600 after:origin-bottom-right hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-300">
                      找回密码?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-4 px-4 bg-slate-900 text-white font-orbitron font-bold tracking-widest hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase text-sm relative overflow-hidden group rounded-xl shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? '验证中...' : '执行登录'}
                    {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-8">
                <div className="relative flex justify-center text-xs font-mono uppercase mb-4">
                   <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-slate-200"></div>
                   </div>
                   <span className="bg-white/80 backdrop-blur px-2 text-slate-400 relative z-10">Or Connect Via</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" className="flex items-center justify-center px-4 py-2.5 border border-slate-200 bg-white/50 hover:bg-white hover:border-slate-900 transition-all group rounded-lg shadow-sm">
                     <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-slate-900 flex items-center gap-2">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 8.16-3.293 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.133H12.48z"/></svg>
                       GOOGLE
                     </span>
                  </button>
                  <button type="button" className="flex items-center justify-center px-4 py-2.5 border border-slate-200 bg-white/50 hover:bg-white hover:border-slate-900 transition-all group rounded-lg shadow-sm">
                     <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-slate-900 flex items-center gap-2">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                       GITHUB
                     </span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* 底部状态栏 */}
            <div className="bg-slate-50/80 border-t border-slate-100 p-4 flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider">
               <span>Secure Connection</span>
               <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
