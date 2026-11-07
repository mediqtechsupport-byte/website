declare namespace React {
  export type ReactNode = any
  export type ReactElement = any
  export type Key = string | number
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null

  export interface RefObject<T> {
    current: T | null
  }

  export interface CSSProperties {
    [key: string]: any
  }

  export interface MouseEvent<T = any> {
    clientX: number
    clientY: number
    target: any
    currentTarget: T
    preventDefault(): void
    stopPropagation(): void
  }

  export interface KeyboardEvent<T = any> {
    key: string
    target: any
    currentTarget: T
    metaKey: boolean
    ctrlKey: boolean
    altKey: boolean
    shiftKey: boolean
    preventDefault(): void
    stopPropagation(): void
  }

  export interface PointerEvent<T = any> {
    clientX: number
    clientY: number
    target: any
    currentTarget: T
    preventDefault(): void
  }

  export interface ChangeEvent<T = any> {
    target: T & { value: string }
    currentTarget: T & { value: string }
  }

  export type HTMLAttributes<T = any> = {
    children?: ReactNode
    className?: string
    id?: string
    style?: CSSProperties
    tabIndex?: number
    role?: string
    title?: string
    key?: Key
    ref?: any
    onClick?: (event: any) => any
    onFocus?: (event: any) => any
    onMouseMove?: (event: any) => any
    onMouseEnter?: (event: any) => any
    onMouseLeave?: (event: any) => any
    onKeyDown?: (event: any) => any
    onPointerMove?: (event: any) => any
    onPointerLeave?: (event: any) => any
    onChange?: (event: any) => any
    [key: string]: any
  }

  export type ComponentProps<T extends string = string> = HTMLAttributes<any>

  export function useRef<T = any>(initialValue?: T | null): RefObject<T>
  export function useState<T = any>(initialState: T | (() => T)): [T, (value: any) => void]
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void

  export namespace JSX {
    type Element = any
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

declare module 'react' {
  export = React
}

declare module 'react/jsx-runtime' {
  export namespace JSX {
    type Element = any
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
  export function jsx(type: any, props: any, key?: any): any
  export function jsxs(type: any, props: any, key?: any): any
  export const Fragment: any
}

declare namespace JSX {
  type Element = any
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare module '@solar-icons/react/linear/maximize' {
  export const MaximizeIcon: (props: { className?: string;[key: string]: any }) => any
}
declare module '@solar-icons/react/linear/pause' {
  export const PauseIcon: (props: { className?: string;[key: string]: any }) => any
}
declare module '@solar-icons/react/linear/play' {
  export const PlayIcon: (props: { className?: string;[key: string]: any }) => any
}
declare module '@solar-icons/react/linear/rewind-10-seconds-back' {
  export const Rewind10SecondsBackIcon: (props: { className?: string;[key: string]: any }) => any
}
declare module '@solar-icons/react/linear/rewind-10-seconds-forward' {
  export const Rewind10SecondsForwardIcon: (props: { className?: string;[key: string]: any }) => any
}
declare module '@solar-icons/react/linear/volume-loud' {
  export const VolumeLoudIcon: (props: { className?: string;[key: string]: any }) => any
}
declare module '@solar-icons/react/linear/volume-cross' {
  export const VolumeCrossIcon: (props: { className?: string;[key: string]: any }) => any
}

declare module 'motion/react' {
  export const AnimatePresence: (props: { children?: any; initial?: boolean; mode?: string }) => any
  export const MotionConfig: (props: { children?: any; reducedMotion?: string }) => any
  export const motion: {
    [key: string]: (props: { children?: any; className?: string;[key: string]: any }) => any
  }
}

declare module '@radix-ui/react-slot' {
  export const Slot: any
  export const Slottable: any
}

declare module 'class-variance-authority' {
  export type VariantProps<T extends (...args: any) => any> = any
  export function cva(base?: any, config?: any): (...args: any) => string
}
