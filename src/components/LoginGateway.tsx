import React, { useState, useRef } from 'react';
import { User, ShieldCheck, Landmark, Headphones, Compass, Sparkles } from 'lucide-react';
import { UserSession } from '../types.ts';
import { LanguageKey } from '../i18n.ts';
import { LoginBar } from './LoginBar.tsx';
import { heritageSoundscape } from '../utils/heritageSoundscape.ts';
import { sanitizeText } from '../utils/security.ts';
import { registerVisitorSession } from '../utils/cloudDatabase.ts';

interface LoginGatewayProps {
  lang?: LanguageKey;
  onLoginSuccess: (user: UserSession) => void;
  onToast: (msg: string) => void;
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  lang = 'en',
  onLoginSuccess,
  onToast,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = sanitizeText(nameInput);
    if (!cleanName) {
      onToast(lang === 'hi' ? 'कृपया डिजिटल पास बनाने के लिए अपना नाम दर्ज करें।' : 'Please enter your full name to generate your visitor pass.');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    heritageSoundscape.playTempleChime();

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
        platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Client',
      }).catch(() => {});

      onLoginSuccess(activeUser);
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
        platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Client',
      }).catch(() => {});

      onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05040A] text-white flex items-center justify-center relative overflow-x-hidden py-8 px-4 font-sans select-none">
      {/* 1. Deep Space Cosmic Background */}
      <div className="fixed inset-0 bg-radial from-[#120D24] via-[#080511] to-[#030206] pointer-events-none" />

      {/* Subtle Starfield Dust */}
      <div
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 80px, #C084FC, rgba(0,0,0,0)), radial-gradient(1px 1px at 280px 220px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 450px 350px, #A855F7, rgba(0,0,0,0)), radial-gradient(1px 1px at 600px 120px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 850px 400px, #818CF8, rgba(0,0,0,0)), radial-gradient(1px 1px at 1100px 250px, #ffffff, rgba(0,0,0,0)), radial-gradient(2px 2px at 1300px 150px, #E879F9, rgba(0,0,0,0))',
          backgroundSize: '650px 650px',
        }}
      />

      {/* 2. Soft Celestial Bokeh Orbs on the Left */}
      <div className="fixed top-[20%] left-[6%] w-32 sm:w-48 h-32 sm:h-48 rounded-full bg-[#8B5CF6]/15 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[18%] left-[12%] w-36 sm:w-56 h-36 sm:h-56 rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none" />

      {/* 3. The Celestial Glowing Planet (Upper-Right) with Responsive Viewport Scaling */}
      <div className="fixed -top-[8%] -right-[8%] sm:-top-[6%] sm:-right-[6%] lg:-top-[3%] lg:-right-[3%] w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] lg:w-[680px] lg:h-[680px] rounded-full pointer-events-none z-0">
        <div
          className="w-full h-full rounded-full relative"
          style={{
            background:
              'radial-gradient(circle at 65% 35%, #24164A 0%, #150A2E 45%, #0B041A 75%, #05020E 100%)',
            boxShadow:
              'inset 25px -30px 80px 15px rgba(0, 0, 0, 0.95), inset -8px 8px 30px rgba(192, 132, 252, 0.25)',
          }}
        >
          {/* Radiant Luminescent Crescent Rim Arc */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                '-14px 14px 40px 3px rgba(232, 121, 249, 0.75), -28px 28px 75px 8px rgba(168, 85, 247, 0.55), -50px 50px 130px 20px rgba(99, 102, 241, 0.35)',
            }}
          />

          {/* Intense Specular Rim Bloom */}
          <div
            className="absolute bottom-[20%] left-[14%] w-36 sm:w-48 h-36 sm:h-48 rounded-full blur-2xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(244, 114, 182, 0.8) 35%, rgba(168, 85, 247, 0.6) 65%, transparent 100%)',
            }}
          />
        </div>
      </div>

      {/* 4. Glassmorphic Floating Login Card */}
      <div className="relative z-10 w-full max-w-[400px] my-auto">
        <div
          className="rounded-[26px] sm:rounded-[30px] p-6 sm:p-8 relative overflow-hidden backdrop-blur-2xl transition-all duration-300"
          style={{
            backgroundColor: 'rgba(17, 15, 26, 0.72)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow:
              '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 45px -10px rgba(168, 85, 247, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Subtle Ambient Sheen illuminated by crescent */}
          <div
            className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(232, 121, 249, 0.35) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 80%)',
            }}
          />

          {/* Card Header: Pure Minimalist */}
          <div className="space-y-1 mb-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>National Heritage Archive</span>
            </div>
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-white font-sans">
              Sign In
            </h1>
            <p className="text-xs sm:text-[13px] text-zinc-400 font-normal leading-relaxed">
              Enter your name to register your digital pass & unlock the national archives
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Visitor Full Name *
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  required
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="✨ Enter your name to enter... 🏛️"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm font-normal text-white placeholder-zinc-400/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/80"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                />
                <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Primary Action Button: Enhanced Interactive Walkthrough Portal */}
            <div className="pt-1">
              <LoginBar
                label={loading ? 'Entering...' : 'Enter Sanctuary'}
                variant="violet"
                disabled={loading}
                onBeforeLogin={() => {
                  const cleanName = nameInput.trim();
                  if (!cleanName) {
                    onToast('Please enter your full name to generate your visitor pass.');
                    inputRef.current?.focus();
                    return false;
                  }
                  return true;
                }}
                onLoginClick={() => {
                  handleSubmit();
                }}
              />
            </div>
          </form>

          {/* Institutional Digital Pass Verification Card */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] text-left">
            <div
              className="p-3 rounded-xl flex items-center gap-2.5"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-white block truncate">
                  Archaeological Survey of India
                </span>
                <span className="text-[10px] text-zinc-400 block truncate">
                  Official Heritage Repository Pass
                </span>
              </div>
            </div>

            {/* Highlights Trio */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-zinc-400 font-medium">
              <div className="py-1.5 px-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Landmark className="w-3 h-3 text-purple-400 mx-auto mb-0.5" />
                <span>36 States</span>
              </div>
              <div className="py-1.5 px-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Headphones className="w-3 h-3 text-pink-400 mx-auto mb-0.5" />
                <span>Audio Guides</span>
              </div>
              <div className="py-1.5 px-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Compass className="w-3 h-3 text-indigo-400 mx-auto mb-0.5" />
                <span>GIS Map</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Informative Label */}
        <div className="mt-4 text-center text-xs text-zinc-400">
          <span>Bharat Darshan · National Living Cultural Repository</span>
        </div>
      </div>
    </div>
  );
};
