import * as React from "react";
import { cn } from "@/lib/utils";

export function Empty({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-border/70 bg-card/40 flex flex-col items-center justify-center rounded-[var(--radius,1.25rem)] border border-dashed px-6 py-10 text-center",
        className,
      )}
    >
      <p className="text-foreground text-sm font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground mt-1 text-xs">{description}</p>
      )}
    </div>
  );
}
