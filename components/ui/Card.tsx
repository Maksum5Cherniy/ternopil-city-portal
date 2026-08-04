import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-[var(--shadow)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
