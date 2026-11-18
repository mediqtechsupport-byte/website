'use client';

import { MoveUpRight } from 'lucide-react';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface ImageData {
  id: number | string;
  src: string;
  alt: string;
  subtitle?: string;
}

const DEFAULT_IMAGES: ImageData[] = [
  {
    id: 1,
    src: 'assets/img/hero-products.jpg',
    alt: 'Rayner Ophthalmic Portfolio',
    subtitle: 'Exclusive Principal · Philippines',
  },
  {
    id: 2,
    src: 'assets/img/news-spiral-optic-showcase.jpg',
    alt: 'Ophthalmic Lenses',
    subtitle: 'RayOne & Sulcoflex IOL Platforms',
  },
  {
    id: 3,
    src: 'assets/img/packshots/ophteis_cohesive_clean.png',
    alt: 'Viscoelastics & OVDs',
    subtitle: 'Ophteis Bio-Engineered Range',
  },
  {
    id: 4,
    src: 'assets/img/packshots/emv_stage.png',
    alt: 'Preloaded Delivery Systems',
    subtitle: 'Single-Use Precision Injector',
  },
];

// Inlined useMediaQuery hook to resolve import issue
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQueryList = window.matchMedia(query);
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      setMatches(mediaQueryList.matches);
      mediaQueryList.addEventListener('change', listener);
      return () => mediaQueryList.removeEventListener('change', listener);
    }
  }, [query]);

  return matches;
};

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: ImageData[];
  variant?: 'default' | 'blue-theme' | 'green-theme';
  size?: 'default' | 'compact' | 'expanded';
  asChild?: boolean;
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ items = DEFAULT_IMAGES, variant = 'default', size = 'default', asChild, className, children, ...props }, ref) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [activeImage, setActiveImage] = useState<ImageData | null>(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(0.5);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestRef = useRef<number | null>(null);
    const prevCursorPosition = useRef({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: MouseEvent) => {
      const { clientX, clientY } = e;
      const dx = clientX - prevCursorPosition.current.x;
      const dy = clientY - prevCursorPosition.current.y;

      // Apply smooth easing so the floating card trails the pointer naturally
      const easeAmount = 0.2;
      const newX = prevCursorPosition.current.x + dx * easeAmount;
      const newY = prevCursorPosition.current.y + dy * easeAmount;

      setCursorPosition({ x: newX, y: newY });
      prevCursorPosition.current = { x: newX, y: newY };
    }, []);

    useEffect(() => {
      const updateCursorPosition = (e: MouseEvent) => {
        if (requestRef.current) return;
        requestRef.current = requestAnimationFrame(() => {
          handleMouseMove(e);
          requestRef.current = null;
        });
      };

      window.addEventListener('mousemove', updateCursorPosition);
      return () => {
        window.removeEventListener('mousemove', updateCursorPosition);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [handleMouseMove]);

    const handleImageHover = useCallback(
      (image: ImageData) => {
        if (activeImage?.id !== image.id) {
          setActiveImage(image);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setOpacity(1);
            setScale(1);
          }, 50);
        } else {
          setOpacity(1);
          setScale(1);
        }
      },
      [activeImage]
    );

    const handleMouseLeave = useCallback(() => {
      setOpacity(0);
      setScale(0.5);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setActiveImage(null);
      }, 300);
    }, []);

    const variantClasses = {
      default: 'dark:bg-gradient-to-b from-[#07142e] from-10% to-[#0a1d40] to-100% bg-gray-100',
      'blue-theme': 'dark:bg-gradient-to-b from-blue-900 from-10% to-blue-950 to-100% bg-blue-100',
      'green-theme': 'dark:bg-gradient-to-b from-green-900 from-10% to-green-950 to-100% bg-green-100',
    };

    const sizeClasses = {
      default: 'p-4 text-xl sm:text-2xl md:text-5xl',
      compact: 'p-2 text-lg sm:text-xl md:text-4xl',
      expanded: 'p-6 text-2xl sm:text-3xl md:text-6xl',
    };

    const h2SizeClasses = {
      default: 'text-xl sm:text-2xl md:text-5xl',
      compact: 'text-lg sm:text-xl md:text-4xl',
      expanded: 'text-2xl sm:text-3xl md:text-6xl',
    };

    const commonClasses = cn(
      'relative w-full min-h-fit rounded-md border border-[#72c5f8]/20',
      variantClasses[variant],
      className
    );

    if (asChild) {
      return React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ ref?: React.Ref<HTMLDivElement>; className?: string }>, {
            ref,
            className: cn((children.props as { className?: string }).className, commonClasses),
            ...props,
          })
        : <div ref={ref} className={commonClasses} {...props}>{children}</div>;
    }

    return (
      <div
        ref={ref}
        className={commonClasses}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {items.map((image) => (
          <div
            key={image.id}
            className={cn('cursor-pointer relative sm:flex items-center justify-between', sizeClasses[size])}
            onMouseEnter={() => handleImageHover(image)}
          >
            {!isDesktop && (
              <img
                src={image.src}
                className="sm:w-32 sm:h-20 w-full h-52 object-cover rounded-md"
                alt={image.alt}
              />
            )}
            <h2
              className={cn(
                'uppercase font-semibold sm:py-6 py-2 leading-[100%] relative',
                h2SizeClasses[size],
                activeImage?.id === image.id
                  ? 'mix-blend-difference z-20 text-gray-300'
                  : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {image.alt}
            </h2>
            <button
              type="button"
              aria-label={image.alt}
              className={cn(
                'sm:block hidden p-4 rounded-full transition-all duration-300 ease-out',
                activeImage?.id === image.id
                  ? 'mix-blend-difference z-20 bg-white text-black'
                  : ''
              )}
            >
              <MoveUpRight className="w-8 h-8" />
            </button>
            <div
              className={`h-[2px] dark:bg-[#72c5f8] bg-black absolute bottom-0 left-0 transition-all duration-300 ease-linear ${
                activeImage?.id === image.id ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        ))}
        {isDesktop && activeImage && (
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            className="fixed dark:bg-[#07142e] bg-white object-cover pointer-events-none z-10 w-[300px] h-[400px] rounded-lg transition-transform duration-300 ease-out"
            style={{
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              transitionProperty: 'opacity, transform',
            }}
          />
        )}
      </div>
    );
  }
);

Component.displayName = 'Component';

export { Component as ImageReveal };
export default Component;
