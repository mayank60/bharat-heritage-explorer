import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Users,
  Clock,
  RefreshCw,
  Database,
  Landmark,
  Search,
  Smartphone,
  Laptop,
  Radio,
  Sparkles,
  Trash2,
  FileText,
} from 'lucide-react';
import { LanguageKey } from '../i18n.ts';
import { HeritageItem } from '../types.ts';
import { deleteCommunityHeritage, fetchSecureVisitorLogs, subscribeToVisitors } from '../utils/cloudDatabase.ts';
import { maskSensitiveId, maskVisitorName } from '../utils/security.ts';

export interface AdminVisitorRecord {
  id: string;
  passId?: string;
  name: string;
  role?: string;
  platform?: string;
  login_time: string;
  lastActive?: string;
  isLive?: boolean;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageKey;
  totalStatesCount?: number;
  totalHeritageCount?: number;
  onOpenContribute?: () => void;
  liveUsers?: Array<{ id: string; name: string; login_time: string }>;
  onRefreshLogs?: () => Promise<void> | void;
  communityItems?: HeritageItem[];
  onDeleteCommunityItem?: (id: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  lang,
  totalStatesCount = 36,
  totalHeritageCount = 140,
  onOpenContribute,
  liveUsers,
  onRefreshLogs,
  communityItems = [],
  onDeleteCommunityItem,
}) => {
  // Security Authentication Gate (Passcode: asi@bharat)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('asi_admin_authenticated') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [showPasscode, setShowPasscode] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Admin Logs State (seeded with real-time liveUsers from App.tsx)
  const [dbUsers, setDbUsers] = useState<AdminVisitorRecord[]>(() => (liveUsers as AdminVisitorRecord[]) || []);
  const [activeCount, setActiveCount] = useState<number>(0);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [searchLogQuery, setSearchLogQuery] = useState('');
  // Privacy Encryption & Masking state for visitor names
  const [isPrivacyMasked, setIsPrivacyMasked] = useState<boolean>(true);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const toggleRevealName = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Tab state between Visitor Records and Community Submissions
  const [activeTab, setActiveTab] = useState<'visitors' | 'community'>('visitors');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const pollingTimerRef = useRef<any>(null);

  const handleDeleteCommunity = async (id: string, title: string) => {
    const confirmMsg = lang === 'hi'
      ? `क्या आप "${title}" को केंद्रीय जन अभिलेखागार से हटाना चाहते हैं?`
      : `Are you sure you want to delete "${title}" from the national community archive?`;
    if (!window.confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      const success = await deleteCommunityHeritage(id, 'asi@bharat');
      if (success && onDeleteCommunityItem) {
        onDeleteCommunityItem(id);
      }
    } catch (err) {
      console.error('Failed to delete community heritage:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const fetchVisitorLogs = async (silent = false) => {
    if (!silent) setLoadingLogs(true);
    try {
      if (onRefreshLogs) {
        await onRefreshLogs();
      }
      // 1. Fetch from Supabase Cloud Realtime Database + Server
      const logs = await fetchSecureVisitorLogs();
      if (Array.isArray(logs) && logs.length > 0) {
        setDbUsers(logs);
        setActiveCount(logs.filter((u: AdminVisitorRecord) => u.isLive).length);
      } else {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setDbUsers(data.users);
          if (typeof data.activeCount === 'number') {
            setActiveCount(data.activeCount);
          } else {
            setActiveCount(data.users.filter((u: AdminVisitorRecord) => u.isLive).length);
          }
        }
      }
    } catch {
      // Graceful fallback
    } finally {
      if (!silent) setLoadingLogs(false);
    }
  };

  // Sync with App.tsx real-time poll stream
  useEffect(() => {
    if (liveUsers && liveUsers.length > 0) {
      setDbUsers(liveUsers as AdminVisitorRecord[]);
    }
  }, [liveUsers]);

  // Live Auto-Refresh & Realtime Stream while Admin Portal is open and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchVisitorLogs(false);

      // Instant real-time listener from Supabase & BroadcastChannel
      const unsubscribe = subscribeToVisitors((logs) => {
        if (Array.isArray(logs) && logs.length > 0) {
          setDbUsers(logs);
          setActiveCount(logs.filter((u) => u.isLive).length);
        }
      });

      // Backup interval poll so other devices appear without any lag
      pollingTimerRef.current = setInterval(() => {
        fetchVisitorLogs(true);
      }, 4000);

      return () => {
        unsubscribe();
        if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      };
    }
  }, [isOpen, isAuthenticated]);

  const handleVerifyPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    setVerifying(true);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json();
      if (data.success || passcode.trim() === 'asi@bharat') {
        setIsAuthenticated(true);
        sessionStorage.setItem('asi_admin_authenticated', 'true');
        setPasscode('');
        fetchVisitorLogs(false);
      } else {
        setPasscodeError(
          data.message ||
            (lang === 'hi'
              ? 'अमान्य प्रशासनिक पासकोड। अभिगम अस्वीकृत।'
              : 'Invalid Administrative Passcode. Access Denied.')
        );
      }
    } catch {
      if (passcode.trim() === 'asi@bharat') {
        setIsAuthenticated(true);
        sessionStorage.setItem('asi_admin_authenticated', 'true');
        setPasscode('');
        fetchVisitorLogs(false);
      } else {
        setPasscodeError(
          lang === 'hi'
            ? 'अमान्य प्रशासनिक पासकोड। अभिगम अस्वीकृत।'
            : 'Invalid Administrative Passcode. Access Denied.'
        );
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleLockAdmin = () => {
    sessionStorage.removeItem('asi_admin_authenticated');
    setIsAuthenticated(false);
    setPasscode('');
    setPasscodeError(null);
  };

  const parseDevice = (platformStr?: string) => {
    const lower = (platformStr || '').toLowerCase();
    if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
      return { isMobile: true, label: 'Mobile Handset', icon: Smartphone };
    }
    return { isMobile: false, label: 'Desktop / PC', icon: Laptop };
  };

  if (!isOpen) return null;

  // Filtered Logs
  const filteredLogs = dbUsers.filter((u) => {
    if (!searchLogQuery.trim()) return true;
    const q = searchLogQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q)) ||
      (u.passId && u.passId.toLowerCase().includes(q))
    );
  });

  // ASI Administrator Passcode Gate (asi@bharat)
  if (!isAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md bg-[#ffffff] dark:bg-[#0a0e12] text-stone-900 dark:text-[#dfe7e0] rounded-2xl sm:rounded-3xl shadow-[0_24px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.9)] border border-stone-200 dark:border-white/15 p-5 sm:p-8 text-left overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Luxury Gradient Glow Ribbon */}
          <div className="w-full h-1 bg-gradient-to-r from-[#e0231c] via-[#c9a24a] to-[#9333EA] absolute top-0 left-0" />

          {/* Ambient Inner Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#e0231c]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#c9a24a]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5 relative z-10">
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#e0231c]/15 via-[#c9a24a]/15 to-[#9333EA]/15 dark:from-[#e0231c]/20 dark:via-[#c9a24a]/20 dark:to-[#9333EA]/20 border border-[#c9a24a]/40 text-[#c9a24a] flex items-center justify-center shadow-inner shrink-0">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9a24a]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-white leading-tight truncate">
                  {lang === 'hi' ? 'ASI प्रशासनिक सत्यापन' : 'ASI Admin Verification'}
                </h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-[#c9a24a] tracking-wider sm:tracking-widest uppercase flex items-center gap-1.5 mt-0.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e0231c] animate-pulse shrink-0"></span>
                  <span className="truncate">भारतीय पुरातत्व सर्वेक्षण (ASI)</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-glass-clay btn-glass-clay-icon w-7 h-7 sm:w-8 sm:h-8 rounded-full text-stone-400 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-zinc-400 mb-5 leading-relaxed">
            {lang === 'hi'
              ? 'यह प्रशासनिक पोर्टल केवल अधिकृत संरक्षकों के लिए है। केंद्रीय डेटाबेस में सभी डिवाइसेज के दर्शक लॉग्स देखने हेतु पासकोड दर्ज करें।'
              : 'Enter the administrator passcode to view cross-device visitor access logs and audit the national database.'}
          </p>

          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-zinc-300 mb-1.5">
                {lang === 'hi' ? 'प्रशासनिक पासकोड' : 'Administrator Passcode'}
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={lang === 'hi' ? 'गोपनीय पासकोड दर्ज करें...' : 'Enter security passcode...'}
                  className="w-full pl-4 pr-11 py-3 rounded-2xl text-xs sm:text-sm font-medium bg-stone-100 dark:bg-white/5 border border-stone-300 dark:border-white/15 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-200 cursor-pointer transition-colors"
                  aria-label={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {passcodeError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                {passcodeError}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="btn-glass-clay btn-glass-clay-amber w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {verifying
                ? (lang === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying...')
                : (lang === 'hi' ? 'प्रवेश अनलॉक करें' : 'Unlock Admin Portal')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#ffffff] dark:bg-[#0a0e12] text-stone-900 dark:text-[#dfe7e0] rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-white/15 overflow-hidden my-auto text-left animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3.5 sm:px-6 py-3 sm:py-4 bg-[#fcfaf7] dark:bg-[#05070a] border-b border-stone-200 dark:border-white/[0.08] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#e0231c] to-[#9333EA] text-white flex items-center justify-center shadow-md shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-serif font-bold text-sm sm:text-base md:text-lg text-stone-900 dark:text-white leading-tight truncate">
                  {lang === 'hi' ? 'ASI केंद्रीय प्रशासनिक पोर्टल' : 'ASI Central Admin Portal'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                  <span>{lang === 'hi' ? 'सत्यापित' : 'Verified'}</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                {lang === 'hi'
                  ? 'क्रॉस-डिवाइस आगंतुक ट्रैकिंग एवं राष्ट्रीय अभिलेखागार प्रबंधन'
                  : 'Real-time cross-device visitor sync & national repository audit'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleLockAdmin}
              className="btn-glass-clay btn-glass-clay-amber px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold cursor-pointer shrink-0"
              title={lang === 'hi' ? 'पोर्टल लॉक करें' : 'Lock Portal'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'लॉक करें' : 'Lock'}</span>
            </button>
            <button
              onClick={onClose}
              className="btn-glass-clay btn-glass-clay-icon w-7 h-7 sm:w-8 sm:h-8 rounded-full text-stone-400 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3.5 border-b border-stone-200 dark:border-white/[0.08] bg-stone-50/80 dark:bg-[#070a0e]/90 shrink-0">
          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#ffffff] dark:bg-[#0a0e12] border border-stone-200 dark:border-white/15 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-500 dark:text-zinc-400 mb-0.5 truncate">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#e0231c] shrink-0" />
              <span className="truncate">{lang === 'hi' ? 'कुल दर्शक' : 'Total Passes'}</span>
            </div>
            <div className="text-base sm:text-xl font-bold font-mono text-stone-900 dark:text-white">
              {dbUsers.length}
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#ffffff] dark:bg-[#0a0e12] border border-stone-200 dark:border-white/15 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 mb-0.5 truncate">
              <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse shrink-0" />
              <span className="truncate">{lang === 'hi' ? 'सक्रिय डिवाइसेज' : 'Active Devices'}</span>
            </div>
            <div className="text-base sm:text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span>{activeCount}</span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#ffffff] dark:bg-[#0a0e12] border border-stone-200 dark:border-white/15 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-amber-500 mb-0.5 truncate">
              <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{lang === 'hi' ? 'राज्य व UTs' : 'States & UTs'}</span>
            </div>
            <div className="text-base sm:text-xl font-bold font-mono text-stone-900 dark:text-white">
              {totalStatesCount}
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#ffffff] dark:bg-[#0a0e12] border border-stone-200 dark:border-white/15 shadow-xs">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-stone-500 dark:text-zinc-400 mb-0.5 truncate">
              <Database className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{lang === 'hi' ? 'डेटाबेस' : 'Database'}</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="truncate">Live Synced</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="grid grid-cols-2 gap-2 px-3 sm:px-6 pt-3 pb-2 border-b border-stone-200 dark:border-white/[0.08] bg-stone-50/50 dark:bg-[#070a0e]/50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('visitors')}
            className={`btn-glass-clay px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
              activeTab === 'visitors'
                ? 'btn-glass-clay-primary text-white shadow-md'
                : 'bg-stone-200/60 dark:bg-white/5 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'hi' ? 'दर्शक रिकॉर्ड' : 'Visitor Logs'}</span>
            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20 text-white font-bold shrink-0">
              {filteredLogs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className={`btn-glass-clay px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-all ${
              activeTab === 'community'
                ? 'btn-glass-clay-primary text-white shadow-md'
                : 'bg-stone-200/60 dark:bg-white/5 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{lang === 'hi' ? 'समुदायिक धरोहर' : 'Submissions'}</span>
            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-500 font-bold shrink-0">
              {communityItems.length}
            </span>
          </button>
        </div>

        {/* Tab Content Section */}
        <div className="p-3.5 sm:p-6 space-y-3 flex-1 overflow-y-auto text-xs min-h-0">
          {activeTab === 'community' ? (
            /* Community Submissions Moderation Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white flex items-center gap-2">
                    <span>{lang === 'hi' ? 'जन-अभिलेखागार प्रविष्टि प्रबंधन' : 'Community Archive Submissions'}</span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {communityItems.length} Entries
                    </span>
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">
                    {lang === 'hi'
                      ? 'नागरिकों व पर्यटकों द्वारा प्रस्तुत की गई धरोहर प्रविष्टियाँ।'
                      : 'Heritage monuments submitted by community explorers globally.'}
                  </p>
                </div>
              </div>

              {communityItems.length === 0 ? (
                <div className="p-6 sm:p-8 text-center text-xs text-stone-500 dark:text-zinc-400 rounded-2xl border border-dashed border-stone-300 dark:border-white/10">
                  <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-stone-400 mx-auto mb-2 opacity-50" />
                  <p>{lang === 'hi' ? 'अभी कोई समुदायिक धरोहर प्रविष्टि मौजूद नहीं है।' : 'No community submissions in the repository yet.'}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-stone-200 dark:border-white/15 bg-[#ffffff] dark:bg-[#0a0e12] overflow-hidden shadow-xs divide-y divide-stone-100 dark:divide-white/[0.06]">
                  {communityItems.map((item) => (
                    <div key={item.id} className="p-2.5 sm:p-3.5 flex items-center justify-between gap-2.5 hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <img
                          src={item.image_url || '/src/assets/images/monument_konark-sun-temple.jpg'}
                          alt={item.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-white/10"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/src/assets/images/monument_konark-sun-temple.jpg'; }}
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-stone-900 dark:text-white text-xs sm:text-sm truncate max-w-[130px] sm:max-w-none">
                              {item.title}
                            </span>
                            {item.hindi_title && (
                              <span className="text-[10px] sm:text-[11px] text-stone-500 dark:text-zinc-400 truncate max-w-[90px] sm:max-w-none">
                                ({item.hindi_title})
                              </span>
                            )}
                            <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase shrink-0">
                              {item.category_id}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                            {item.location_name} • {item.summary}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCommunity(item.id, item.title)}
                        disabled={deletingId === item.id}
                        className="btn-glass-clay btn-glass-clay-danger px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1 text-red-500 hover:text-white shrink-0 cursor-pointer disabled:opacity-50"
                        title={lang === 'hi' ? 'प्रविष्टि हटाएं' : 'Delete Entry'}
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{deletingId === item.id ? 'Deleting...' : (lang === 'hi' ? 'हटाएं' : 'Delete')}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Visitor Logs Tab */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white flex items-center gap-2">
                    <span className="truncate">{lang === 'hi' ? 'दर्शक अभिगम रिकॉर्ड' : 'Visitor Access Records'}</span>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                      {filteredLogs.length} Records
                    </span>
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                    {lang === 'hi'
                      ? 'सभी मोबाइल व लैपटॉप से जुड़े दर्शक रीयल-टाइम में।'
                      : 'Real-time database log of all visitor passes.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrivacyMasked((prev) => !prev);
                      if (isPrivacyMasked) {
                        setRevealedIds(new Set());
                      }
                    }}
                    className={`btn-glass-clay px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-xl transition-all ${
                      isPrivacyMasked
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                    }`}
                    title={isPrivacyMasked ? 'Click to Decrypt & Reveal All Names' : 'Click to Encrypt & Mask Names'}
                  >
                    {isPrivacyMasked ? <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    <span>{isPrivacyMasked ? (lang === 'hi' ? 'नाम गुप्त' : 'Masked') : (lang === 'hi' ? 'नाम प्रकट' : 'Revealed')}</span>
                  </button>

                  <button
                    onClick={() => fetchVisitorLogs(false)}
                    disabled={loadingLogs}
                    className="btn-glass-clay btn-glass-clay-primary px-3 py-1.5 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${loadingLogs ? 'animate-spin' : ''}`} />
                    <span>{lang === 'hi' ? 'ताज़ा करें' : 'Refresh'}</span>
                  </button>
                </div>
              </div>

              {/* Search Logs Input Card */}
              <div className="relative">
                <input
                  type="text"
                  value={searchLogQuery}
                  onChange={(e) => setSearchLogQuery(e.target.value)}
                  placeholder={
                    lang === 'hi'
                      ? 'दर्शक के नाम या पास आईडी से खोजें...'
                      : 'Search visitors by name or pass ID...'
                  }
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#05070a] text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#e0231c]"
                />
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 dark:text-zinc-400 absolute left-3 top-2.5" />
              </div>

              {/* Logs List Card */}
              <div className="rounded-2xl border border-stone-200 dark:border-white/15 bg-[#ffffff] dark:bg-[#0a0e12] overflow-hidden shadow-xs">
                <div className="px-3 sm:px-4 py-2 bg-stone-100/80 dark:bg-white/[0.04] border-b border-stone-200 dark:border-white/[0.08] flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-stone-700 dark:text-zinc-300">
                  <span>{lang === 'hi' ? 'दर्शक व डिवाइस' : 'VISITOR & DEVICE'}</span>
                  <span>{lang === 'hi' ? 'समय व स्थिति' : 'TIME & STATUS'}</span>
                </div>

                <div className="divide-y divide-stone-100 dark:divide-white/[0.06] max-h-56 sm:max-h-60 overflow-y-auto">
                  {loadingLogs && dbUsers.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center text-xs text-stone-500 dark:text-zinc-400">
                      {lang === 'hi' ? 'डेटाबेस रिकॉर्ड लोड हो रहे हैं...' : 'Loading database records...'}
                    </div>
                  ) : filteredLogs.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center text-xs text-stone-500 dark:text-zinc-400">
                      {searchLogQuery
                        ? (lang === 'hi' ? 'कोई मेल खाने वाला रिकॉर्ड नहीं मिला।' : 'No matching visitor records found.')
                        : (lang === 'hi' ? 'डेटाबेस में अभी कोई दर्शक रिकॉर्ड नहीं है।' : 'No visitor records in database yet.')}
                    </div>
                  ) : (
                    filteredLogs.map((u, idx) => {
                      const dev = parseDevice(u.platform);
                      const DevIcon = dev.icon;
                      const recordKey = String(u.passId || u.id || idx);
                      const isRevealed = !isPrivacyMasked || revealedIds.has(recordKey);
                      const displayName = isRevealed ? u.name : maskVisitorName(u.name);

                      return (
                        <div
                          key={recordKey}
                          className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs flex items-center justify-between hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-colors gap-2 sm:gap-3"
                        >
                          {/* Left: Avatar + Details */}
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            <div className="relative shrink-0">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'V'}
                              </div>
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0a0e12] ${
                                  u.isLive ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'
                                }`}
                              />
                            </div>

                            <div className="min-w-0 flex-1 text-left">
                              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                <span className={`font-semibold text-stone-900 dark:text-white truncate text-xs sm:text-sm max-w-[120px] sm:max-w-[180px] ${
                                  !isRevealed ? 'font-mono tracking-wider text-amber-600 dark:text-amber-400' : ''
                                }`}>
                                  {displayName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleRevealName(recordKey)}
                                  className="text-stone-400 hover:text-stone-900 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors cursor-pointer p-0.5 rounded hover:bg-stone-200 dark:hover:bg-white/10 shrink-0"
                                  title={isRevealed ? "Encrypt / Mask this name" : "Decrypt / Reveal this name"}
                                >
                                  {isRevealed ? <EyeOff className="w-3 h-3 text-amber-500" /> : <Eye className="w-3 h-3" />}
                                </button>
                                <span className="font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-white/10 text-stone-600 dark:text-zinc-300 shrink-0">
                                  PASS-{maskSensitiveId(u.passId || u.id, 4)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-stone-500 dark:text-zinc-400 mt-0.5 truncate">
                                <DevIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                                <span className="truncate">{dev.label}</span>
                                <span className="text-stone-300 dark:text-zinc-600 sm:hidden">•</span>
                                <span className="font-mono text-[9px] sm:hidden truncate">{u.login_time}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Timestamp & Status Badge */}
                          <div className="flex items-center gap-2 shrink-0 text-right">
                            <div className="hidden sm:flex flex-col text-right">
                              <div className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-zinc-300 font-mono">
                                <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                                <span>{u.login_time}</span>
                              </div>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border shrink-0 ${
                                u.isLive
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-stone-200 dark:bg-white/5 text-stone-600 dark:text-zinc-400 border-stone-300 dark:border-white/10'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  u.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
                                }`}
                              />
                              <span>{u.isLive ? 'Active' : 'Logged'}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="pt-2 sm:pt-3 border-t border-stone-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
            {onOpenContribute && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenContribute();
                }}
                className="btn-glass-clay btn-glass-clay-crimson px-3 py-2 text-xs font-semibold cursor-pointer text-center justify-center flex items-center gap-1.5"
              >
                <span>{lang === 'hi' ? '+ धरोहर जोड़ें (समुदायिक संग्रह)' : '+ Add Heritage Entry'}</span>
                <span>→</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="btn-glass-clay btn-glass-clay-secondary px-4 py-2 text-xs font-medium cursor-pointer text-center justify-center sm:ml-auto"
            >
              {lang === 'hi' ? 'कंसोल बंद करें' : 'Close Console'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
