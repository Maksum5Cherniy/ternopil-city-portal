"use client";

import { Send, Star } from "lucide-react";
import { useState } from "react";

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

export default function ReviewForm({
  targetHref,
  targetTitle,
}: {
  targetHref: string;
  targetTitle: string;
}) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = async () => {
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetHref, targetTitle, rating, text }),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Не вдалося надіслати відгук."));
      }

      setText("");
      setRating(5);
      setMessage("Відгук надіслано на модерацію.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося надіслати відгук.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-warning-soft text-accent-strong">
          <Star aria-hidden size={20} />
        </span>
        <div>
          <h2 className="text-xl font-semibold">Залишити відгук</h2>
          <p className="mt-1 text-sm text-muted">Публікація відбудеться після модерації.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Оцінка</span>
          <select
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
            className="min-h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} з 5
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Текст відгуку</span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={5}
            placeholder="Опишіть досвід, сервіс або корисні деталі для інших відвідувачів."
            className="rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary"
          />
        </label>
      </div>

      {message ? (
        <p
          className={`mt-4 rounded-md border px-3 py-2 text-sm ${
            isError
              ? "border-accent/40 bg-accent-soft text-accent-strong"
              : "border-primary/30 bg-primary-soft text-primary-strong"
          }`}
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}

      <button
        type="button"
        disabled={isSubmitting}
        onClick={submitReview}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
      >
        <Send aria-hidden size={17} />
        <span>{isSubmitting ? "Надсилання..." : "Надіслати відгук"}</span>
      </button>
    </div>
  );
}
