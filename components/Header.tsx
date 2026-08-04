"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Plus, Search, ShieldCheck, UserRound, X } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { uk } from "@/config/dictionaries/uk";
import { cn } from "@/lib/utils";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinkClass = (href: string) =>
    cn(
      "relative inline-flex min-h-11 items-center text-sm font-semibold transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
      pathname === href || pathname.startsWith(`${href}/`)
        ? "text-primary after:absolute after:bottom-1 after:left-0 after:h-1 after:w-full after:rounded-full after:bg-accent"
        : "text-muted",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 shadow-[0_10px_30px_rgb(13_27_61/0.06)] backdrop-blur dark:bg-surface/95">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="md:hidden">
            <Logo compact />
          </div>
          <div className="hidden md:block">
            <Logo />
          </div>

          <nav className="hidden items-center gap-5 md:flex">
            {uk.navigation.primary.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/search"
              aria-label={uk.common.search}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-primary transition hover:border-info hover:text-info focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Search aria-hidden size={18} />
            </Link>
            <Link
              href="/admin"
              aria-label={uk.common.admin}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-primary transition hover:border-info hover:text-info focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <ShieldCheck aria-hidden size={18} />
            </Link>
            <Link
              href="/profile"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-primary bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <UserRound aria-hidden size={17} />
              <span>{uk.common.profile}</span>
            </Link>
            <Link
              href="/market/new"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-3 text-sm font-semibold text-[#0D1B3D] transition hover:bg-[#f1ae16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Plus aria-hidden size={17} />
              <span>{uk.common.addListing}</span>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label={open ? uk.common.closeMenu : uk.common.openMenu}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-primary transition hover:border-info hover:text-info focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white md:hidden dark:bg-surface">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-4 py-4">
            {uk.navigation.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-3 text-sm font-semibold transition hover:bg-surface-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  pathname === item.href
                    ? "bg-primary-soft text-primary-strong shadow-[inset_4px_0_0_var(--accent)]"
                    : "text-foreground",
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link
                href="/search"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                <Search aria-hidden size={17} />
                <span>{uk.common.search}</span>
              </Link>
              <Link
                href="/profile"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                <UserRound aria-hidden size={17} />
                <span>{uk.common.profile}</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck aria-hidden size={17} />
                <span>{uk.common.admin}</span>
              </Link>
              <Link
                href="/market/new"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-3 text-sm font-semibold text-[#0D1B3D]"
                onClick={() => setOpen(false)}
              >
                <Plus aria-hidden size={17} />
                <span>{uk.common.addListing}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
