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

/**
 * High-performance, IntersectionObserver-based lazy loading image component.
 * Defers network downloads and decoding until the card enters or approaches the viewport (250px rootMargin prefetch).
 * Provides shimmering skeleton placeholders and zero-jank GPU-accelerated opacity fades.
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
    // Fallback if SSR or IntersectionObserver is unsupported in the client browser
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            setIsVisible(true);
            obs.unobserve(target);
            break;
          }
        }
      },
      {
        root: null,
        rootMargin: '250px 0px', // Prefetch 250px before entering viewport for smooth scrolling
        threshold: 0.01,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
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
