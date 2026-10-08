import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { KageLandingPage } from './components/KageLandingPage.tsx';
import { StateCategoryExplorer, ThingToSeeCategory } from './components/StateCategoryExplorer.tsx';
import { StateSidePanel } from './components/StateSidePanel.tsx';
import { HeritageDetailModal } from './components/HeritageDetailModal.tsx';
import { SavedDrawer } from './components/SavedDrawer.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { AddHeritageModal } from './components/AddHeritageModal.tsx';
import { UserLoginModal } from './components/UserLoginModal.tsx';
import { LoginGateway } from './components/LoginGateway.tsx';
import { OfflineSanctuaryBanner } from './components/OfflineSanctuaryBanner.tsx';
import { Toast, ToastMessage } from './components/Toast.tsx';
import { State, Category, HeritageItem, SearchSuggestion, UserSession } from './types.ts';
import { LanguageKey, TRANSLATIONS } from './i18n.ts';
import { STATES, CATEGORIES, HERITAGE_ITEMS } from './data/seedDatabase.ts';
import { sortMonumentsByPopularity } from './data/monumentPopularity.ts';
import { initGlobalHaptics, triggerHaptic } from './utils/haptics.ts';
import { cacheHeritageDataOffline, getCachedHeritageItems, getOfflineStorageInfo } from './utils/offlineStorage.ts';
import { fetchCommunityHeritage, subscribeToCommunityHeritage, syncSavedItem, broadcastCrossTab } from './utils/cloudDatabase.ts';
import { useBodyScrollLock } from './utils/useBodyScrollLock.ts';

// Max Session Inactivity Timeout: 3 days (72 hours of inactivity auto-logout)
const MAX_SESSION_INACTIVITY_MS = 3 * 24 * 60 * 60 * 1000;

// Helper to validate stored session against 3-day inactivity policy
function getValidStoredSession(): UserSession | null {
  try {
    const saved = localStorage.getItem('bharat_current_user');
    if (!saved) return null;
    const user: UserSession = JSON.parse(saved);
    if (!user || !user.id) return null;

    const lastActiveMs = user.last_active
      ? new Date(user.last_active).getTime()
      : user.login_time
      ? new Date(user.login_time).getTime()
      : 0;

    // If user hasn't visited/logged in for 3 days, auto-logout
    if (!lastActiveMs || isNaN(lastActiveMs) || Date.now() - lastActiveMs > MAX_SESSION_INACTIVITY_MS) {
      localStorage.removeItem('bharat_current_user');
      return null;
    }

    // Refresh last_active timestamp
    const updatedUser = { ...user, last_active: new Date().toISOString() };
    localStorage.setItem('bharat_current_user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch {
    return null;
  }
}

export default function App() {
  // Localization & Theme
  const [lang, setLang] = useState<LanguageKey>(() => {
    return (localStorage.getItem('bharat_heritage_lang') as LanguageKey) || 'en';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bharat_heritage_dark');
    return saved !== null ? saved === 'true' : true;
  });

  // Data Collections (initialized with offline/static seed data for Vercel/Netlify static deployment)
  const [states, setStates] = useState<State[]>(STATES);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [heritageItems, setHeritageItems] = useState<HeritageItem[]>(HERITAGE_ITEMS);
  const [savedItems, setSavedItems] = useState<HeritageItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Filters & State selection
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [explorerCategory, setExplorerCategory] = useState<ThingToSeeCategory>('monuments');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('curated');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [activeHeritageItem, setActiveHeritageItem] = useState<HeritageItem | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [inspectingStateId, setInspectingStateId] = useState<string | null>(null);

  // Global Body Scroll Lock: Prevents background page scrolling whenever ANY modal or drawer is active
  const isAnyModalActive = Boolean(
    activeHeritageItem ||
    isSavedDrawerOpen ||
    isAdminModalOpen ||
    isContributeModalOpen ||
    isLoginModalOpen ||
    inspectingStateId
  );
  useBodyScrollLock(isAnyModalActive);

  // Remote Sanctuary Zero-Data Offline Mode State
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  // Background IndexedDB Offline-First Caching initialization
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (isMounted) {
          // Pre-seed and sync IndexedDB with latest catalog so updated videos & data are current
          await cacheHeritageDataOffline(HERITAGE_ITEMS, STATES);
        }
      } catch (err) {
        console.warn('IndexedDB auto-cache initialization:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to browser network status changes
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // User Session (persisted in SQLite & localStorage with 3-day inactivity auto-logout)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => getValidStoredSession());

  // Real-time Cross-Device Visitors & Logins Synchronization State
  const [allUsers, setAllUsers] = useState<UserSession[]>([]);
  const lastUsersHashRef = useRef<string>('');

  // Lightweight Polling Strategy for Cross-Device Login Visibility
  const fetchLiveUsers = useCallback(async () => {
    // Only poll when tab is active and not on file: protocol
    if (typeof document !== 'undefined' && document.hidden) return;
    if (typeof window !== 'undefined' && window.location.protocol === 'file:') return;

    try {
      const res = await fetch('/api/users');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        // Fast hash comparison (count + head ID + tail ID) to prevent unnecessary re-renders
        const hash = `${data.users.length}:${data.users[0]?.id || ''}:${data.users[data.users.length - 1]?.id || ''}`;
        if (hash !== lastUsersHashRef.current) {
          lastUsersHashRef.current = hash;
          setAllUsers(data.users);
        }
      }
    } catch {
      // Gracefully ignore transient network blips
    }
  }, []);

  // Fetch users on mount and tab focus (zero lag, zero CPU freeze)
  useEffect(() => {
    fetchLiveUsers();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLiveUsers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchLiveUsers]);

  // Silent Background Cross-Device Heartbeat & Registration
  useEffect(() => {
    if (!currentUser?.id) return;

    // 1. Silent register
    fetch('/api/visitors/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passId: currentUser.id,
        name: currentUser.name,
        role: currentUser.role || 'Cultural Heritage Explorer',
        platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Client',
      }),
    }).catch(() => {});

    // 2. Silent heartbeat ping every 30 seconds
    const interval = setInterval(() => {
      fetch('/api/visitors/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passId: currentUser.id }),
      }).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser?.id, currentUser?.name, currentUser?.role]);

  // Real-time BroadcastChannel & Storage event listener for same-device cross-tab synchronization
  useEffect(() => {
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'bharat_current_user') {
        try {
          const updatedUser = e.newValue ? JSON.parse(e.newValue) : null;
          setCurrentUser(updatedUser);
        } catch {
          setCurrentUser(null);
        }
        fetchLiveUsers();
      } else if (e.key === 'bharat_cross_tab_sync') {
        fetchLiveUsers();
      } else if (e.key === 'bharat_saved_items') {
        try {
          const updatedSaved = e.newValue ? JSON.parse(e.newValue) : [];
          setSavedItems(updatedSaved);
          setSavedIds(new Set(updatedSaved.map((i: any) => i.id)));
        } catch {}
      }
    };

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('bharat_heritage_explorer_realtime');
      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'USER_SESSION_UPDATED') {
          setCurrentUser(payload);
          fetchLiveUsers();
        } else if (type === 'SAVED_ITEMS_UPDATED' && Array.isArray(payload)) {
          setSavedItems(payload);
          setSavedIds(new Set(payload.map((i: any) => i.id)));
        }
      };
    }

    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (bc) bc.close();
    };
  }, [fetchLiveUsers]);

  const handleLoginSuccess = (user: UserSession) => {
    const userWithActive: UserSession = {
      ...user,
      last_active: new Date().toISOString(),
    };
    setCurrentUser(userWithActive);
    try {
      localStorage.setItem('bharat_current_user', JSON.stringify(userWithActive));
      localStorage.setItem('bharat_cross_tab_sync', Date.now().toString());
    } catch {}
    broadcastCrossTab('USER_SESSION_UPDATED', userWithActive);
    // Trigger immediate live refresh
    fetchLiveUsers();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('bharat_current_user');
      localStorage.setItem('bharat_cross_tab_sync', Date.now().toString());
    } catch {}
    broadcastCrossTab('USER_SESSION_UPDATED', null);
    fetchLiveUsers();
  };

  // User Geolocation
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Active session tracking & auto-logout check after 3 days of inactivity
  useEffect(() => {
    if (!currentUser) return;

    const verifySessionFreshness = () => {
      const valid = getValidStoredSession();
      if (!valid) {
        handleLogout();
        showToast(
          lang === 'hi'
            ? '3 दिन की निष्क्रियता के कारण आपका सत्र समाप्त हो गया है। कृपया पुनः साइन इन करें।'
            : 'Your session has expired after 3 days of inactivity. Please sign in again.',
          'info'
        );
      }
    };

    const handleFocus = () => {
      if (!document.hidden) verifySessionFreshness();
    };

    window.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    // Periodic check every 15 minutes
    const interval = setInterval(verifySessionFreshness, 15 * 60 * 1000);

    return () => {
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [currentUser?.id, lang]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initialize tactile micro-vibration haptic feedback on touch-supported devices
  useEffect(() => {
    const cleanupHaptics = initGlobalHaptics();
    return cleanupHaptics;
  }, []);

  // Optimized Zero-Lag Theme Switcher: disables layout transitions temporarily to prevent DOM-wide repaint lag
  const handleToggleDarkMode = useCallback(() => {
    document.documentElement.classList.add('disable-transitions');

    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
      try {
        localStorage.setItem('bharat_heritage_dark', next.toString());
      } catch {}
      return next;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('disable-transitions');
      });
    });
  }, []);

  // Sync initial theme with document element on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('bharat_heritage_dark', darkMode.toString());
  }, [darkMode]);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('bharat_heritage_lang', lang);
  }, [lang]);

  // Back to Top scroll listener (appears when scrolled past hero section)
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      const threshold = heroEl ? Math.max(heroEl.offsetHeight * 0.75, 360) : 400;
      setShowBackToTop(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // Fetch or filter heritage items with local in-memory fallback for static hosting
  const filterLocalItems = (s: string, c: string, p: string, sort: string, q: string) => {
    let filtered = [...HERITAGE_ITEMS];
    if (s && s !== 'all') {
      filtered = filtered.filter((i) => i.state_id === s);
    }
    if (c && c !== 'all') {
      filtered = filtered.filter((i) => i.category_id === c);
    }
    if (p && p !== 'all') {
      filtered = filtered.filter((i) => i.period === p);
    }
    if (q && q.trim()) {
      const query = q.toLowerCase();
      filtered = filtered.filter((i) =>
        i.title.toLowerCase().includes(query) ||
        (i.hindi_title && i.hindi_title.toLowerCase().includes(query)) ||
        i.summary.toLowerCase().includes(query) ||
        i.location_name.toLowerCase().includes(query)
      );
    }
    if (sort === 'alpha') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'unesco') {
      filtered.sort((a, b) => (b.unesco_flag ? 1 : 0) - (a.unesco_flag ? 1 : 0));
    } else {
      filtered = sortMonumentsByPopularity(filtered);
    }
    return filtered;
  };

  // Fetch initial database items
  useEffect(() => {
    const isFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
    if (isFile) {
      setStates(STATES);
      setCategories(CATEGORIES);
      setHeritageItems(filterLocalItems(selectedStateId || 'all', selectedCategory, selectedPeriod, sortBy, searchQuery));
      try {
        const localSaved = JSON.parse(localStorage.getItem('bharat_saved_items') || '[]');
        setSavedItems(localSaved);
        setSavedIds(new Set(localSaved.map((i: any) => i.id)));
      } catch {}
      return;
    }

    // 1. Fetch States (falls back to local data if running purely statically on Vercel)
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.states && data.states.length > 0) setStates(data.states);
      })
      .catch(() => setStates(STATES));

    // 2. Fetch Categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.categories && data.categories.length > 0) setCategories(data.categories);
      })
      .catch(() => setCategories(CATEGORIES));

    // 3. Fetch Heritage
    fetchHeritage();

    // 4. Fetch Saved Items
    fetch('/api/saved')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.saved) {
          const items = data.saved.map((s: any) => s.item).filter(Boolean);
          setSavedItems(items);
          setSavedIds(new Set(items.map((i: any) => i.id)));
        }
      })
      .catch(() => {
        try {
          const localSaved = JSON.parse(localStorage.getItem('bharat_saved_items') || '[]');
          setSavedItems(localSaved);
          setSavedIds(new Set(localSaved.map((i: any) => i.id)));
        } catch {
          // ignore
        }
      });

    // 5. Fetch Community Contributed Archive & Realtime Subscribe
    fetchCommunityHeritage().then((items) => {
      if (Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          if (!HERITAGE_ITEMS.some((h) => h.id === item.id)) {
            HERITAGE_ITEMS.unshift(item);
          }
        }
        setHeritageItems((prev) => {
          const missing = items.filter((item: HeritageItem) => !prev.some((p) => p.id === item.id));
          return missing.length > 0 ? [...missing, ...prev] : prev;
        });
      }
    });

    const unsubscribe = subscribeToCommunityHeritage((items) => {
      if (Array.isArray(items)) {
        for (const item of items) {
          if (!HERITAGE_ITEMS.some((h) => h.id === item.id)) {
            HERITAGE_ITEMS.unshift(item);
          }
        }
        setHeritageItems((prev) => {
          const nonCommunity = prev.filter((p) => !p.is_community);
          return [...items, ...nonCommunity];
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch or filter heritage items with local in-memory fallback for static hosting
  const fetchHeritage = (customState?: string, customCategory?: string, customPeriod?: string, customSort?: string, customQuery?: string) => {
    const s = customState !== undefined ? customState : selectedStateId || 'all';
    const c = customCategory !== undefined ? customCategory : selectedCategory;
    const p = customPeriod !== undefined ? customPeriod : selectedPeriod;
    const sort = customSort !== undefined ? customSort : sortBy;
    const q = customQuery !== undefined ? customQuery : searchQuery;

    const isFile = typeof window !== 'undefined' && window.location.protocol === 'file:';
    if (isFile) {
      setHeritageItems(filterLocalItems(s, c, p, sort, q));
      return;
    }

    let url = `/api/heritage?state=${encodeURIComponent(s)}&category=${encodeURIComponent(c)}&period=${encodeURIComponent(p)}&sort=${encodeURIComponent(sort)}&q=${encodeURIComponent(q)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.heritage) {
          setHeritageItems(data.heritage);
        }
      })
      .catch(() => {
        setHeritageItems(filterLocalItems(s, c, p, sort, q));
      });
  };

  // Re-fetch when category, period, or sort changes (debounced for smooth search UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHeritage(selectedStateId || 'all', selectedCategory, selectedPeriod, sortBy, searchQuery);
    }, 180);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedPeriod, sortBy, searchQuery, selectedStateId]);

  // Memoized handlers to prevent StateCategoryExplorer re-renders
  const handleSelectState = useCallback((stateId: string | null) => {
    setSelectedStateId(stateId);
  }, []);

  const handleSelectItem = useCallback((item: HeritageItem) => {
    setActiveHeritageItem(item);
  }, []);

  const handleOpenAdmin = useCallback(() => {
    setIsAdminModalOpen(true);
  }, []);

  const handleOpenContribute = useCallback(() => {
    setIsContributeModalOpen(true);
  }, []);

  const handleOpenStatePanel = useCallback((sId: string) => {
    setInspectingStateId(sId);
  }, []);

  const handleSelectExplorerCategory = useCallback((category: ThingToSeeCategory) => {
    setExplorerCategory(category);
  }, []);

  // Toggle Save item (memoized with useCallback)
  const handleToggleSave = useCallback(async (itemId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const isCurrentlySaved = savedIds.has(itemId);
    const targetItem = heritageItems.find((h) => h.id === itemId) || savedItems.find((s) => s.id === itemId);

    if (isCurrentlySaved) {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      setSavedItems((prev) => prev.filter((item) => item.id !== itemId));
      showToast(TRANSLATIONS[lang].removed_toast, 'info');

      syncSavedItem(itemId, false, currentUser?.id).catch(() => {});
      try {
        await fetch(`/api/save/${itemId}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('API save delete sync failed:', err);
      }
    } else {
      if (targetItem) {
        setSavedIds((prev) => new Set(prev).add(itemId));
        setSavedItems((prev) => [targetItem, ...prev]);
        showToast(TRANSLATIONS[lang].saved_toast, 'success');

        syncSavedItem(itemId, true, currentUser?.id).catch(() => {});
        try {
          await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: itemId })
          });
        } catch (err) {
          console.warn('API save post sync failed:', err);
        }
      }
    }

    setTimeout(() => {
      try {
        const updated = isCurrentlySaved
          ? savedItems.filter((i) => i.id !== itemId)
          : targetItem
          ? [targetItem, ...savedItems]
          : savedItems;
        localStorage.setItem('bharat_saved_items', JSON.stringify(updated));
        broadcastCrossTab('SAVED_ITEMS_UPDATED', updated);
      } catch {
        // ignore
      }
    }, 100);
  }, [savedIds, heritageItems, savedItems, lang]);

  // Handle Community & Admin new item created
  const handleHeritageAdded = (newItem: HeritageItem) => {
    if (!HERITAGE_ITEMS.some((h) => h.id === newItem.id)) {
      HERITAGE_ITEMS.unshift(newItem);
    }
    setHeritageItems((prev) => {
      if (prev.some((p) => p.id === newItem.id)) return prev;
      return [newItem, ...prev];
    });
    showToast(
      lang === 'hi'
        ? `"${newItem.title}" राष्ट्रीय जन अभिलेखागार में सफलतापूर्वक जोड़ा गया!`
        : `"${newItem.title}" added to National Community Archive!`,
      'success'
    );
  };

  // Handle Community item deletion by authorized Admin
  const handleHeritageDeleted = (deletedId: string) => {
    const idx = HERITAGE_ITEMS.findIndex((h) => h.id === deletedId);
    if (idx !== -1) HERITAGE_ITEMS.splice(idx, 1);
    setHeritageItems((prev) => prev.filter((h) => h.id !== deletedId));
    showToast(
      lang === 'hi'
        ? 'धरोहर प्रविष्टि जन-अभिलेखागार से हटा दी गई।'
        : 'Heritage entry removed from Community Archive.',
      'info'
    );
  };

  // Autocomplete suggestion select
  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'state') {
      setSelectedStateId(suggestion.id);
      const targetState = states.find((s) => s.id === suggestion.id);
      if (targetState) {
        showToast(`Selected ${targetState.name} in explorer`, 'info');
      }
      handleNavigateSection('state-explorer');
    } else {
      const item = heritageItems.find((h) => h.id === suggestion.id);
      if (item) {
        setActiveHeritageItem(item);
      } else {
        fetch(`/api/heritage/${suggestion.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.item) {
              setActiveHeritageItem(data.item);
            }
          });
      }
    }
  };

  // Smooth scroll
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mandatory Visitor Pass Gate: User must register name & login before viewing repository
  if (!currentUser) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LoginGateway lang={lang} onLoginSuccess={handleLoginSuccess} onToast={showToast} />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans ${
      darkMode ? 'dark bg-[#05070a] text-[#dfe7e0]' : 'bg-[#faf8f5] text-stone-900'
    }`}>
      {/* Top Bar Navigation */}
      <Navbar
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'hi' : 'en')}
        onSelectLang={(newLang) => setLang(newLang)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        savedCount={savedIds.size}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenContribute={() => setIsContributeModalOpen(true)}
        onNavigateSection={handleNavigateSection}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        totalVisitorsCount={allUsers.length}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={async () => {
          const nextMode = !isOfflineMode;
          setIsOfflineMode(nextMode);
          triggerHaptic('selection');
          if (nextMode) {
            const cached = await getCachedHeritageItems();
            if (cached && cached.length > 0) {
              setHeritageItems(cached);
            }
            showToast(
              TRANSLATIONS[lang]?.offline_active
                ? `${TRANSLATIONS[lang].offline_active}`
                : 'Offline-First Active: Loaded catalog from local cache.'
            );
          } else {
            showToast(
              TRANSLATIONS[lang]?.switch_online
                ? `${TRANSLATIONS[lang].switch_online}`
                : 'Online Mode: Connected to central national repository.'
            );
          }
        }}
      />

      {/* Zero-Data Remote Sanctuary Offline Mode Banner */}
      <OfflineSanctuaryBanner
        isOfflineMode={isOfflineMode}
        onToggleOffline={() => setIsOfflineMode(false)}
        lang={lang}
        cachedCount={heritageItems.length}
      />

      {/* Main Content Areas with Flexible Grid Layout Container */}
      <main className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden">
        {/* Flexible Grid Container ensuring all content wraps gracefully on mobile devices */}
        <div className="grid grid-cols-1 w-full min-w-0 max-w-full auto-rows-auto">
          {/* KageLandingPage using prescribed configuration within responsive grid */}
          <KageLandingPage
            lang={lang}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectSuggestion={handleSelectSuggestion}
            onExploreState={() => handleNavigateSection('state-explorer')}
            onSelectCategoryQuick={(catId) => {
              setExplorerCategory(catId as ThingToSeeCategory);
              handleNavigateSection('state-explorer');
            }}
          />

          {/* Section: Manual State & Category Explorer */}
          <StateCategoryExplorer
            lang={lang}
            states={states}
            selectedStateId={selectedStateId}
            onSelectState={handleSelectState}
            heritageItems={heritageItems}
            onSelectItem={handleSelectItem}
            onToggleSave={handleToggleSave}
            savedItemIds={savedIds}
            onOpenAdmin={handleOpenAdmin}
            onOpenContribute={handleOpenContribute}
            onOpenStatePanel={handleOpenStatePanel}
            activeCategory={explorerCategory}
            onSelectCategory={handleSelectExplorerCategory}
          />
        </div>
      </main>

      {/* State Cultural Details Slide Panel */}
      <StateSidePanel
        lang={lang}
        stateId={inspectingStateId}
        onClose={() => setInspectingStateId(null)}
        onSelectHeritageItem={(item) => setActiveHeritageItem(item)}
      />

      {/* Heritage Detail Full Modal */}
      <HeritageDetailModal
        lang={lang}
        item={activeHeritageItem}
        allItems={heritageItems}
        onClose={() => setActiveHeritageItem(null)}
        isSaved={activeHeritageItem ? savedIds.has(activeHeritageItem.id) : false}
        onToggleSave={(id) => handleToggleSave(id)}
        onShowToast={showToast}
        onSelectRecommendedItem={(rec) => setActiveHeritageItem(rec)}
      />

      {/* Saved Bookmarks Drawer */}
      <SavedDrawer
        lang={lang}
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedItems={savedItems}
        onRemoveSaved={(id) => handleToggleSave(id)}
        onSelectItem={(item) => setActiveHeritageItem(item)}
      />

      {/* Public Heritage Submission Modal - Open for All Users (No Password Required) */}
      <AddHeritageModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        states={states}
        categories={categories}
        onHeritageAdded={handleHeritageAdded}
        lang={lang}
      />

      {/* ASI Admin Portal - Restricted for Site Owner / Admin (Protected with asi@bharat) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        lang={lang}
        totalStatesCount={states.length}
        totalHeritageCount={heritageItems.length}
        onOpenContribute={() => setIsContributeModalOpen(true)}
        liveUsers={allUsers}
        onRefreshLogs={fetchLiveUsers}
        communityItems={heritageItems.filter((h) => h.is_community)}
        onDeleteCommunityItem={handleHeritageDeleted}
      />

      {/* User Login & SQLite Database Session Modal */}
      <UserLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onToast={showToast}
        allUsers={allUsers}
        onRefreshUsers={fetchLiveUsers}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Institutional Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-white/[0.08] bg-[#f5f2eb] dark:bg-[#0a0e12] py-12 transition-colors text-stone-900 dark:text-[#dfe7e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="font-serif text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-[#e0231c]"></span>
              <span>{TRANSLATIONS[lang]?.brand || 'Bharat Darshan'} - {TRANSLATIONS[lang]?.hero_archive_badge || 'National Archive'}</span>
            </span>
            <p className="mt-1.5 text-xs text-stone-600 dark:text-zinc-400 max-w-md leading-relaxed">
              {TRANSLATIONS[lang]?.hero_subtitle || "A comprehensive national cultural repository dedicated to the preservation, documentation, and educational discovery of India's living traditions and architectural landmarks across all 36 States & UTs."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-stone-500 dark:text-zinc-400">
            <span className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-default">{TRANSLATIONS[lang]?.states_36 || '36 State Archives'}</span>
            <span aria-hidden="true" className="text-stone-400 dark:text-zinc-600">·</span>
            <span className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-default">ASI Heritage Registry</span>
            <span aria-hidden="true" className="text-stone-400 dark:text-zinc-600">·</span>
            <span className="hover:text-stone-900 dark:hover:text-white transition-colors cursor-default">UNESCO World Heritage</span>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button (Glass-Clay Styled with Smooth Scrolling) */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}
          className="btn-glass-clay-icon !fixed !bottom-6 !right-6 !z-50 w-12 h-12 !rounded-full !p-0 aspect-square shrink-0 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-in fade-in zoom-in-75 cursor-pointer ring-1 ring-black/10 dark:ring-white/20"
          title={TRANSLATIONS[lang]?.back_to_top || 'Back to Top'}
          aria-label={TRANSLATIONS[lang]?.back_to_top || 'Back to Top'}
        >
          <ArrowUp className="w-5 h-5 shrink-0 text-stone-900 dark:text-white" />
        </button>
      )}
    </div>
  );
}
