import { useEffect } from 'react';

/**
 * Global Reference-Counted Body Scroll Lock Hook
 * Prevents background website scrolling when any modal, drawer, or menu is open.
 * Cleanly restores natural website scrolling when all modals/drawers are closed.
 */
let activeLockCount = 0;

export function lockBodyScroll() {
  activeLockCount++;
  if (activeLockCount === 1) {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }
}

export function unlockBodyScroll() {
  activeLockCount = Math.max(0, activeLockCount - 1);
  if (activeLockCount === 0) {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
}

export function forceUnlockBodyScroll() {
  activeLockCount = 0;
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

export function useBodyScrollLock(isLocked: boolean = false) {
  useEffect(() => {
    if (!isLocked) {
      if (activeLockCount <= 0) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
      return;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [isLocked]);
}
