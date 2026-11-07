"use client"

import * as React from "react"
import { LiquidNavbar, type LiquidNavItem } from "@/components/ui/liquid-glass-navbar"

const SvgIcon = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const MediqNavIcons = {
  about: (
    <SvgIcon>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </SvgIcon>
  ),
  products: (
    <SvgIcon>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </SvgIcon>
  ),
  simulator: (
    <SvgIcon>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  ),
  delivery3d: (
    <SvgIcon>
      <path d="m18 2 4 4" />
      <path d="m17 7 3-3" />
      <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
      <path d="m9 11 4 4" />
      <path d="m5 19-3 3" />
      <path d="m14 4 6 6" />
    </SvgIcon>
  ),
  distribution: (
    <SvgIcon>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </SvgIcon>
  ),
  contact: (
    <SvgIcon>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </SvgIcon>
  ),
}

export const MEDIQ_NAV_ITEMS: LiquidNavItem[] = [
  { label: "About", href: "#about", icon: MediqNavIcons.about, fx: "glow" },
  { label: "Products", href: "#products", icon: MediqNavIcons.products, fx: "pop" },
  { label: "Vision Simulator", href: "#optical-studio", icon: MediqNavIcons.simulator, fx: "spin" },
  { label: "Delivery 3D", href: "#galaxy-delivery", icon: MediqNavIcons.delivery3d, fx: "drop" },
  { label: "Distribution", href: "#distribution", icon: MediqNavIcons.distribution, fx: "wave" },
  { label: "Contact", href: "#contact", icon: MediqNavIcons.contact, fx: "glow" },
]

export interface MediqNavbarProps {
  active?: number
  tone?: "light" | "dark"
  sound?: boolean
  className?: string
  onChange?: (index: number, item: LiquidNavItem) => void
}

export function MediqNavbar({
  active = 0,
  tone = "light",
  sound = false,
  className,
  onChange,
}: MediqNavbarProps) {
  return (
    <LiquidNavbar
      items={MEDIQ_NAV_ITEMS}
      defaultActive={active}
      tone={tone}
      sound={sound}
      className={className}
      onChange={onChange}
    />
  )
}

export default MediqNavbar
