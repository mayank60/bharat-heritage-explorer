import React, { useState, useEffect } from 'react';
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

// 2. Walking Character with animated stride
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
    <circle cx="12" cy="4.5" r="2.2" fill="currentColor" />
    <path d="M12 6.8v6" />
    <path d={isWalking ? "M8.5 9.5l3.5 1.5 3.5-1.5" : "M9.5 10.5l2.5 1 2.5-1"} />
    <path d={isWalking ? "M12 12.8l-3.2 6.2M12 12.8l3.8 6.2" : "M10.2 19l1.8-6.2 1.8 6.2"} />
  </svg>
);

export const CharacterInMotion = WalkingPerson;

interface LoginBarProps {
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
 * Perfectly centered, non-overlapping with smooth walking person & door animation.
 */
export const LoginBar: React.FC<LoginBarProps> = ({
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
}) => {
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(externalIsLoggedIn);
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(externalIsLoggedIn);
  }, [externalIsLoggedIn]);

  // Login Walkthrough Flow
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || isEntering || isExiting) return;

    if (onBeforeLogin && !onBeforeLogin()) {
      return;
    }

    // Step A: Walking person starts walking
    setIsEntering(true);

    // Step B (100ms): Door opens
    const doorOpenTimer = setTimeout(() => {
      setIsDoorOpen(true);
    }, 100);

    // Step C (750ms): Person enters door, door closes
    const doorCloseTimer = setTimeout(() => {
      setIsDoorOpen(false);
    }, 750);

    // Step D (1000ms): Finish login action
    const finishTimer = setTimeout(() => {
      setIsEntering(false);
      setIsLoggedIn(true);
      onLoginClick?.();
    }, 1000);

    return () => {
      clearTimeout(doorOpenTimer);
      clearTimeout(doorCloseTimer);
      clearTimeout(finishTimer);
    };
  };

  // Logout Flow
  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isEntering || isExiting) return;

    setIsExiting(true);
    setIsDoorOpen(true);

    const doorCloseTimer = setTimeout(() => {
      setIsDoorOpen(false);
    }, 750);

    const finishTimer = setTimeout(() => {
      setIsExiting(false);
      setIsLoggedIn(false);
      onLogoutClick?.();
    }, 1000);

    return () => {
      clearTimeout(doorCloseTimer);
      clearTimeout(finishTimer);
    };
  };

  const glassClayClass =
    variant === 'primary' ? 'btn-glass-clay-primary' : 'btn-glass-clay-violet';

  // Active pass state
  if (isLoggedIn && !isExiting) {
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
      onClick={isLoggedIn ? handleLogout : handleLogin}
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
      <div className="relative z-10 flex items-center gap-1.5 shrink-0 ml-1">
        {/* Walking Track */}
        <div className="relative w-7 h-5 flex items-center justify-center overflow-hidden">
          <motion.div
            animate={
              isEntering
                ? {
                    x: [-14, -5, 3, 11],
                    y: [0, -1.5, 0, -1.5, 0],
                    opacity: [1, 1, 0.7, 0],
                    scale: [1, 0.95, 0.85, 0.7],
                  }
                : isExiting
                ? {
                    x: [11, 3, -5, -14],
                    y: [0, -1.5, 0, -1.5, 0],
                    opacity: [0, 0.7, 1, 1],
                    scale: [0.7, 0.85, 0.95, 1],
                  }
                : {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                  }
            }
            transition={{
              duration: isEntering || isExiting ? 0.95 : 0.2,
              ease: 'easeInOut',
            }}
            className="flex items-center justify-center"
          >
            <WalkingPerson
              isWalking={isEntering || isExiting}
              direction={isExiting ? 'left' : 'right'}
              className={`w-4 h-4 ${
                isEntering || isExiting
                  ? 'text-amber-200 drop-shadow-[0_0_6px_rgba(253,230,138,0.9)]'
                  : 'text-white/90'
              }`}
            />
          </motion.div>
        </div>

        {/* Door (Open vs Closed) */}
        <div className="shrink-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isDoorOpen ? (
              <motion.div
                key="door-open"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.16 }}
              >
                <DoorOpen className="w-4 h-4 text-amber-200 drop-shadow-[0_0_8px_rgba(253,230,138,0.9)]" />
              </motion.div>
            ) : (
              <motion.div
                key="door-closed"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.16 }}
              >
                <DoorClosed className="w-4 h-4 text-white/90" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!isEntering && !isExiting && (
          <ArrowRight className="w-3.5 h-3.5 text-white/90 shrink-0" />
        )}
      </div>
    </button>
  );
};
