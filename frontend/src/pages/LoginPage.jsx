import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  EyeOff,
  Shield,
  Network,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  KeyRound,
  Fingerprint,
  Radio,
  FileCheck2,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('investigator');
  const [password, setPassword] = useState('Password@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('expired') === 'true') {
        setErrorMessage('Session expired or authentication token invalidated. Please re-authenticate.');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const canvasRef = useRef(null);

  // Animated Tactical Network Canvas on Left side
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle nodes
    const nodeCount = 42;
    const particles = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1.8,
      color: Math.random() > 0.7 ? '#22D3EE' : Math.random() > 0.4 ? '#38BDF8' : '#0EA5E9',
      pulse: Math.random() * Math.PI,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle tactical coordinate grid
      ctx.strokeStyle = 'rgba(30, 45, 74, 0.28)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = 0.3 * (1 - dist / 140);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw node
        const currentR = p.radius + Math.sin(p.pulse) * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentR), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim()) {
      setErrorMessage('Username or operator badge is required.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Cryptographic security passphrase is required.');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      setSuccessMessage('Cryptographic handshake confirmed. Initializing Aegis workspace...');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
      }, 500);
    } catch (err) {
      setErrorMessage(err.message || 'Access authorization rejected. Verify badge credentials with system administrator.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userRole) => {
    setErrorMessage('');
    setForgotPasswordNotice(false);
    switch (userRole) {
      case 'ADMIN':
        setUsername('admin');
        setPassword('Password@123');
        break;
      case 'INVESTIGATOR':
        setUsername('investigator');
        setPassword('Password@123');
        break;
      case 'ANALYST':
        setUsername('analyst');
        setPassword('Password@123');
        break;
      case 'VIEWER':
        setUsername('viewer');
        setPassword('Password@123');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-intel-base font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Left side: Animated Tactical Network Canvas & Mission Overview */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 border-r border-intel-border/80 overflow-hidden bg-gradient-to-br from-intel-card via-intel-base to-intel-bg">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-glow">
            <Network className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <div className="font-display text-sm font-black tracking-widest text-slate-100 uppercase">
              Aegis Intelligence System
            </div>
            <div className="text-xs text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
              <span>RELATIONAL LINK GRAPH CORE</span>
              <span className="text-cyan-400 font-bold">•</span>
              <span className="text-cyan-300">SEC-OP 2026</span>
            </div>
          </div>
        </div>

        {/* Center Graphic & Mission Statement */}
        <div className="relative z-10 max-w-lg space-y-5 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-intel-panel/90 border border-cyan-500/40 text-xs text-cyan-300 font-mono shadow-sm">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="tracking-wider">SECURITY CLEARANCE: TOP SECRET // LE ONLY</span>
          </div>

          <h1 className="font-display text-4xl xl:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            Criminal Syndicate <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
              Network Intelligence
            </span>
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Multi-modal decision-support intelligence platform engineered for multi-entity relationship discovery, 
            graph centrality quantification, anomaly pattern detection, and case similarity modeling across verified datasets.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-intel-border/70">
            <div className="p-3.5 rounded-xl bg-intel-card/90 border border-intel-border shadow-sm">
              <div className="text-xl font-bold text-cyan-300 font-mono tabular-nums">40+</div>
              <div className="text-[11px] text-slate-400 font-medium">Verified Entities</div>
            </div>
            <div className="p-3.5 rounded-xl bg-intel-card/90 border border-intel-border shadow-sm">
              <div className="text-xl font-bold text-sky-300 font-mono tabular-nums">70+</div>
              <div className="text-[11px] text-slate-400 font-medium">Relational Edges</div>
            </div>
            <div className="p-3.5 rounded-xl bg-intel-card/90 border border-intel-border shadow-sm">
              <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">100%</div>
              <div className="text-[11px] text-slate-400 font-medium">Deterministic RBAC</div>
            </div>
          </div>
        </div>

        {/* Bottom Ethical Safeguards Capsule */}
        <div className="relative z-10 p-4 rounded-2xl bg-intel-card/85 border border-cyan-500/30 text-xs text-slate-300 shadow-glass-panel backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-[11px] uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ethical Safeguards & Governance Protocol</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            "AI-generated analytical indicators are decision-support information only. They are not proof of criminal activity and require human verification."
          </p>
        </div>
      </div>

      {/* Right side: Login Station Terminal */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto bg-intel-base bg-grid-pattern">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-cyan-glow mb-2">
              <Network className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-black text-slate-100">
              Aegis Criminal Network Intel
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Authorized Intelligence Personnel Station
            </p>
          </div>

          {/* Login Card Container with True Glassmorphism */}
          <div className="p-7 sm:p-9 rounded-3xl bg-intel-card/95 border border-intel-border/90 shadow-glass-edge backdrop-blur-xl space-y-6 relative overflow-hidden">
            {/* Top glowing accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-slate-100 tracking-tight">
                  Investigator Terminal
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                  <Fingerprint className="w-3 h-3 text-cyan-400" />
                  <span>BIO-AUTH</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to decrypt and access the investigation workspace.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 animate-in fade-in">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Forgot password inline notice (replaces window.alert) */}
            {forgotPasswordNotice && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-xs text-cyan-200 animate-in fade-in">
                <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                <span>In this evaluation deployment, use the quick-fill role credentials below to test any security clearance tier.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Operator ID or Email</span>
                  <span className="text-[10px] text-slate-400 font-mono">e.g. investigator</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-intel-panel/80 border border-intel-border/80 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all placeholder:text-slate-500"
                    placeholder="Enter operator username or email"
                  />
                </div>
              </div>

              {/* Password Input with Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Security Passphrase
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordNotice(prev => !prev)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    Demo credentials hint?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-intel-panel/80 border border-intel-border/80 text-slate-100 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all placeholder:text-slate-500"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Session & Security Badge */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-intel-border bg-intel-panel text-cyan-500 focus:ring-0"
                  />
                  <span>Retain token session</span>
                </label>
                <span className="text-[11px] font-mono text-cyan-400/80">AES-256-GCM</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-cyan-glow flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Cryptographic Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Decrypt & Open Intelligence Suite</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Role Selector (Academic / Evaluation convenience) */}
            <div className="pt-4 border-t border-intel-border/70">
              <div className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center flex items-center justify-center gap-2">
                <KeyRound className="w-3 h-3 text-cyan-400" />
                <span>One-Click Role Authorization (Demo Environment)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('INVESTIGATOR')}
                  className="px-3 py-2 rounded-xl bg-intel-panel/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-400/60 transition-all text-left group"
                >
                  <div className="font-bold text-[11px] group-hover:text-cyan-200">Lead Investigator</div>
                  <div className="text-[10px] text-slate-400 font-mono">investigator</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ADMIN')}
                  className="px-3 py-2 rounded-xl bg-intel-panel/60 border border-rose-500/30 text-rose-300 hover:bg-rose-500/15 hover:border-rose-400/60 transition-all text-left group"
                >
                  <div className="font-bold text-[11px] group-hover:text-rose-200">Super Admin</div>
                  <div className="text-[10px] text-slate-400 font-mono">admin</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ANALYST')}
                  className="px-3 py-2 rounded-xl bg-intel-panel/60 border border-amber-500/30 text-amber-300 hover:bg-amber-500/15 hover:border-amber-400/60 transition-all text-left group"
                >
                  <div className="font-bold text-[11px] group-hover:text-amber-200">Intel Analyst</div>
                  <div className="text-[10px] text-slate-400 font-mono">analyst</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('VIEWER')}
                  className="px-3 py-2 rounded-xl bg-intel-panel/60 border border-slate-600/40 text-slate-300 hover:bg-slate-700/30 hover:border-slate-400 transition-all text-left group"
                >
                  <div className="font-bold text-[11px] group-hover:text-slate-100">Auditor / Viewer</div>
                  <div className="text-[10px] text-slate-400 font-mono">viewer</div>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-mono tracking-wider">
            AEGIS DEFENSE & INTELLIGENCE CORE • RESTRICTED ACCESS
          </div>
        </div>
      </div>
    </div>
  );
}
