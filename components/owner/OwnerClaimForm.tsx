"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ownerClaimSchema, type OwnerClaimInput } from "@/schemas/owner";

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

export default function OwnerClaimForm() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OwnerClaimInput>({
    defaultValues: {
      placeName: "",
      businessEmail: "",
      phone: "",
      address: "",
      website: "",
      message: "",
    },
  });

  const onSubmit = async (values: OwnerClaimInput) => {
    setMessage("");
    setIsError(false);

    const parsed = ownerClaimSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          setError(fieldName as keyof OwnerClaimInput, { message: issue.message });
        }
      });

      return;
    }

    try {
      const response = await fetch("/api/owner/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Не вдалося подати заявку."));
      }

      reset();
      setMessage("Заявку відправлено на модерацію.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося подати заявку.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div>
        <label htmlFor="placeName" className="text-sm font-semibold">
          Назва закладу
        </label>
        <input
          id="placeName"
          className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("placeName")}
        />
        {errors.placeName ? (
          <p className="mt-1 text-sm text-accent-strong">{errors.placeName.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          aria-label="Email закладу"
          placeholder="Email закладу"
          className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("businessEmail")}
        />
        <input
          aria-label="Телефон"
          placeholder="Телефон"
          className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("phone")}
        />
      </div>
      <input
        aria-label="Адреса"
        placeholder="Адреса"
        className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
        {...register("address")}
      />
      <input
        aria-label="Сайт"
        placeholder="https://..."
        className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
        {...register("website")}
      />
      <textarea
        aria-label="Коментар"
        placeholder="Опишіть, як підтвердити ваше право керування закладом"
        rows={4}
        className="rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary"
        {...register("message")}
      />

      {message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
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
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
      >
        {isSubmitting ? "Відправлення..." : "Подати заявку"}
      </button>
    </form>
  );
}
