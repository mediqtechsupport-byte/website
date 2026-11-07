"use client"

import * as React from "react"
import PigmentExperienceLedger from "@/components/ui/pigment-experience-ledger"

export default function PigmentExperienceLedgerDemo() {
  return (
    <div className="w-full bg-[#0a1d40] min-h-screen text-[#f6f2ea]">
      <PigmentExperienceLedger
        heading="About MEDIQ"
        intro="Philippine partner for Rayner ophthalmic and surgical optical solutions."
        palette="mediq"
        background="#0a1d40"
        ink="#f6f2ea"
      />
    </div>
  )
}

