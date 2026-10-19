'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { DEMO_USER } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const cols = ['#4f8eff', '#a855f7', '#06b6d4', '#22d3a5'];
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.3 + 0.3,
      dx: (Math.random() - 0.5) * 0.22, dy: (Math.random() - 0.5) * 0.22,
      a: Math.random() * 0.35 + 0.08,
      col: cols[Math.floor(Math.random() * cols.length)],
    }));
    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      pts.forEach(p => {
        p.x = (p.x + p.dx + canvas!.width) % canvas!.width;
        p.y = (p.y + p.dy + canvas!.height) % canvas!.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col; ctx.globalAlpha = p.a; ctx.fill(); ctx.globalAlpha = 1;
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
        if (d < 110) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = pts[i].col; ctx.globalAlpha = (1 - d / 110) * 0.06; ctx.lineWidth = 0.5; ctx.stroke(); ctx.globalAlpha = 1; }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    if (mode === 'login') {
      if (form.email === DEMO_USER.email && form.password === DEMO_USER.password) {
        document.cookie = 'pulse_auth=true; path=/; max-age=86400';
        login(DEMO_USER.name, DEMO_USER.email);
        toast.success('Welcome back, ' + DEMO_USER.name + '! 🎉');
        router.push('/');
      } else {
        toast.error('Invalid credentials. Try admin@pulse.io / password123');
        setLoading(false);
      }
    } else {
      // Register — simulate and auto-login
      document.cookie = 'pulse_auth=true; path=/; max-age=86400';
      login(form.name || 'New User', form.email);
      toast.success('Account created! Welcome to Pulse 🚀');
      router.push('/');
    }
  };

  const field = (key: keyof typeof form, placeholder: string, type: string, Icon: React.ElementType) => (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6868a0]" />
      <input
        type={key === 'password' ? (showPass ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        required
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-[#6868a0] focus:outline-none focus:border-[#4f8eff]/60 focus:bg-white/8 transition-all"
      />
      {key === 'password' && (
        <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6868a0] hover:text-white transition-colors">
          {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#07071a 0%,#0d0d26 100%)' }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-60" />

      {/* Glow blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-spin-slow" style={{ background: 'radial-gradient(circle,#4f8eff,transparent)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl animate-spin-slow" style={{ background: 'radial-gradient(circle,#a855f7,transparent)', animationDirection: 'reverse' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 animate-logo" style={{ background: 'linear-gradient(135deg,#4f8eff,#a855f7)' }}>
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Pulse<span className="text-[#4f8eff]">.</span></h1>
          <p className="text-[#6868a0] text-sm mt-1">Customer Intelligence Hub</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8" style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
          {/* Tab Switch */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-7 gap-1">
            {(['login','register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${mode === m ? 'bg-gradient-to-r from-[#4f8eff] to-[#a855f7] text-white shadow-lg' : 'text-[#6868a0] hover:text-white'}`}>
                {m}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'register' && field('name', 'Full name', 'text', User)}
              {field('email', 'Email address', 'email', Mail)}
              {field('password', 'Password', 'password', Lock)}

              {mode === 'login' && (
                <p className="text-xs text-[#6868a0] bg-white/5 rounded-lg px-3 py-2 border border-white/6">
                  Demo: <span className="text-[#4f8eff] font-mono">admin@pulse.io</span> / <span className="text-[#4f8eff] font-mono">password123</span>
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#4f8eff,#a855f7)', boxShadow: '0 0 30px rgba(79,142,255,0.3)' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin"/> : <><span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span><ArrowRight size={16}/></>}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-[#6868a0] mt-5">
          © 2026 Pulse Intelligence — All rights reserved
        </p>
      </motion.div>
    </div>
  );
}
