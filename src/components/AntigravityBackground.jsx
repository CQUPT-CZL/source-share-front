import React, { useEffect, useRef } from 'react';

const AntigravityBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };
    
    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = [];
      // 保持稀疏的密度：200/600
      const particleCount = width < 768 ? 200 : 600; 
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const shapeType = Math.random(); 

        particlesRef.current.push({
          x: x,
          y: y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 2 + 0.5, 
          length: Math.random() * 8 + 4, 
          angle: Math.random() * Math.PI * 2,
          color: Math.random() > 0.8 ? '#22d3ee' : (Math.random() > 0.6 ? '#94a3b8' : (Math.random() > 0.5 ? '#cbd5e1' : '#e2e8f0')), 
          // --- 物理参数调整区 ---
          // 摩擦系数：0.92 -> 0.96 (数值越大，速度衰减越慢，滑行更久，更有惯性)
          friction: 0.96, 
          // 回归系数：0.05 -> 0.02 (数值越小，回弹越慢，看起来更懒/更重)
          ease: 0.02, 
          type: shapeType > 0.6 ? 'line' : (shapeType > 0.3 ? 'shard' : 'triangle')
        });
      }
    };
    
    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(p => {
        // 1. 鼠标排斥逻辑
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 250; 
        
        if (distance < forceRadius) {
          const force = (forceRadius - distance) / forceRadius;
          const angle = Math.atan2(dy, dx);
          
          // --- 速度调整区 ---
          // 推力：8 -> 2.5 (大幅减小，解决移动太快的问题，增加阻力感)
          const pushForce = force * 2.5; 
          
          p.vx -= Math.cos(angle) * pushForce;
          p.vy -= Math.sin(angle) * pushForce;
        }
        
        // 2. 弹性回归
        const dxOrigin = p.originX - p.x;
        const dyOrigin = p.originY - p.y;
        // 减慢回归力度，配合高摩擦，营造漂浮感
        p.vx += dxOrigin * p.ease * 0.5;
        p.vy += dyOrigin * p.ease * 0.5;
        
        // 3. 物理应用
        p.vx *= p.friction;
        p.vy *= p.friction;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // 4. 动态角度
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        let rotation = p.angle;
        if (speed > 0.1) {
             rotation = Math.atan2(p.vy, p.vx);
        }

        // 5. 绘制
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(rotation);
        
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineCap = 'round';

        if (p.type === 'line') {
          ctx.lineWidth = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(-p.length / 2, 0);
          ctx.lineTo(p.length / 2, 0);
          ctx.stroke();
        } else if (p.type === 'shard') {
          ctx.beginPath();
          ctx.moveTo(-p.size, -p.size * 0.5);
          ctx.lineTo(p.size, -p.size);
          ctx.lineTo(p.size * 0.8, p.size);
          ctx.lineTo(-p.size * 0.8, p.size * 0.5);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(p.size * 1.5, 0); 
          ctx.lineTo(-p.size, p.size * 0.8);
          ctx.lineTo(-p.size, -p.size * 0.8);
          ctx.fill();
        }
        
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 bg-white"
    />
  );
};

export default AntigravityBackground;
