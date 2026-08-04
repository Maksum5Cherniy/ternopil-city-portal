"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/schemas/auth";

async function readResponse(response: Response) {
  return (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
}

export default function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Pick<LoginInput, "email">>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: Pick<LoginInput, "email">) => {
    const parsed = loginSchema.pick({ email: true }).safeParse(values);

    if (!parsed.success) {
      setError("email", { message: parsed.error.issues[0]?.message });
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await readResponse(response);

      if (!response.ok) {
        throw new Error(body?.error || "Не вдалося прийняти запит.");
      }

      setIsError(false);
      setMessage(body?.message || "Запит на відновлення прийнято.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося прийняти запит.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-accent-strong">{errors.email.message}</p>
        ) : null}
      </div>
      {message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            isError
              ? "border-accent/40 bg-accent-soft text-accent-strong"
              : "border-primary/30 bg-primary-soft text-primary-strong"
          }`}
        >
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
      >
        {isSubmitting ? "Надсилання..." : "Надіслати лист"}
      </button>
    </form>
  );
}
