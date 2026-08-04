import { cn } from "@/lib/utils";

const badgeVariants = {
  neutral: "border-border bg-surface-subtle text-muted",
  primary: "border-primary/30 bg-primary-soft text-primary-strong dark:text-white",
  accent: "border-info/30 bg-info-soft text-info",
  warning: "border-accent/40 bg-accent-soft text-accent-strong",
} as const;

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof badgeVariants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
