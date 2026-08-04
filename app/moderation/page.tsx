import type { Metadata } from "next";
import { CheckCircle2, CircleSlash, Flag, ListChecks, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Модерація",
  description: "Черга модерації порталу Де Тернопіль.",
  robots: { index: false, follow: false },
};

const queue = [
  {
    type: "Оголошення",
    title: "Ноутбук для навчання",
    status: "pending",
    reason: "Перевірити фото",
  },
  { type: "Відгук", title: "Відгук до Старий Млин", status: "pending", reason: "Перевірити текст" },
  {
    type: "Зміна закладу",
    title: "Новий графік роботи",
    status: "pending",
    reason: "Зміна власника",
  },
  { type: "Скарга", title: "Порушення в оголошенні", status: "urgent", reason: "Ймовірний спам" },
];

export default function ModerationPage() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Badge variant="warning">Moderator</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-5xl">Черга модерації</h1>
      <p className="mt-4 max-w-3xl text-base leading-8 text-muted">
        Модератори перевіряють оголошення, відгуки, скарги й зміни закладів, додають причину
        відхилення, коментар і запис у журнал змін.
      </p>
      <div className="mt-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-3">
          <div className="rounded-lg border border-border bg-surface p-5">
            <ListChecks aria-hidden size={24} className="text-primary" />
            <div className="mt-3 text-2xl font-semibold">4</div>
            <p className="text-sm text-muted">активні елементи в черзі</p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <ShieldAlert aria-hidden size={24} className="text-accent-strong" />
            <div className="mt-3 text-2xl font-semibold">1</div>
            <p className="text-sm text-muted">термінова скарга</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          {queue.map((item) => (
            <div
              key={`${item.type}-${item.title}`}
              className="border-b border-border p-4 last:border-b-0"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-semibold text-primary">{item.type}</div>
                  <h2 className="mt-1 font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-muted">{item.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex min-h-10 items-center gap-2 rounded-md border border-primary bg-primary px-3 text-sm font-semibold text-white">
                    <CheckCircle2 aria-hidden size={17} />
                    Схвалити
                  </button>
                  <button className="inline-flex min-h-10 items-center gap-2 rounded-md border border-accent bg-accent-soft px-3 text-sm font-semibold text-accent-strong">
                    <CircleSlash aria-hidden size={17} />
                    Відхилити
                  </button>
                  <button
                    aria-label="Скарга"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
                  >
                    <Flag aria-hidden size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
