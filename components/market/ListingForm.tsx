"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, ClipboardList, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary";
const textareaClass =
  "mt-2 w-full rounded-md border border-border bg-surface px-3 py-3 text-sm outline-none transition focus:border-primary";

async function readBody(response: Response) {
  return (await response.json().catch(() => null)) as { error?: string; slug?: string } | null;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-accent-strong">{message}</p> : null;
}

export default function ListingForm() {
  const [message, setMessage] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");
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
      preferredContact: "telegram",
    },
  });

  const onSubmit = async (values: ListingCreateInput) => {
    setMessage("");
    setCreatedSlug("");
    setIsError(false);

    const parsed = listingCreateSchema.safeParse(values);

    if (!parsed.success) {
      setIsError(true);
      setMessage("Перевірте поля форми.");
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
      const body = await readBody(response);

      if (!response.ok) {
        throw new Error(body?.error || "Не вдалося створити оголошення.");
      }

      reset();
      setCreatedSlug(body?.slug || "");
      setMessage("Оголошення створено і відправлено на модерацію.");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "Не вдалося створити оголошення.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary">
            <ClipboardList aria-hidden size={20} />
          </span>
          <div>
            <h2 className="font-semibold">Товар</h2>
            <p className="text-sm text-muted">Назва, опис, категорія, стан і район.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="title" className="text-sm font-semibold">
              Назва
            </label>
            <input id="title" className={inputClass} {...register("title")} />
            <FieldError message={errors.title?.message} />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-semibold">
              Опис
            </label>
            <textarea
              id="description"
              rows={5}
              className={textareaClass}
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="price" className="text-sm font-semibold">
                Ціна, грн
              </label>
              <input
                id="price"
                type="number"
                min={0}
                className={inputClass}
                {...register("price")}
              />
              <FieldError message={errors.price?.message} />
            </div>

            <div>
              <label htmlFor="categoryId" className="text-sm font-semibold">
                Категорія
              </label>
              <select id="categoryId" className={inputClass} {...register("categoryId")}>
                {listingCategories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
              <FieldError message={errors.categoryId?.message} />
            </div>

            <div>
              <label htmlFor="condition" className="text-sm font-semibold">
                Стан
              </label>
              <select id="condition" className={inputClass} {...register("condition")}>
                {conditionOptions.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
              <FieldError message={errors.condition?.message} />
            </div>

            <div>
              <label htmlFor="district" className="text-sm font-semibold">
                Район
              </label>
              <input
                id="district"
                placeholder="Центр, Дружба..."
                className={inputClass}
                {...register("district")}
              />
              <FieldError message={errors.district?.message} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-info-soft text-info">
            <Send aria-hidden size={20} />
          </span>
          <div>
            <h2 className="font-semibold">Контакти</h2>
            <p className="text-sm text-muted">Покупець побачить тільки заповнені контакти.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="phone" className="text-sm font-semibold">
              Телефон
            </label>
            <input id="phone" placeholder="+380..." className={inputClass} {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>

          <div>
            <label htmlFor="telegram" className="text-sm font-semibold">
              Telegram
            </label>
            <input
              id="telegram"
              placeholder="@username"
              className={inputClass}
              {...register("telegram")}
            />
            <FieldError message={errors.telegram?.message} />
          </div>

          <div>
            <label htmlFor="instagram" className="text-sm font-semibold">
              Instagram
            </label>
            <input
              id="instagram"
              placeholder="@username"
              className={inputClass}
              {...register("instagram")}
            />
            <FieldError message={errors.instagram?.message} />
          </div>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold">Основний спосіб зв&apos;язку</div>
          <div className="mt-2 grid gap-2 sm:grid-cols-4">
            {contactOptions.map((contact) => (
              <label
                key={contact.value}
                className="cursor-pointer rounded-md border border-border bg-surface-subtle px-3 py-3 text-center text-sm font-semibold transition has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  value={contact.value}
                  className="sr-only"
                  {...register("preferredContact")}
                />
                {contact.label}
              </label>
            ))}
          </div>
          <FieldError message={errors.preferredContact?.message} />
        </div>
      </section>

      {message ? (
        <div
          className={`rounded-lg border p-4 text-sm ${
            isError
              ? "border-accent/40 bg-accent-soft text-accent-strong"
              : "border-primary/30 bg-primary-soft text-primary-strong"
          }`}
        >
          <div className="flex items-start gap-2">
            {!isError ? <CheckCircle2 aria-hidden size={18} className="mt-0.5 shrink-0" /> : null}
            <div>
              <p className="font-semibold">{message}</p>
              {!isError ? (
                <p className="mt-1 text-sm leading-6">
                  Статус можна переглянути у{" "}
                  <Link href="/profile/listings" className="underline">
                    моїх оголошеннях
                  </Link>
                  {createdSlug ? ` · ID: ${createdSlug}` : ""}.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <button
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
        type="submit"
      >
        <Badge variant="warning" className="border-white/25 bg-white/15 text-white">
          Модерація
        </Badge>
        <span>{isSubmitting ? "Створення..." : "Подати оголошення"}</span>
      </button>
    </form>
  );
}
