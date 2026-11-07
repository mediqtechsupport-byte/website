"use client"

import * as React from "react"
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface MenuItem {
  riveIcon?: {
    src: string
    stateMachine: string
  }
  icon?: React.ReactNode
  label: string
  hotkey: string
  onClick?: () => void
}

export interface AnimatedMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MenuItem[]
  menuWidth?: number | string
}

function RiveIcon({ 
  src, 
  stateMachine,
  index,
  activeIndex
}: { 
  src: string
  stateMachine: string
  index: number
  activeIndex: number | null
}) {
  const { RiveComponent, rive } = useRive({
    src,
    stateMachines: stateMachine,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center
    }),
    autoplay: false
  })

  React.useEffect(() => {
    if (!rive) return

    if (activeIndex === index) {
      rive.play(stateMachine)
    } else {
      rive.reset()
    }
  }, [activeIndex, index, rive, stateMachine])

  return <RiveComponent className="size-5 shrink-0" />
}

export function AnimatedMenu({ items, className, menuWidth = 240, ...props }: AnimatedMenuProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  return (
    <div 
      className={cn(
        // Exact MediQ brand palette: Deep MedTech Blue (#0a1d40 / #091b3a) with luminous sky bevel
        "relative bg-[#091b3a]/96 backdrop-blur-2xl shadow-[0_20px_48px_rgba(0,0,0,0.85)] rounded-2xl p-1.5 border border-sky/30 ring-1 ring-white/10",
        "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/10 after:to-transparent",
        "after:rounded-2xl after:border after:border-transparent after:pointer-events-none",
        className
      )}
      style={{ width: typeof menuWidth === "number" ? `${menuWidth}px` : menuWidth }}
      {...props}
    >
      <menu className="relative space-y-0.5">
        {items.map((item, index) => (
          <li key={index} className="relative z-10">
            <button
              type="button"
              className={cn(
                "h-[38px] rounded-xl flex gap-2.5 w-full items-center px-3 py-1.5",
                "text-[13px] font-medium text-[#f6f2ea]/85 transition-colors duration-150",
                "hover:text-white",
                "focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-[#3aa0db]",
                "relative z-10 select-none cursor-pointer",
                "active:scale-[0.985] active:bg-[#0c2246]"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={item.onClick}
            >
              {item.riveIcon ? (
                <RiveIcon 
                  src={item.riveIcon.src} 
                  stateMachine={item.riveIcon.stateMachine}
                  index={index}
                  activeIndex={hoveredIndex}
                />
              ) : item.icon ? (
                <span className="flex size-5 shrink-0 items-center justify-center text-sky transition-colors">
                  {item.icon}
                </span>
              ) : null}
              
              <span className="truncate">{item.label}</span>
              
              {item.hotkey && (
                <span className="ml-auto font-mono text-[11px] text-sky/60 font-medium">
                  <span className="sr-only">Hotkey: </span>
                  {item.hotkey}
                </span>
              )}
            </button>
          </li>
        ))}
        
        {/* Smooth floating hover pill in MediQ Royal Navy (#132c58) with Sky border */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-[38px] bg-[#132c58] border border-sky/40 rounded-xl shadow-[0_0_16px_rgba(58,160,219,0.22)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: hoveredIndex !== null ? 1 : 0,
            scale: hoveredIndex !== null ? 1 : 0.8,
            top: hoveredIndex !== null ? hoveredIndex * 40 : 0,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
      </menu>
    </div>
  )
}

export default AnimatedMenu

