/**
 * Tactile Micro-Vibration & Haptic Feedback Engine
 * Provides subtle, crisp haptic feedback exclusively on deliberate user clicks/taps.
 * Casual touch-scrolling and swipe gestures are strictly prevented from triggering haptics.
 */

let lastVibrationTime = 0;
let isScrollingOrSwiping = false;
let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

export type HapticStyle = 'light' | 'medium' | 'selection' | 'success';

// Short, subtle vibration durations (max 8–15ms)
const HAPTIC_PATTERNS: Record<HapticStyle, number> = {
  light: 8,       // Subtle crisp tap (8ms)
  medium: 12,     // Button press (12ms)
  selection: 10,  // Tab/toggle selection (10ms)
  success: 15,    // Success action (15ms)
};

/**
 * Marks the device as currently scrolling or swiping.
 * Prevents any haptic vibration during scroll movements.
 */
function handleScrollOrMove() {
  isScrollingOrSwiping = true;
  if (scrollTimeout !== null) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(() => {
    isScrollingOrSwiping = false;
  }, 150);
}

/**
 * Triggers a subtle vibration strictly for deliberate user interactions.
 * Will NOT vibrate if the user is scrolling, swiping, or if prefers-reduced-motion is enabled.
 */
export function triggerHaptic(style: HapticStyle = 'light'): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

  // 1. Never vibrate during scroll, swipe, or touchmove
  if (isScrollingOrSwiping) {
    return false;
  }

  // 2. Check if navigator.vibrate is supported
  if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') {
    return false;
  }

  // 3. Respect user's reduced-motion preference
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }
  } catch {
    // Ignore matchMedia errors
  }

  // 4. Throttle to prevent vibration overlap (minimum 50ms interval)
  const now = Date.now();
  if (now - lastVibrationTime < 50) {
    return false;
  }
  lastVibrationTime = now;

  try {
    const duration = HAPTIC_PATTERNS[style] || 8;
    return navigator.vibrate(duration);
  } catch {
    return false;
  }
}

/**
 * Initializes global scroll listeners and delegated click handler for tactile feedback.
 * Uses 'click' events instead of 'pointerdown' so scrolling/dragging never triggers vibration.
 */
export function initGlobalHaptics(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // Attach passive scroll and touchmove listeners to catch all scrolling activity
  window.addEventListener('scroll', handleScrollOrMove, { passive: true });
  window.addEventListener('touchmove', handleScrollOrMove, { passive: true });
  window.addEventListener('wheel', handleScrollOrMove, { passive: true });

  // Delegated click handler for deliberate user taps/clicks
  const handleClick = (e: MouseEvent) => {
    // If user was scrolling or swiping, ignore
    if (isScrollingOrSwiping) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    const button = target.closest(
      '.btn-glass-clay, .btn-glass-clay-icon, .btn-glass-clay-tab, .btn-glass-clay-primary, button, [role="button"], a[role="button"]'
    );

    if (button) {
      if (button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true') {
        return;
      }

      const isTabOrToggle = button.classList.contains('btn-glass-clay-tab') || button.getAttribute('role') === 'tab';
      triggerHaptic(isTabOrToggle ? 'selection' : 'light');
    }
  };

  document.addEventListener('click', handleClick, { passive: true });

  return () => {
    window.removeEventListener('scroll', handleScrollOrMove);
    window.removeEventListener('touchmove', handleScrollOrMove);
    window.removeEventListener('wheel', handleScrollOrMove);
    document.removeEventListener('click', handleClick);
    if (scrollTimeout !== null) {
      clearTimeout(scrollTimeout);
    }
  };
}
