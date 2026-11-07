import React from "react"
import { Home, Building2, Package, Handshake, Cog, BookOpen, Calendar, Mail } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: "Home", url: "#top", icon: Home },
    { name: "About MEDIQ", url: "#about", icon: Building2 },
    { name: "Products", url: "#products", icon: Package },
    { name: "Brands", url: "#about", icon: Handshake },
    { name: "Services", url: "#distribution", icon: Cog },
    { name: "Resources", url: "#resources", icon: BookOpen },
    { name: "News", url: "#activities", icon: Calendar },
    { name: "Contact", url: "#contact", icon: Mail },
  ]

  return (
    <div className="relative min-h-[200px] w-full bg-[#0a1d40] p-8">
      <NavBar items={navItems} />
    </div>
  )
}

export default NavBarDemo

