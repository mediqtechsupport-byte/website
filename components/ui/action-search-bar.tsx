"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Compass,
  FileText,
  Layers,
  Mail,
  Newspaper,
  Package,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay = 180): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export type SearchActionCategory =
  | "Sections"
  | "About"
  | "Products"
  | "Services"
  | "Brands"
  | "Resources"
  | "News";

export interface SearchAction {
  id: string;
  label: string;
  description?: string;
  category: SearchActionCategory;
  short?: string;
  end?: string;
  keywords?: string[];
  icon?: ReactNode;
  onSelect?: () => void;
}

export interface ActionSearchBarProps {
  actions?: SearchAction[];
  placeholder?: string;
  defaultOpen?: boolean;
  className?: string;
  onActionSelect?: (action: SearchAction) => void;
}

export const defaultMediqActions: SearchAction[] = [
  {
    id: "sec-hero",
    label: "Home · Advanced Intraocular Lens",
    description: "Main landing view & flagship optical overview",
    category: "Sections",
    short: "01",
    end: "Section",
    keywords: ["home", "hero", "start", "top", "mediq"],
    icon: <Compass className="h-4 w-4 text-sky-400" />,
  },
  {
    id: "prod-rayone-emv",
    label: "RayOne EMV (RAO200E)",
    description: "Enhanced monovision IOL up to 1.5 D binocular depth of focus",
    category: "Products",
    short: "EMV",
    end: "Rayner UK",
    keywords: ["emv", "rayone", "monovision", "barrett", "iol", "lens"],
    icon: <Sparkles className="h-4 w-4 text-cyan-400" />,
  },
  {
    id: "prod-rayone-trifocal",
    label: "RayOne Trifocal (RAO603F)",
    description: "89% retinal light utilization 16-step diffractive trifocal IOL",
    category: "Products",
    short: "603F",
    end: "Rayner UK",
    keywords: ["trifocal", "multifocal", "rayone", "presbyopia", "iol"],
    icon: <Package className="h-4 w-4 text-violet-400" />,
  },
  {
    id: "srv-book-01",
    label: "Vol. 01 · Strategic Importation & Distribution",
    description: "Authorized sourcing, customs entry & lot-traceable warehouse dispatch",
    category: "Services",
    short: "Vol 01",
    end: "Book",
    keywords: ["importation", "distribution", "supply chain", "logistics", "book"],
    icon: <BookOpen className="h-4 w-4 text-sky-300" />,
  },
  {
    id: "brands-brochure",
    label: "Interactive RayOne EMV Brochure",
    description: "Open the 12-page digital clinical brochure & biometry guide",
    category: "Brands",
    short: "12p",
    end: "Viewer",
    keywords: ["brochure", "pdf", "rayone", "compendium", "biometry"],
    icon: <FileText className="h-4 w-4 text-amber-300" />,
  },
  {
    id: "news-apvrs",
    label: "APVRS 2025 Manila — Ophthalmic Congress",
    description: "Ophthalmic symposia & surgical booth engagement at SMX Convention Center",
    category: "News",
    short: "#ProfEd",
    end: "Event",
    keywords: ["apvrs", "manila", "smx", "congress", "news", "events"],
    icon: <Newspaper className="h-4 w-4 text-amber-400" />,
  },
  {
    id: "about-foundation",
    label: "Who We Are & Established Foundation",
    description: "MEDIQ Philippines vision, mission & exclusive Rayner UK representation",
    category: "About",
    short: "02",
    end: "About",
    keywords: ["about", "purpose", "mission", "vision", "rayner", "foundation"],
    icon: <Building2 className="h-4 w-4 text-emerald-400" />,
  },
  {
    id: "res-regulatory",
    label: "Official Regulatory Guidance",
    description: "FDA compliance, adverse event channels & distributor governance",
    category: "Resources",
    short: "04",
    end: "Resources",
    keywords: ["fda", "regulatory", "guidance", "compliance", "resources"],
    icon: <Layers className="h-4 w-4 text-sky-400" />,
  },
  {
    id: "sec-contact",
    label: "Contact MEDIQ · Stakeholder & Inquiry Desk",
    description: "Connect for institutional supply, clinical education & partnerships",
    category: "Sections",
    short: "08",
    end: "Contact",
    keywords: ["contact", "email", "inquiry", "hospital", "procurement"],
    icon: <Mail className="h-4 w-4 text-rose-400" />,
  },
];

const listContainerVariants = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.22 },
      opacity: { duration: 0.16 },
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22 },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15 },
  },
};

export function ActionSearchBar({
  actions = defaultMediqActions,
  placeholder = "Search products, services, news, or sections...",
  defaultOpen = false,
  className,
  onActionSelect,
}: ActionSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAction, setSelectedAction] = useState<SearchAction | null>(null);
  const debouncedQuery = useDebounce(query, 150);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((action) => {
      const haystack = [
        action.label,
        action.description || "",
        action.category,
        action.short || "",
        ...(action.keywords || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [actions, debouncedQuery]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsFocused(true);
        setSelectedAction(null);
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const handleSelect = (action: SearchAction) => {
    setSelectedAction(action);
    setQuery("");
    setIsFocused(false);
    action.onSelect?.();
    onActionSelect?.(action);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!filteredActions.length) {
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredActions[activeIndex];
      if (target) handleSelect(target);
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = isFocused && !selectedAction;

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <div className="relative flex items-center rounded-2xl border border-sky-400/25 bg-[#0a1d40]/90 px-4 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all focus-within:border-sky-300/60 focus-within:ring-2 focus-within:ring-sky-400/20">
        <Search className="mr-3 h-4 w-4 shrink-0 text-sky-300" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedAction(null);
            setIsFocused(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setSelectedAction(null);
          }}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 180);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[#f6f2ea] placeholder:text-[#f6f2ea]/45 focus:outline-none"
        />

        <div className="ml-2 flex shrink-0 items-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {query.length > 0 ? (
              <motion.span
                key="send"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.16 }}
                className="flex items-center justify-center rounded-md bg-sky-400/15 p-1 text-sky-300"
              >
                <Send className="h-3.5 w-3.5" />
              </motion.span>
            ) : (
              <motion.kbd
                key="kbd"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-0.5 rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#f6f2ea]/70"
              >
                ⌘K
              </motion.kbd>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-sky-400/20 bg-[#081633]/95 shadow-[0_28px_80px_rgba(0,0,0,0.78)] backdrop-blur-2xl"
          >
            <ul className="max-h-80 overflow-y-auto p-1.5" role="listbox">
              {filteredActions.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-[#f6f2ea]/55">
                  No matching MEDIQ destinations found for &ldquo;{query}&rdquo;.
                </li>
              ) : (
                filteredActions.map((action, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <motion.li
                      key={action.id}
                      variants={listItemVariants}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(action);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors",
                        isActive ? "bg-sky-400/15 text-white" : "text-[#f6f2ea]/85 hover:bg-white/5"
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                          {action.icon ?? <ArrowUpRight className="h-3.5 w-3.5 text-sky-300" />}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate text-xs font-semibold tracking-wide">
                            {action.label}
                          </div>
                          {action.description && (
                            <div className="truncate text-[11px] text-[#f6f2ea]/55">
                              {action.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-3 flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                        {action.short && (
                          <span className="rounded bg-white/5 px-1.5 py-0.5 text-sky-300/90">
                            {action.short}
                          </span>
                        )}
                        <span className="text-[#f6f2ea]/45">{action.end ?? action.category}</span>
                      </div>
                    </motion.li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center justify-between border-t border-white/10 bg-[#051026]/80 px-3.5 py-2 font-mono text-[10px] text-[#f6f2ea]/50">
              <span>Press ↑↓ to navigate · Enter to jump</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
