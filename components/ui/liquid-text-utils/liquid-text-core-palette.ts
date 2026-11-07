export type BjorkTone = "dark" | "light";

export const BJORK_PALETTE: Record<BjorkTone, { text: string; bg: string }> = {
  dark: { text: "#ffffff", bg: "#000000" },
  light: { text: "#000000", bg: "#ffffff" },
};

