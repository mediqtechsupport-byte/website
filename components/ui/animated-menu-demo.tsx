"use client"

import * as React from "react"
import { AnimatedMenu, type MenuItem } from "@/components/ui/animated-menu"

export function AnimatedMenuDemo() {
  const mediqMenuItems: MenuItem[] = [
    {
      label: "Company Overview",
      hotkey: "⌘1",
      onClick: () => console.log("Company Overview clicked"),
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="16" height="20" x="4" y="2" rx="2" />
          <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
        </svg>
      )
    },
    {
      label: "Mission & Vision",
      hotkey: "⌘2",
      onClick: () => console.log("Mission & Vision clicked"),
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m4 15 8-8 8 8M12 7v14M4 21h16" />
        </svg>
      )
    },
    {
      label: "Management",
      hotkey: "⌘3",
      onClick: () => console.log("Management clicked"),
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      label: "Quality & Compliance",
      hotkey: "⌘4",
      onClick: () => console.log("Quality & Compliance clicked"),
      icon: (
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
  ]

  return (
    <div className="flex min-h-[300px] w-full items-center justify-center bg-[#0a1d40] p-8">
      <AnimatedMenu items={mediqMenuItems} menuWidth={250} />
    </div>
  )
}

export default AnimatedMenuDemo

