import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary: "border-primary bg-primary text-white hover:bg-primary-strong",
  secondary: "border-border bg-surface text-foreground hover:border-primary hover:text-primary",
  subtle: "border-transparent bg-surface-subtle text-foreground hover:bg-surface-strong",
  accent: "border-accent bg-accent text-[#0D1B3D] hover:bg-[#f1ae16]",
} as const;

const buttonSizes = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
} as const;

type SharedButtonProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: SharedButtonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className,
  children,
}: SharedButtonProps & { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
    >
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </Link>
  );
}
