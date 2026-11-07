"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

export interface NavBarProps {
  items: NavItem[]
  className?: string
  defaultActive?: string
  onChange?: (name: string) => void
}

export function NavBar({ items, className, defaultActive, onChange }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(defaultActive || items[0]?.name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 sm:gap-2 bg-[#0a1d40]/80 border border-sky/30 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(58,160,219,0.2)] ring-1 ring-white/10">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <a
              key={item.name}
              href={item.url}
              onClick={(e) => {
                setActiveTab(item.name)
                onChange?.(item.name)
              }}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2 rounded-full transition-colors select-none",
                "text-white/75 hover:text-white",
                isActive && "text-white",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden flex items-center justify-center">
                <Icon size={18} strokeWidth={2.2} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-sky/15 rounded-full -z-10 border border-sky/40"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-sky rounded-t-full shadow-[0_0_12px_#3aa0db]">
                    <div className="absolute w-12 h-6 bg-sky/30 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-sky/35 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-sky/40 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default NavBar

