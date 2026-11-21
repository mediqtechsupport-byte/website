"use client";

import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuLink,
  MotionNavigationMenuList,
  MotionNavigationMenuTrigger,
} from "@/components/ui/motion-navigation-menu";
import { ArrowUpRight } from "lucide-react";

interface MotionNavigationMenuDemoProps {
  viewport?: boolean;
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
}

const ABOUT_ITEMS = [
  {
    title: "Who We Are",
    desc: "Philippine specialty pharma leadership.",
    href: "#about",
    slide: 1,
  },
  {
    title: "What We Do",
    desc: "Regulatory, sales & cold-chain reach.",
    href: "#about",
    slide: 2,
  },
  {
    title: "Foundation",
    desc: "Exclusive Rayner UK strategic alliance.",
    href: "#about",
    slide: 3,
  },
  {
    title: "Values",
    desc: "Clinical integrity & patient safety.",
    href: "#about",
    slide: 4,
  },
];

const PRODUCT_ITEMS = [
  {
    title: "Ophthalmology · IOLs",
    desc: "Galaxy Spiral, EMV, Trifocal & Sulcoflex.",
    href: "#products",
    slide: 1,
  },
  {
    title: "Ophthalmic OVDs & Solutions",
    desc: "Ophteis viscoelastics & AEON drops.",
    href: "#products",
    slide: 2,
  },
  {
    title: "Future Portfolio Development",
    desc: "Complementary surgical & diagnostic care.",
    href: "#products",
    slide: 3,
  },
  {
    title: "Product Catalogs",
    desc: "2026 clinical brochures & specs.",
    href: "#products",
    slide: 4,
  },
];

const SERVICES_ITEMS = [
  { num: "01", title: "Importation & Distribution", desc: "FDA-compliant national supply to hospitals.", target: "services:1" },
  { num: "02", title: "Product Marketing", desc: "Clinical positioning & specialty awareness.", target: "services:2" },
  { num: "03", title: "Sales & Commercialization", desc: "Dedicated surgical & hospital coverage.", target: "services:3" },
  { num: "04", title: "Market Development", desc: "Regional clinic expansion nationwide.", target: "services:4" },
  { num: "05", title: "Professional Education", desc: "Surgeon workshops, symposia & wet-labs.", target: "services:5" },
  { num: "06", title: "Quality & Customer Support", desc: "Responsive clinical coordination & care.", target: "services:6" },
];

const RESOURCES_ITEMS = [
  { title: "Product-Approved Literature", desc: "Clinical dossiers & DFU references.", target: "resources:1" },
  { title: "Professional Education", desc: "Ophthalmic training materials & guides.", target: "resources:2" },
  { title: "Official Regulatory Guidance", desc: "Compliance & Philippine FDA filings.", target: "resources:4" },
];

const highlightClassName = "bg-white/[0.065] rounded-[10px]";

export function MotionNavigationMenuDemo({
  viewport,
  springBounce,
  springStiffness,
  springDamping,
}: MotionNavigationMenuDemoProps) {
  return (
    <div className="flex min-h-full w-full items-center justify-center px-6">
      <MotionNavigationMenu
        viewport={viewport}
        viewportClassName="bg-[#0c1018]/95 border border-white/[0.09] rounded-2xl shadow-[0_28px_64px_rgba(0,0,0,0.68)] text-[#f6f2ea]"
        springBounce={springBounce}
        springStiffness={springStiffness}
        springDamping={springDamping}
      >
        <MotionNavigationMenuList highlightClassName="bg-white/[0.065] rounded-lg">
          <MotionNavigationMenuItem>
            <MotionNavigationMenuLink
              href="#top"
              className="flex h-9 items-center px-3 py-2 text-xs font-semibold tracking-wide text-[#f6f2ea]"
            >
              Home
            </MotionNavigationMenuLink>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem value="about">
            <MotionNavigationMenuTrigger className="px-3 text-xs font-semibold text-[#f6f2ea]">
              About MEDIQ
            </MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent highlightClassName={highlightClassName}>
              <div className="grid w-[500px] grid-cols-[1fr_1.28fr] gap-2">
                <MotionNavigationMenuLink
                  href="#about"
                  data-slide-target="0"
                  className="min-h-44 justify-between rounded-[10px] border border-white/[0.075] bg-gradient-to-b from-white/[0.045] to-white/[0.015] p-4"
                >
                  <span className="block pt-0.5">
                    <img
                      src="assets/img/mediq-logo-white.png"
                      alt="MEDIQ Pharma"
                      className="h-7 w-auto object-contain object-left opacity-95"
                    />
                  </span>
                  <span className="space-y-1">
                    <span className="block text-sm font-semibold text-white">
                      About MEDIQ Pharma
                    </span>
                    <span className="block text-xs text-[#94a3b8]">
                      Connecting global ophthalmic innovation with Philippine surgical centres.
                    </span>
                  </span>
                </MotionNavigationMenuLink>
                <div className="grid grid-cols-2 gap-0.5">
                  {ABOUT_ITEMS.map((item) => (
                    <MotionNavigationMenuLink
                      key={item.title}
                      href={item.href}
                      data-slide-target={item.slide}
                    >
                      <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                        <span>{item.title}</span>
                        <ArrowUpRight className="size-3 text-white/35" />
                      </span>
                      <span className="text-xs text-[#94a3b8]">{item.desc}</span>
                    </MotionNavigationMenuLink>
                  ))}
                </div>
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem value="products">
            <MotionNavigationMenuTrigger className="px-3 text-xs font-semibold text-[#f6f2ea]">
              Products
            </MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent highlightClassName={highlightClassName}>
              <div className="grid w-[540px] grid-cols-[1.05fr_1.3fr] gap-2">
                <MotionNavigationMenuLink
                  href="#products"
                  data-product-slide="1"
                  className="min-h-44 justify-between rounded-[10px] border border-white/[0.075] bg-gradient-to-b from-white/[0.045] to-white/[0.015] p-4"
                >
                  <div className="flex items-center justify-center py-1">
                    <img
                      src="assets/img/packshots/galaxy_carton.png?v=2"
                      alt="RayOne Galaxy Spiral IOL"
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <span className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-white/50">
                      New · 2026
                    </span>
                    <span className="block text-sm font-semibold text-white">
                      RayOne Galaxy Spiral IOL
                    </span>
                    <span className="block text-xs text-[#94a3b8]">
                      Full-range spiral optic engineered with Rayner UK.
                    </span>
                  </span>
                </MotionNavigationMenuLink>
                <div className="grid grid-cols-2 gap-0.5">
                  {PRODUCT_ITEMS.map((product) => (
                    <MotionNavigationMenuLink
                      key={product.title}
                      href={product.href}
                      data-product-slide={product.slide}
                    >
                      <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                        {product.title}
                        <ArrowUpRight className="size-3 text-white/35" />
                      </span>
                      <span className="text-xs text-[#94a3b8]">{product.desc}</span>
                    </MotionNavigationMenuLink>
                  ))}
                </div>
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem value="brands">
            <MotionNavigationMenuTrigger className="px-3 text-xs font-semibold text-[#f6f2ea]">
              Brands &amp; Partners
            </MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent highlightClassName={highlightClassName}>
              <div className="grid w-[470px] grid-cols-[1fr_1.15fr] gap-2">
                <MotionNavigationMenuLink
                  href="#brands"
                  data-deck-target="brands:1"
                  className="min-h-44 justify-between rounded-[10px] border border-white/[0.075] bg-gradient-to-b from-white/[0.045] to-white/[0.015] p-4"
                >
                  <span className="block pt-0.5">
                    <img
                      src="assets/img/rayner-logo-white.png"
                      alt="Rayner UK"
                      className="h-6 w-auto object-contain object-left opacity-95"
                    />
                  </span>
                  <span className="space-y-1">
                    <span className="block text-sm font-semibold text-white">
                      Exclusive Rayner Partner
                    </span>
                    <span className="block text-xs text-[#94a3b8]">
                      Authorized Philippine distributor for British ophthalmic innovation.
                    </span>
                  </span>
                </MotionNavigationMenuLink>
                <div className="space-y-0.5">
                  <MotionNavigationMenuLink href="#brands" data-deck-target="brands:1">
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                      Principal Brands
                      <ArrowUpRight className="size-3 text-white/35" />
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                      Global ophthalmic &amp; surgical principals.
                    </span>
                  </MotionNavigationMenuLink>
                  <MotionNavigationMenuLink href="#brands" data-deck-target="brands:2">
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                      Brand Profiles
                      <ArrowUpRight className="size-3 text-white/35" />
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                      Portfolio alignment &amp; heritage.
                    </span>
                  </MotionNavigationMenuLink>
                  <MotionNavigationMenuLink
                    href="assets/brochure/RayOne-EMV-Platform-Brochure-2024_2.2.pdf"
                    download="RayOne EMV Platform Brochure 2024_2.2.pdf"
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                      Downloadable Brochures
                      <ArrowUpRight className="size-3 text-white/35" />
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                      2026 RayOne EMV Platform PDF.
                    </span>
                  </MotionNavigationMenuLink>
                </div>
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem value="services">
            <MotionNavigationMenuTrigger className="px-3 text-xs font-semibold text-[#f6f2ea]">
              Services
            </MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent highlightClassName={highlightClassName}>
              <div className="w-[430px] space-y-1">
                <div className="px-2.5 py-1.5 text-xs font-medium text-white/45">
                  Built for Philippine healthcare institutions
                </div>
                {SERVICES_ITEMS.map((service) => (
                  <MotionNavigationMenuLink
                    key={service.title}
                    href="#distribution"
                    data-deck-target={service.target}
                    className="grid grid-cols-[24px_1fr_auto] items-center gap-3"
                  >
                    <span className="font-mono text-xs font-medium text-white/40">
                      {service.num}
                    </span>
                    <span className="space-y-0.5">
                      <span className="block text-sm font-medium text-white">
                        {service.title}
                      </span>
                      <span className="block text-xs text-[#94a3b8]">{service.desc}</span>
                    </span>
                    <span className="text-xs text-white/45">View</span>
                  </MotionNavigationMenuLink>
                ))}
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem value="resources">
            <MotionNavigationMenuTrigger className="px-3 text-xs font-semibold text-[#f6f2ea]">
              Resources
            </MotionNavigationMenuTrigger>
            <MotionNavigationMenuContent highlightClassName={highlightClassName}>
              <div className="grid w-[510px] grid-cols-2 gap-2">
                <div className="space-y-0.5">
                  {RESOURCES_ITEMS.map((res) => (
                    <MotionNavigationMenuLink
                      key={res.title}
                      href="#resources"
                      data-deck-target={res.target}
                    >
                      <span className="text-sm font-medium text-white">{res.title}</span>
                      <span className="text-xs text-[#94a3b8]">{res.desc}</span>
                    </MotionNavigationMenuLink>
                  ))}
                </div>
                <MotionNavigationMenuLink
                  href="#resources"
                  data-deck-target="resources:3"
                  className="min-h-44 justify-between rounded-[10px] border border-white/[0.075] bg-gradient-to-b from-white/[0.045] to-white/[0.015] p-4"
                >
                  <div className="h-20 w-full overflow-hidden rounded-md border border-white/10">
                    <img
                      src="assets/img/rayone-emv-brochure.jpg"
                      alt="2026 Corporate Profile & Clinical Brochure"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="space-y-1">
                    <span className="block text-sm font-semibold text-white">
                      2026 Corporate Profile
                    </span>
                    <span className="block text-xs text-[#94a3b8]">
                      Company credentials, principals, and institutional overview.
                    </span>
                  </span>
                  <span className="text-xs font-medium text-white/80">
                    Read profile →
                  </span>
                </MotionNavigationMenuLink>
              </div>
            </MotionNavigationMenuContent>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem>
            <MotionNavigationMenuLink
              href="#activities"
              data-deck-target="news:0"
              className="flex h-9 items-center px-3 py-2 text-xs font-semibold text-[#f6f2ea]"
            >
              News &amp; Events
            </MotionNavigationMenuLink>
          </MotionNavigationMenuItem>

          <MotionNavigationMenuItem>
            <MotionNavigationMenuLink
              href="#contact"
              data-deck-target="contact:0"
              className="flex h-9 items-center px-3 py-2 text-xs font-semibold text-[#f6f2ea]"
            >
              Contact Us
            </MotionNavigationMenuLink>
          </MotionNavigationMenuItem>
        </MotionNavigationMenuList>
      </MotionNavigationMenu>
    </div>
  );
}

export default MotionNavigationMenuDemo;
