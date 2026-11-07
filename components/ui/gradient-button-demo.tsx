/// <reference path="./types.d.ts" />
import { GradientButton } from "./gradient-button"

export function Demo() {
  return (
    <div className="flex gap-8 p-8 bg-[#030b17] items-center justify-center min-h-[200px]">
      <GradientButton>Get Started</GradientButton>
      <GradientButton variant="variant">Get Started</GradientButton>
    </div>
  )
}

export default Demo
