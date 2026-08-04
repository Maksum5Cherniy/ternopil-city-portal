import Link from "next/link";
import Logo from "@/components/Logo";
import { uk } from "@/config/dictionaries/uk";
import { SITE } from "@/config/site.config";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-[1180px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">{uk.footer.tagline}</p>
        </div>

        <nav aria-label={uk.footer.sectionsTitle}>
          <h2 className="text-sm font-semibold">{uk.footer.sectionsTitle}</h2>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            {uk.navigation.primary.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav aria-label={uk.footer.legalTitle}>
          <h2 className="text-sm font-semibold">{uk.footer.legalTitle}</h2>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            {uk.footer.legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <nav aria-label={uk.footer.serviceTitle}>
          <h2 className="text-sm font-semibold">{uk.footer.serviceTitle}</h2>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            {uk.footer.serviceLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE.title}
      </div>
    </footer>
  );
}
