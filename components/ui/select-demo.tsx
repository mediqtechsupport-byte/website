import React from "react"
import Select, { TSelectData } from "@/components/ui/select"

const data: TSelectData[] = [
  {
    id: "1",
    label: "Intraocular Lenses",
    value: "iols",
    description: "RayOne Galaxy AI spiral monofocal & full range acuity",
    icon: "👁️",
  },
  {
    id: "2",
    label: "Medical Supplies",
    value: "supplies",
    description: "Surgical packs, viscoelastic solutions & ophthalmic blades",
    icon: "🩹",
  },
  {
    id: "3",
    label: "Devices & Equipment",
    value: "devices",
    description: "RayOne preloaded injector delivery & micro-incision biometry",
    icon: "🔬",
  },
  {
    id: "4",
    label: "Product Catalogs",
    value: "catalogs",
    description: "Download verified Philippine FDA monographs and clinical docs",
    icon: "📖",
  },
]

export function DropdownDemo() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0a1d40]">
      <Select data={data} defaultValue="iols" />
    </div>
  )
}

export default DropdownDemo

