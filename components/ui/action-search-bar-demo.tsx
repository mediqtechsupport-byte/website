"use client";

import { ActionSearchBar, defaultMediqActions } from "@/components/ui/action-search-bar";

export function ActionSearchBarDemo() {
  return (
    <div className="flex min-h-[420px] w-full flex-col items-center justify-start bg-[#061229] p-6 pt-12 text-[#f6f2ea]">
      <div className="mb-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
          21st.dev · Action Search Bar Navigation
        </p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-white">
          MEDIQ Sitewide Command Search
        </h2>
      </div>
      <ActionSearchBar actions={defaultMediqActions} />
    </div>
  );
}

export default ActionSearchBarDemo;
