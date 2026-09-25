import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { HomeCard } from "@/types";

export function ModulePage({
  eyebrow,
  title,
  description,
  items,
  emptyText = "У цьому розділі поки немає опублікованих матеріалів.",
  headingLevel = "h1",
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: HomeCard[];
  emptyText?: string;
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="max-w-3xl">
        <Badge variant="primary">{eyebrow}</Badge>
        <Heading className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">
          {title}
        </Heading>
        <p className="mt-4 text-base leading-8 text-muted sm:text-lg">
          {description}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-border bg-surface p-5 transition hover:border-primary hover:shadow-[var(--shadow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <div className="flex flex-wrap items-center gap-2">
                {item.badge ? (
                  <Badge variant="accent">{item.badge}</Badge>
                ) : null}
                {item.meta ? (
                  <span className="text-xs font-semibold text-muted">
                    {item.meta}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-lg font-semibold group-hover:text-primary">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Детальніше
                <ArrowRight aria-hidden size={16} />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-surface-subtle p-8 text-center">
          <Search aria-hidden size={28} className="mx-auto text-muted" />
          <p className="mt-3 text-sm text-muted">{emptyText}</p>
        </div>
      )}
    </section>
  );
}
