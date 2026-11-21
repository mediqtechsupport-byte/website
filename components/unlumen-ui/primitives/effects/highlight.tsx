"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type RectBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type HighlightContextValue = {
  mode: "children" | "parent";
  hover: boolean;
  controlledItems: boolean;
  className?: string;
  style?: React.CSSProperties;
  transition: Transition;
  activeBounds: RectBounds | null;
  setActiveElement: (el: HTMLElement | null) => void;
};

const HighlightContext = React.createContext<HighlightContextValue | null>(null);

const DEFAULT_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  bounce: 0,
};

type HighlightProps = {
  children: React.ReactNode;
  mode?: "children" | "parent";
  controlledItems?: boolean;
  hover?: boolean;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  transition?: Transition;
};

function Highlight({
  children,
  mode = "parent",
  controlledItems = false,
  hover = true,
  className,
  containerClassName,
  style,
  transition = DEFAULT_SPRING,
}: HighlightProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeBounds, setActiveBounds] = React.useState<RectBounds | null>(null);

  const setActiveElement = React.useCallback((el: HTMLElement | null) => {
    const container = containerRef.current;
    if (!el || !container) {
      setActiveBounds(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    setActiveBounds({
      top: itemRect.top - containerRect.top,
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
      height: itemRect.height,
    });
  }, []);

  const contextValue = React.useMemo(
    () => ({
      mode,
      hover,
      controlledItems,
      className,
      style,
      transition,
      activeBounds,
      setActiveElement,
    }),
    [activeBounds, className, controlledItems, hover, mode, setActiveElement, style, transition],
  );

  return (
    <HighlightContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative", containerClassName)}
        onPointerLeave={() => {
          if (hover) {
            setActiveBounds(null);
          }
        }}
      >
        {mode === "parent" && (
          <AnimatePresence>
            {activeBounds && (
              <motion.div
                aria-hidden="true"
                initial={{
                  opacity: 0,
                  top: activeBounds.top,
                  left: activeBounds.left,
                  width: activeBounds.width,
                  height: activeBounds.height,
                }}
                animate={{
                  opacity: 1,
                  top: activeBounds.top,
                  left: activeBounds.left,
                  width: activeBounds.width,
                  height: activeBounds.height,
                }}
                exit={{ opacity: 0 }}
                transition={transition}
                style={{ position: "absolute", pointerEvents: "none", ...style }}
                className={className}
              />
            )}
          </AnimatePresence>
        )}
        {children}
      </div>
    </HighlightContext.Provider>
  );
}

type HighlightItemProps = {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
  asChild?: boolean;
  className?: string;
};

function HighlightItem({ children, asChild = true, className }: HighlightItemProps) {
  const ctx = React.useContext(HighlightContext);

  const handleEnter = (event: React.PointerEvent<HTMLElement>) => {
    children.props.onPointerEnter?.(event);
    if (ctx?.hover) {
      ctx.setActiveElement(event.currentTarget);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    children.props.onFocus?.(event);
    ctx?.setActiveElement(event.currentTarget);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(children.props.className, className),
      onPointerEnter: handleEnter,
      onFocus: handleFocus,
    });
  }

  return (
    <div
      className={cn("relative", className)}
      onPointerEnter={handleEnter}
      onFocus={handleFocus}
    >
      {children}
    </div>
  );
}

export { Highlight, HighlightItem };
