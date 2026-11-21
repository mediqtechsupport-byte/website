"use client";

import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuLink,
  MotionNavigationMenuList,
  MotionNavigationMenuTrigger,
} from "@/components/ui/motion-navigation-menu";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Download,
  FileText,
  Globe,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Layers,
  type LucideIcon,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

interface MotionNavigationMenuDemoProps {
  viewport?: boolean;
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
}

const ABOUT_ITEMS: { title: string; desc: string; href: string; slide: number; icon: LucideIcon }[] = [
  {
    title: "Who We Are",
    desc: "Philippine specialty pharma leadership.",
    href: "#about",
    slide: 1,
    icon: Users,
  },
  {
    title: "What We Do",
    desc: "Regulatory, sales, and cold-chain reach.",
    href: "#about",
    slide: 2,
    icon: Briefcase,
  },
  {
    title: "Foundation",
    desc: "Exclusive Rayner UK strategic alliance.",
    href: "#about",
    slide: 3,
    icon: Landmark,
  },
  {
    title: "Values",
    desc: "Clinical integrity and patient safety.",
    href: "#about",
    slide: 4,
    icon: ShieldCheck,
  },
];

const PRODUCT_ITEMS: { title: string; desc: string; href: string; slide: number }[] = [
  {
    title: "Ophthalmology · IOLs",
    desc: "Galaxy Spiral, EMV, Trifocal & Sulcoflex.",
    href: "#products",
    slide: 1,
  },
  {
    title: "OVDs & Solutions",
    desc: "Ophteis viscoelastics & AEON drops.",
    href: "#products",
    slide: 2,
  },
  {
    title: "Future Portfolio",
    desc: "Complementary surgical & diagnostic care.",
    href: "#products",
    slide: 3,
  },
  {
    title: "Product Catalogs",
    desc: "Full 2026 brochures & lens specifications.",
    href: "#products",
    slide: 4,
  },
];

const SERVICES_ITEMS: { title: string; desc: string; target: string; icon: LucideIcon }[] = [
  {
    title: "Importation & Distribution",
    desc: "FDA-compliant national supply to hospitals.",
    target: "services:1",
    icon: Truck,
  },
  {
    title: "Product Marketing",
    desc: "Clinical positioning & specialty awareness.",
    target: "services:2",
    icon: Layers,
  },
  {
    title: "Sales & Commercialization",
    desc: "Dedicated surgical & hospital coverage.",
    target: "services:3",
    icon: TrendingUp,
  },
  {
    title: "Market Development",
    desc: "Regional clinic expansion nationwide.",
    target: "services:4",
    icon: Globe,
  },
  {
    title: "Professional Education",
    desc: "Surgeon workshops, symposia & wet-labs.",
    target: "services:5",
    icon: GraduationCap,
  },
  {
    title: "Quality & Customer Support",
    desc: "Responsive clinical coordination & care.",
    target: "services:6",
    icon: HeartHandshake,
  },
];

const RESOURCES_ITEMS: { title: string; desc: string; target: string; icon: LucideIcon }[] = [
  {
    title: "Product-Approved Literature",
    desc: "Clinical dossiers & DFU references.",
    target: "resources:1",
    icon: FileText,
  },
  {
    title: "Professional Education",
    desc: "Ophthalmic training materials & guides.",
    target: "resources:2",
    icon: BookOpen,
  },
  {
    title: "Official Regulatory Guidance",
    desc: "Compliance & Philippine FDA filings.",
    target: "resources:4",
    icon: ShieldCheck,
  },
];

const highlightClassName = "bg-[#72c5f8]/15 rounded-lg";

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
        viewportClassName="bg-[#07142c]/95 border border-[#72c5f8]/20 rounded-xl shadow-[0_22px_54px_rgba(2,8,22,0.62)] text-[#f6f2ea]"
        springBounce={springBounce}
        springStiffness={springStiffness}
        springDamping={springDamping}
      >
        <MotionNavigationMenuList highlightClassName="bg-[#72c5f8]/15 rounded-lg">
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
                  className="min-h-44 justify-between rounded-lg bg-[#0d2248]/70 p-4 border border-white/10"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg border border-[#72c5f8]/25 bg-[#0a1d40]">
                      <Building2 className="size-4 text-[#72c5f8]" />
                    </span>
                    <img
                      src="assets/img/mediq-logo-white.png"
                      alt="MEDIQ Pharma"
                      className="h-5 w-auto object-contain opacity-90"
                    />
                  </span>
                  <span className="space-y-1">
                    <span className="block text-sm font-semibold text-white">
                      About MEDIQ Pharma
                    </span>
                    <span className="block text-xs text-[#9eb4cc]">
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
                        <span className="flex items-center gap-1.5">
                          <item.icon className="size-3.5 text-[#72c5f8]" />
                          {item.title}
                        </span>
                        <ArrowUpRight className="size-3 text-[#72c5f8]" />
                      </span>
                      <span className="text-xs text-[#9eb4cc]">{item.desc}</span>
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
                  className="min-h-44 justify-between rounded-lg bg-[#0d2248]/70 p-4 border border-white/10"
                >
                  <div className="flex items-center justify-center rounded-lg bg-[#08152e]/80 p-2 border border-white/10">
                    <img
                      src="assets/img/packshots/galaxy_carton.png?v=2"
                      alt="RayOne Galaxy Spiral IOL"
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <span className="space-y-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <Sparkles className="size-3.5 text-[#72c5f8]" />
                      RayOne Galaxy Spiral IOL
                    </span>
                    <span className="block text-xs text-[#9eb4cc]">
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
                        <ArrowUpRight className="size-3 text-[#72c5f8]" />
                      </span>
                      <span className="text-xs text-[#9eb4cc]">{product.desc}</span>
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
                  className="min-h-44 justify-between rounded-lg bg-[#0d2248]/70 p-4 border border-white/10"
                >
                  <div className="flex h-16 items-center justify-center rounded-lg border border-white/10 bg-[#08152e]/80 px-3">
                    <img
                      src="assets/img/rayner-logo-white.png"
                      alt="Rayner UK"
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                  <span className="space-y-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <Award className="size-3.5 text-[#72c5f8]" />
                      Exclusive Rayner Partner
                    </span>
                    <span className="block text-xs text-[#9eb4cc]">
                      Authorized Philippine distributor for British ophthalmic innovation.
                    </span>
                  </span>
                </MotionNavigationMenuLink>
                <div className="space-y-0.5">
                  <MotionNavigationMenuLink href="#brands" data-deck-target="brands:1">
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                      Principal Brands
                      <ArrowUpRight className="size-3 text-[#72c5f8]" />
                    </span>
                    <span className="text-xs text-[#9eb4cc]">
                      Global ophthalmic &amp; surgical principals.
                    </span>
                  </MotionNavigationMenuLink>
                  <MotionNavigationMenuLink href="#brands" data-deck-target="brands:2">
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                      Brand Profiles
                      <ArrowUpRight className="size-3 text-[#72c5f8]" />
                    </span>
                    <span className="text-xs text-[#9eb4cc]">
                      Portfolio alignment &amp; manufacturer history.
                    </span>
                  </MotionNavigationMenuLink>
                  <MotionNavigationMenuLink
                    href="assets/brochure/RayOne-EMV-Platform-Brochure-2024_2.2.pdf"
                    download="RayOne EMV Platform Brochure 2024_2.2.pdf"
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                      <span className="flex items-center gap-1.5">
                        <Download className="size-3.5 text-[#72c5f8]" />
                        Downloadable Brochures
                      </span>
                      <ArrowUpRight className="size-3 text-[#72c5f8]" />
                    </span>
                    <span className="text-xs text-[#9eb4cc]">
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
                <div className="px-2 py-1.5 text-xs font-medium text-[#72c5f8]">
                  Built for Philippine healthcare institutions
                </div>
                {SERVICES_ITEMS.map((service) => (
                  <MotionNavigationMenuLink
                    key={service.title}
                    href="#distribution"
                    data-deck-target={service.target}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                      <service.icon className="size-4 text-[#72c5f8]" />
                    </span>
                    <span className="space-y-0.5">
                      <span className="block text-sm font-medium text-white">
                        {service.title}
                      </span>
                      <span className="block text-xs text-[#9eb4cc]">{service.desc}</span>
                    </span>
                    <span className="rounded-lg px-2 py-0.5 text-xs text-[#72c5f8] border border-[#72c5f8]/25">
                      View
                    </span>
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
                      <span className="flex items-center gap-2 text-sm font-medium text-white">
                        <res.icon className="size-3.5 text-[#72c5f8]" />
                        {res.title}
                      </span>
                      <span className="text-xs text-[#9eb4cc]">{res.desc}</span>
                    </MotionNavigationMenuLink>
                  ))}
                </div>
                <MotionNavigationMenuLink
                  href="#resources"
                  data-deck-target="resources:3"
                  className="min-h-44 justify-between rounded-lg bg-[#0d2248]/70 p-4 border border-white/10"
                >
                  <div className="overflow-hidden rounded-md border border-white/10 h-20 w-full">
                    <img
                      src="assets/img/rayone-emv-brochure.jpg"
                      alt="2026 Corporate Profile & Clinical Brochure"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="space-y-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <Sparkles className="size-3.5 text-[#72c5f8]" />
                      2026 Corporate Profile
                    </span>
                    <span className="block text-xs text-[#9eb4cc]">
                      Company credentials, principals, and institutional overview.
                    </span>
                  </span>
                  <span className="text-xs font-medium text-[#72c5f8]">
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
