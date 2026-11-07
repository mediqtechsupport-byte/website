import type { BjorkTone } from "./liquid-text-core-palette";

export function useBjorkTone(tone?: BjorkTone): BjorkTone {
  return tone ?? "dark";
}

