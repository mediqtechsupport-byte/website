import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface McpInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  clearable?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, McpInputProps>(
  ({ className, size = "md", icon, clearable, value, onChange, ...props }, ref) => {
    const hasValue = typeof value === "string" && value.length > 0;
    const heightCls =
      size === "sm" ? "h-9 text-xs" : size === "lg" ? "h-11 text-base" : "h-10 text-sm";

    return (
      <div className="relative flex w-full items-center">
        {icon && (
          <span
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute left-3 flex items-center [&>svg]:size-3.5"
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            "border-border bg-background/70 text-foreground placeholder:text-muted-foreground flex w-full rounded-[var(--radius-control-sm,16px)] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            heightCls,
            icon ? "pl-9" : "pl-3",
            clearable && hasValue ? "pr-8" : "pr-3",
            className,
          )}
          {...props}
        />
        {clearable && hasValue && (
          <button
            type="button"
            aria-label="Clear filter"
            onClick={() => {
              onChange?.({
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>);
            }}
            className="text-muted-foreground hover:text-foreground absolute right-2.5 flex size-5 items-center justify-center rounded-full transition-colors"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "McpInput";
