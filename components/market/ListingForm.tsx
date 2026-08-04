"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { listingCategories } from "@/constants/content";
import { listingCreateSchema, type ListingCreateInput } from "@/schemas/listing";

const conditionOptions = [
  { value: "new", label: "Новий" },
  { value: "likeNew", label: "Як новий" },
  { value: "used", label: "Вживаний" },
  { value: "needsRepair", label: "Потребує ремонту" },
] as const;

const contactOptions = [
  { value: "phone", label: "Телефон" },
  { value: "telegram", label: "Telegram" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Інше" },
] as const;

async function readError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;

  return body?.error || fallback;
}

export default function ListingForm() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ListingCreateInput>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      categoryId: "electronics",
      condition: "used",
      district: "",
      phone: "",
      telegram: "",
      instagram: "",
      preferredContact: "phone",
    },
  });

  const onSubmit = async (values: ListingCreateInput) => {
    setMessage("");
    setIsError(false);

    const parsed = listingCreateSchema.safeParse(values);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];

        if (typeof fieldName === "string") {
          setError(fieldName as keyof ListingCreateInput, { message: issue.message });
        }
      });

      return;
    }

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error(await readError(response, "Не вдалося створити оголошення."));
      }

      reset();
      setMessage("Оголошення створено і відправлено на модерацію.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося створити оголошення.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div>
        <label htmlFor="title" className="text-sm font-semibold">
          Назва
        </label>
        <input
          id="title"
          className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("title")}
        />
        {errors.title ? (
          <p className="mt-1 text-sm text-accent-strong">{errors.title.message}</p>
        ) : null}
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-semibold">
          Опис
        </label>
        <textarea
          id="description"
          rows={5}
          className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary"
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-accent-strong">{errors.description.message}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="price" className="text-sm font-semibold">
            Ціна
          </label>
          <input
            id="price"
            type="number"
            min={0}
            className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
            {...register("price")}
          />
        </div>
        <div>
          <label htmlFor="categoryId" className="text-sm font-semibold">
            Категорія
          </label>
          <select
            id="categoryId"
            className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
            {...register("categoryId")}
          >
            {listingCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="condition" className="text-sm font-semibold">
            Стан
          </label>
          <select
            id="condition"
            className="mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
            {...register("condition")}
          >
            {conditionOptions.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          aria-label="Район"
          placeholder="Район"
          className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("district")}
        />
        <select
          aria-label="Бажаний контакт"
          className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("preferredContact")}
        >
          {contactOptions.map((contact) => (
            <option key={contact.value} value={contact.value}>
              {contact.label}
            </option>
          ))}
        </select>
        <input
          aria-label="Телефон"
          placeholder="Телефон"
          className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("phone")}
        />
        <input
          aria-label="Telegram"
          placeholder="Telegram"
          className="min-h-12 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary"
          {...register("telegram")}
        />
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
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
        type="submit"
      >
        {isSubmitting ? "Створення..." : "Опублікувати на модерацію"}
      </button>
    </form>
  );
}
