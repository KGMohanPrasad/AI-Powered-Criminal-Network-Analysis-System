import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, AlertTriangle, Loader2, Info, X } from 'lucide-react';

let toastContainerRoot = null;
let toastListeners = [];
let activeToasts = [];

function notifyListeners() {
  toastListeners.forEach(listener => listener([...activeToasts]));
}

function ensureContainerMounted() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById('aegis-toast-root')) {
    const el = document.createElement('div');
    el.id = 'aegis-toast-root';
    el.className = 'fixed top-4 right-4 z-[99999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-3';
    document.body.appendChild(el);
    toastContainerRoot = createRoot(el);
    toastContainerRoot.render(<ToastContainer />);
  }
}

function ToastContainer() {
  const [toasts, setToasts] = useState(activeToasts);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter(l => l !== setToasts);
    };
  }, []);

  return (
    <>
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in slide-in-from-top-2 ${
            t.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-900/20'
              : t.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-100 shadow-rose-900/20'
              : t.type === 'loading'
              ? 'bg-cyan-950/90 border-cyan-500/40 text-cyan-100 shadow-cyan-900/20'
              : 'bg-slate-900/90 border-slate-700/60 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5 text-sm font-medium">
            {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {t.type === 'loading' && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span className="leading-tight">{t.message}</span>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </>
  );
}

function showToast(message, type = 'info', options = {}) {
  ensureContainerMounted();
  const id = options.id || String(Date.now() + Math.random());
  const existingIdx = activeToasts.findIndex(t => t.id === id);

  const newToast = { id, message, type, options };

  if (existingIdx >= 0) {
    activeToasts[existingIdx] = newToast;
  } else {
    activeToasts.push(newToast);
  }

  notifyListeners();

  if (type !== 'loading') {
    const duration = options.duration || 4000;
    setTimeout(() => {
      toast.dismiss(id);
    }, duration);
  }

  return id;
}

export const toast = (message, options) => showToast(message, 'info', options);
toast.success = (message, options) => showToast(message, 'success', options);
toast.error = (message, options) => showToast(message, 'error', options);
toast.loading = (message, options) => showToast(message, 'loading', options);
toast.dismiss = (id) => {
  if (id) {
    activeToasts = activeToasts.filter(t => t.id !== id);
  } else {
    activeToasts = [];
  }
  notifyListeners();
};

export const Toaster = () => null;

export default toast;
