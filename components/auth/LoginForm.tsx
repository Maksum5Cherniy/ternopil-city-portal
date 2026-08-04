"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "@/firebase/firebaseClient";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { uk } from "@/config/dictionaries/uk";

type LoginFormValues = LoginInput;

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setMessage("");
    setIsError(false);

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          setError(fieldName as keyof LoginFormValues, { message: issue.message });
        }
      });

      return;
    }

    if (!isFirebaseConfigured || !firebaseAuth) {
      setIsError(true);
      setMessage(uk.auth.firebaseMissing);
      return;
    }

    try {
      await signInWithEmailAndPassword(firebaseAuth, parsed.data.email, parsed.data.password);
      setMessage(uk.auth.loginSuccess);
      router.push("/profile");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося увійти.");
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

      <div>
        <label htmlFor="password" className="text-sm font-semibold">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-accent-strong">{errors.password.message}</p>
        ) : null}
      </div>

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
        {isSubmitting ? "Вхід..." : "Увійти"}
      </button>

      <p className="text-sm text-muted">
        Немає профілю?{" "}
        <Link href="/register" className="font-semibold text-primary underline">
          Зареєструватися
        </Link>
      </p>
      <p className="text-sm text-muted">
        Забули пароль?{" "}
        <Link href="/forgot-password" className="font-semibold text-primary underline">
          Відновити доступ
        </Link>
      </p>
    </form>
  );
}
