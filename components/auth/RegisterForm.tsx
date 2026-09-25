"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { uk } from "@/config/dictionaries/uk";

type RegisterFormValues = RegisterInput;

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as {
    error?: string;
    field?: string;
  } | null;

  return {
    message: body?.error || fallback,
    field: body?.field,
  };
}

export default function RegisterForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setStatus("idle");
    setMessage("");

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          setError(fieldName as keyof RegisterFormValues, {
            message: issue.message,
          });
        }
      });

      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const apiError = await readError(
          response,
          "Не вдалося створити профіль.",
        );

        if (apiError.field === "email") {
          setError("email", { message: apiError.message });
        }

        throw new Error(apiError.message);
      }

      const body = (await response.json()) as { message?: string };

      setStatus("success");
      setMessage(body.message || uk.auth.profileCreated);
      window.location.assign(
        new URL("/profile?verify=1", window.location.origin).href,
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Не вдалося створити профіль.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div>
        <label htmlFor="displayName" className="text-sm font-semibold">
          Назва профілю
        </label>
        <input
          id="displayName"
          type="text"
          autoComplete="name"
          className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("displayName")}
        />
        {errors.displayName ? (
          <p className="mt-1 text-sm text-accent-strong">
            {errors.displayName.message}
          </p>
        ) : null}
      </div>

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
          <p className="mt-1 text-sm text-accent-strong">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="text-sm font-semibold">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
            {...register("password")}
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-accent-strong">
              {errors.password.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-semibold">
            Повтор пароля
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword ? (
            <p className="mt-1 text-sm text-accent-strong">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-md border border-border bg-surface-subtle p-3 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-primary"
          {...register("acceptTerms")}
        />
        <span>
          Приймаю{" "}
          <Link href="/terms" className="font-semibold text-primary underline">
            правила користування
          </Link>{" "}
          та{" "}
          <Link
            href="/privacy"
            className="font-semibold text-primary underline"
          >
            політику конфіденційності
          </Link>
          .
        </span>
      </label>
      {errors.acceptTerms ? (
        <p className="text-sm text-accent-strong">
          {errors.acceptTerms.message}
        </p>
      ) : null}

      {message ? (
        <p
          className={`rounded-md border px-3 py-2 text-sm ${
            status === "error"
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
        {isSubmitting ? "Створення..." : "Створити профіль"}
      </button>
    </form>
  );
}
