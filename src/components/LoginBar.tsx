import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, LogOut } from 'lucide-react';

// 1. Temple / Sanctum Door State Icons
export const DoorClosed: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-4 h-4',
  size,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
    <path d="M2 21h20" />
    <rect x="6" y="5" width="12" height="16" rx="1" fill="currentColor" fillOpacity="0.22" />
    <path d="M8 9h8M8 15h8" strokeWidth="1.2" strokeOpacity="0.4" />
    <circle cx="9" cy="12.5" r="1.1" fill="currentColor" />
  </svg>
);

export const DoorOpen: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-4 h-4',
  size,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
    <path d="M2 21h20" />
    {/* Radiant Sanctum Spill Path */}
    <path d="M13 5v14h4.5V5H13z" fill="#FDE68A" fillOpacity="0.85" stroke="none" />
    <path d="M6 5l7-2.2v18.4l-7-2.2V5z" fill="currentColor" fillOpacity="0.32" />
    <circle cx="11.5" cy="12" r="1" fill="currentColor" />
  </svg>
);

// 2. Walking Character with animated natural stride cycle
export const WalkingPerson: React.FC<{
  className?: string;
  isWalking?: boolean;
  direction?: 'right' | 'left';
}> = ({ className = 'w-4 h-4', isWalking = false, direction = 'right' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} ${direction === 'left' ? 'scale-x-[-1]' : ''}`}
  >
    {/* Head with subtle natural gait bobbing */}
    <motion.circle
      cx="12"
      cy="4.5"
      r="2.2"
      fill="currentColor"
      animate={isWalking ? { cy: [4.5, 3.9, 4.5, 3.9, 4.5] } : { cy: 4.5 }}
      transition={{ duration: 0.44, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Torso */}
    <path d="M12 6.8v6" />
    {/* Dynamic swinging arms */}
    {isWalking ? (
      <>
        <motion.path
          d="M12 9 L8 12.5"
          animate={{ d: ['M12 9 L8 12.5', 'M12 9 L15.5 10.5', 'M12 9 L8 12.5'] }}
          transition={{ duration: 0.44, repeat: Infinity, ease: 'easeInOut' }}
          strokeOpacity="0.75"
        />
        <motion.path
          d="M12 9 L16 11"
          animate={{ d: ['M12 9 L16 11', 'M12 9 L8.5 12.5', 'M12 9 L16 11'] }}
          transition={{ duration: 0.44, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    ) : (
      <path d="M9.5 10.5l2.5 1 2.5-1" />
    )}
    {/* Dynamic alternating stride legs */}
    {isWalking ? (
      <>
        <motion.path
          d="M12 12.8 L7.5 18.8"
          animate={{
            d: [
              'M12 12.8 L7.5 18.8',
              'M12 12.8 L11.8 17.5',
              'M12 12.8 L16.5 18.8',
              'M12 12.8 L7.5 18.8',
            ],
          }}
          transition={{ duration: 0.44, repeat: Infinity, ease: 'easeInOut' }}
          strokeOpacity="0.8"
        />
        <motion.path
          d="M12 12.8 L16.5 18.8"
          animate={{
            d: [
              'M12 12.8 L16.5 18.8',
              'M12 12.8 L11.8 17.5',
              'M12 12.8 L7.5 18.8',
              'M12 12.8 L16.5 18.8',
            ],
          }}
          transition={{ duration: 0.44, repeat: Infinity, ease: 'easeInOut' }}
        />
      </>
    ) : (
      <path d="M10.2 19l1.8-6.2 1.8 6.2" />
    )}
  </svg>
);

export const CharacterInMotion = WalkingPerson;

export interface LoginBarHandle {
  triggerLogin: () => void;
}

export interface LoginBarProps {
  label?: string;
  userName?: string;
  isLoggedIn?: boolean;
  onBeforeLogin?: () => boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'violet';
  className?: string;
}

/**
 * LoginBar: Pure Glassmorphism + Claymorphism interactive Login Button Bar.
 * Integrated walk-in animation portal where character walks smoothly into the sanctum door.
 */
export const LoginBar = forwardRef<LoginBarHandle, LoginBarProps>(({
  label = 'Login',
  userName,
  isLoggedIn: externalIsLoggedIn = false,
  onBeforeLogin,
  onLoginClick,
  onLogoutClick,
  disabled = false,
  type = 'button',
  variant = 'violet',
  className = '',
}, ref) => {
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  // Login Walkthrough Flow
  const handleLogin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (disabled || isEntering || isExiting) return;

    if (onBeforeLogin && !onBeforeLogin()) {
      return;
    }

    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    // Step A: Walking person starts walking
    setIsEntering(true);

    // Step B (120ms): Door opens and radiates golden light
    const doorOpenTimer = window.setTimeout(() => {
      setIsDoorOpen(true);
    }, 120);

    // Step C (820ms): Person enters door, door softly closes
    const doorCloseTimer = window.setTimeout(() => {
      setIsDoorOpen(false);
    }, 820);

    // Step D (1050ms): Finish walk-in animation and trigger callback
    const finishTimer = window.setTimeout(() => {
      setIsEntering(false);
      onLoginClick?.();
    }, 1050);

    timersRef.current.push(doorOpenTimer, doorCloseTimer, finishTimer);
  };

  // Expose triggerLogin imperatively for form submission synchronization
  useImperativeHandle(ref, () => ({
    triggerLogin: () => {
      handleLogin();
    },
  }));

  // Logout Flow
  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isEntering || isExiting) return;

    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    setIsExiting(true);
    setIsDoorOpen(true);

    const doorCloseTimer = window.setTimeout(() => {
      setIsDoorOpen(false);
    }, 750);

    const finishTimer = window.setTimeout(() => {
      setIsExiting(false);
      onLogoutClick?.();
    }, 1000);

    timersRef.current.push(doorCloseTimer, finishTimer);
  };

  const glassClayClass =
    variant === 'primary' ? 'btn-glass-clay-primary' : 'btn-glass-clay-violet';

  // Active pass state
  if (externalIsLoggedIn && !isExiting) {
    return (
      <div
        className={`btn-glass-clay btn-glass-clay-emerald w-full py-3 px-4 rounded-xl flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-white truncate">
            {userName ? `Active Pass: ${userName}` : 'Heritage Pass Active'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={disabled || isExiting}
          className="btn-glass-clay py-1.5 px-3 text-xs font-semibold rounded-lg border border-red-400/40 text-red-200 hover:bg-red-500/20 flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isEntering || isExiting}
      onClick={externalIsLoggedIn ? handleLogout : (e) => handleLogin(e)}
      className={`btn-glass-clay ${glassClayClass} w-full py-3.5 px-4 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 relative overflow-hidden transform-gpu ${className}`}
    >
      {/* Subtle Inner Sheen Sweep during Door Transition */}
      <motion.div
        initial={false}
        animate={{
          opacity: isDoorOpen ? 0.35 : 0,
          scaleX: isDoorOpen ? 1 : 0.2,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-amber-300/40 pointer-events-none origin-right"
      />

      {/* Button Label Text */}
      <span className="relative z-10 font-semibold tracking-wide">
        {isEntering
          ? 'Entering...'
          : isExiting
          ? 'Exiting...'
          : label}
      </span>

      {/* Integrated Walking Person & Door Animation Portal */}
      <div className="relative z-10 flex items-center shrink-0 ml-1">
        {/* Unified Walkway Stage */}
        <div className="relative w-14 sm:w-16 h-6 flex items-center overflow-hidden rounded-md bg-black/20 border border-white/5">
          {/* Pathway line */}
          <div className="absolute bottom-0.5 left-1 right-1 h-[1px] bg-gradient-to-r from-white/10 via-amber-400/30 to-amber-300/60" />

          {/* Traveler moving across the walkway straight into the sanctum door */}
          <motion.div
            initial={false}
            animate={
              isEntering
                ? {
                    x: [2, 14, 26, 36],
                    y: [0, -1, 0, -1, 0],
                    opacity: [1, 1, 0.9, 0],
                    scale: [1, 0.95, 0.85, 0.55],
                  }
                : isExiting
                ? {
                    x: [36, 26, 14, 2],
                    y: [0, -1, 0, -1, 0],
                    opacity: [0, 0.8, 1, 1],
                    scale: [0.55, 0.85, 0.95, 1],
                  }
                : {
                    x: 2,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }
            }
            transition={{
              duration: isEntering || isExiting ? 1.05 : 0.2,
              ease: 'easeInOut',
            }}
            className="absolute left-0 top-0 bottom-0 flex items-center z-10"
          >
            <WalkingPerson
              isWalking={isEntering || isExiting}
              direction={isExiting ? 'left' : 'right'}
              className={`w-4 h-4 ${
                isEntering || isExiting
                  ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(253,230,138,0.95)]'
                  : 'text-white/90'
              }`}
            />
          </motion.div>

          {/* Temple Sanctum Door at the right end */}
          <div className="absolute right-1 top-0 bottom-0 flex items-center justify-center z-0">
            <AnimatePresence mode="wait">
              {isDoorOpen ? (
                <motion.div
                  key="door-open"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  className="relative"
                >
                  {/* Radiant sanctum glow */}
                  <div className="absolute -inset-1 rounded-full bg-amber-400/30 blur-xs pointer-events-none" />
                  <DoorOpen className="w-4 h-4 text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.95)]" />
                </motion.div>
              ) : (
                <motion.div
                  key="door-closed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                >
                  <DoorClosed className="w-4 h-4 text-white/90" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {!isEntering && !isExiting && (
          <ArrowRight className="w-3.5 h-3.5 text-white/80 shrink-0 ml-1.5" />
        )}
      </div>
    </button>
  );
});

LoginBar.displayName = 'LoginBar';
