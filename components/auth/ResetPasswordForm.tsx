"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth";

async function readResponse(response: Response) {
  return (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
}

export default function ResetPasswordForm({ token }: { token?: string }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [completed, setCompleted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    const parsed = resetPasswordSchema.safeParse(values);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0];

      if (field === "password" || field === "confirmPassword" || field === "token") {
        setError(field, { message: issue?.message });
      }

      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = await readResponse(response);

      if (!response.ok) {
        throw new Error(body?.error || "Не вдалося оновити пароль.");
      }

      setIsError(false);
      setCompleted(true);
      setMessage(body?.message || "Пароль оновлено.");
      reset({ token: parsed.data.token, password: "", confirmPassword: "" });
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося оновити пароль.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <input type="hidden" {...register("token")} />
      {!token ? (
        <p className="rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-accent-strong">
          Посилання відновлення відсутнє. Створіть новий запит на відновлення пароля.
        </p>
      ) : null}
      {errors.token ? (
        <p className="rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-accent-strong">
          {errors.token.message}
        </p>
      ) : null}
      <div>
        <label htmlFor="password" className="text-sm font-semibold">
          Новий пароль
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-accent-strong">{errors.password.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-semibold">
          Повторіть пароль
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-sm text-accent-strong">{errors.confirmPassword.message}</p>
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
        disabled={isSubmitting || completed || !token}
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
      >
        {isSubmitting ? "Оновлення..." : "Оновити пароль"}
      </button>
      {completed ? (
        <Link href="/login" className="text-sm font-semibold text-primary underline">
          Увійти з новим паролем
        </Link>
      ) : null}
    </form>
  );
}
