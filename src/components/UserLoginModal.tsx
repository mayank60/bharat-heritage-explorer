import React, { useState } from 'react';
import { X, User, Clock, CheckCircle, LogOut, Database, Sparkles } from 'lucide-react';
import { UserSession } from '../types.ts';
import { LoginBar } from './LoginBar.tsx';
import { sanitizeText } from '../utils/security.ts';
import { registerVisitorSession } from '../utils/cloudDatabase.ts';

interface UserLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
  onLogout: () => void;
  onToast?: (msg: string) => void;
  allUsers?: UserSession[];
  onRefreshUsers?: () => void;
}

export const UserLoginModal: React.FC<UserLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onRefreshUsers,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = sanitizeText(identifier);
    if (!cleanName) {
      return;
    }

    setLoading(true);
    const now = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, timestamp: now }),
      });
      const data = await res.json();

      let activeUser: UserSession;
      if (data.success && data.user) {
        activeUser = data.user;
      } else {
        activeUser = {
          id: String(Date.now()),
          name: cleanName,
          login_time: now,
        };
      }

      // Global cross-device visitor registration via Supabase & Server
      registerVisitorSession({
        passId: activeUser.id,
        name: activeUser.name,
        role: activeUser.role || 'Cultural Heritage Explorer',
        platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Client'
      }).catch(() => {});

      onLoginSuccess(activeUser);
      setIdentifier('');
      if (onRefreshUsers) onRefreshUsers();
      onClose();
    } catch {
      const fallbackUser: UserSession = {
        id: String(Date.now()),
        name: cleanName,
        login_time: now,
      };

      registerVisitorSession({
        passId: fallbackUser.id,
        name: fallbackUser.name,
        role: 'Cultural Heritage Explorer',
        platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Client'
      }).catch(() => {});

      onLoginSuccess(fallbackUser);
      if (onRefreshUsers) onRefreshUsers();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto touch-none"
      onClick={onClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      {/* 3D Convex Glass-Clay Floating Sanctuary Container */}
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-[30px] overflow-hidden overscroll-contain text-white p-6 sm:p-7 transform-gpu my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(145deg, rgba(22, 17, 34, 0.88) 0%, rgba(12, 9, 20, 0.94) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(254, 243, 199, 0.22)',
          boxShadow:
            '0 30px 70px -15px rgba(0, 0, 0, 0.92), 0 0 35px -5px rgba(217, 119, 6, 0.22), inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.25), inset -2px -2px 6px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Specular Ambient Glow Orb */}
        <div
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(217, 119, 6, 0.15) 50%, transparent 80%)',
          }}
        />

        {/* Modal Header Row: Title & Badges on Left, Glass-Clay Close Button on Right */}
        <div className="flex items-start justify-between gap-4 mb-5 relative shrink-0">
          <div className="min-w-0 flex-1">
            {/* Glass-Clay Encrypted Session Capsule Pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2"
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                boxShadow:
                  'inset 1px 1px 2px rgba(255, 255, 255, 0.2), inset -1px -1px 2px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Verified Visitor Pass
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white">
              {currentUser ? 'Active Visitor Session' : 'Visitor Registration & Pass'}
            </h2>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed mt-0.5">
              {currentUser
                ? `Connected as ${currentUser.name} · National heritage pass verified.`
                : 'Enter your name to generate your personalized National Heritage Visitor Pass.'}
            </p>
          </div>

          {/* Top-Right Glass-Clay Close Button */}
          <button
            onClick={onClose}
            className="btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-full text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0 mt-0.5 shadow-md"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 min-h-0">
          {currentUser ? (
            /* Active User Glass-Clay Profile Card */
            <div className="space-y-4 text-left">
              <div
                className="p-4 rounded-2xl flex items-center justify-between relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(254, 243, 199, 0.25)',
                  boxShadow:
                    '0 8px 24px -4px rgba(0, 0, 0, 0.45), inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.2), inset -1.5px -1.5px 3px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center font-serif font-bold text-base shadow-md shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      color: '#1C1917',
                      border: '1px solid rgba(254, 243, 199, 0.5)',
                      boxShadow:
                        '0 4px 12px rgba(217, 119, 6, 0.4), inset 1px 1px 2px rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm sm:text-base">
                        {currentUser.name}
                      </span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-300/90 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Pass issued: {currentUser.login_time}</span>
                    </div>
                  </div>
                </div>

                <div className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  VERIFIED PASS
                </div>
              </div>

              {/* Action Buttons with Glass-Clay Foundation */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-glass-clay btn-glass-clay-primary flex-1 py-3 px-4 text-xs sm:text-sm font-bold cursor-pointer rounded-2xl"
                >
                  Continue Exploring
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="btn-glass-clay btn-glass-clay-danger py-3 px-4 text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-2xl"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Visitor Full Name / ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. Rahul Sharma, Priya Patel..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/80"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(254, 243, 199, 0.2)',
                      boxShadow:
                        'inset 1px 1px 2px rgba(0, 0, 0, 0.4), inset -1px -1px 2px rgba(255, 255, 255, 0.1)',
                    }}
                  />
                  <User className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <LoginBar
                  variant="primary"
                  label={loading ? 'Generating Visitor Pass...' : 'Generate Visitor Pass'}
                  disabled={loading}
                  onBeforeLogin={() => {
                    const cleanName = identifier.trim();
                    return Boolean(cleanName);
                  }}
                  onLoginClick={() => {
                    handleLogin();
                  }}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
