import React, { useState, useEffect, useRef } from 'react';
import { getHeritageImageUrl, handleHeritageImageError } from '../utils/imageHelper.ts';

export interface LazyHeritageImageProps {
  src?: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  itemId?: string;
  categoryId?: string;
  aspectRatio?: string;
}

// Shared IntersectionObserver singleton to prevent 100+ observer instances in memory
const observerCallbacks = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              observerCallbacks.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        }
      },
      {
        root: null,
        rootMargin: '300px 0px', // Prefetch 300px before entering viewport for silky 60fps scrolling
        threshold: 0.01,
      }
    );
  }
  return sharedObserver;
}

/**
 * High-performance, IntersectionObserver-based lazy loading image component.
 * Defers network downloads and decoding until the card enters or approaches the viewport.
 * Uses a single shared observer to guarantee zero CPU/memory overhead during rapid scrolls.
 */
export const LazyHeritageImage: React.FC<LazyHeritageImageProps> = React.memo(({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  itemId,
  categoryId,
  aspectRatio,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const obs = getSharedObserver();
    if (!obs) {
      setIsVisible(true);
      return;
    }

    observerCallbacks.set(target, () => setIsVisible(true));
    obs.observe(target);

    return () => {
      observerCallbacks.delete(target);
      obs.unobserve(target);
    };
  }, []);

  const resolvedSrc = getHeritageImageUrl(src, itemId, categoryId);

  return (
    <div
      ref={containerRef}
      style={aspectRatio ? { aspectRatio } : undefined}
      className={`relative w-full h-full overflow-hidden bg-stone-100 dark:bg-[#05070a] ${wrapperClassName}`}
    >
      {/* Shimmer Placeholder Skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-200/80 via-stone-100/90 to-stone-200/80 dark:from-[#0a0e12] dark:via-[#151e26] dark:to-[#0a0e12] animate-pulse pointer-events-none" />
      )}

      {isVisible && (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            setIsLoaded(true);
            setHasError(true);
            handleHeritageImageError(e, itemId, categoryId);
          }}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
});

LazyHeritageImage.displayName = 'LazyHeritageImage';
