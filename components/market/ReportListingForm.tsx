"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Flag } from "lucide-react";
import { reportCreateSchema } from "@/schemas/report";

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

export default function ReportListingForm({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const parsed = reportCreateSchema.safeParse({
      entityType: "listing",
      entityId: listingId,
      reason,
    });

    if (!parsed.success) {
      setIsError(true);
      setMessage(parsed.error.issues[0]?.message || "Перевірте текст скарги.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Не вдалося надіслати скаргу."));
      }

      setReason("");
      setMessage("Скаргу передано модераторам.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося надіслати скаргу.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submitReport}
      className="mt-6 rounded-lg border border-border bg-surface p-5"
      noValidate
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-accent-soft text-accent-strong">
          <Flag aria-hidden size={19} />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Поскаржитися на оголошення</h2>
          <p className="mt-1 text-sm leading-6 text-muted">{listingTitle}</p>
        </div>
      </div>

      <label htmlFor="listing-report-reason" className="mt-4 block text-sm font-semibold">
        Причина скарги
      </label>
      <textarea
        id="listing-report-reason"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary"
        placeholder="Опишіть порушення, підозрілу ціну, шахрайство або некоректний вміст"
      />

      {message ? (
        <p
          className={`mt-3 rounded-md border px-3 py-2 text-sm ${
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
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-accent bg-accent px-4 text-sm font-semibold text-[#0D1B3D] transition hover:bg-[#f1ae16] disabled:opacity-60"
      >
        <Flag aria-hidden size={17} />
        <span>{submitting ? "Надсилання..." : "Надіслати скаргу"}</span>
      </button>
    </form>
  );
}
