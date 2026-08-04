"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="uk">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            fontFamily: "Arial, sans-serif",
            background: "#F3F4F6",
            color: "#0D1B3D",
          }}
        >
          <section style={{ maxWidth: 520 }}>
            <p style={{ margin: 0, color: "#1E3ABA", fontWeight: 700 }}>500</p>
            <h1 style={{ margin: "12px 0", fontSize: 36, lineHeight: 1.1 }}>
              Сторінка тимчасово недоступна
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#374151" }}>
              У “Де Тернопіль” сталася помилка. Спробуйте перезавантажити сторінку.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                minHeight: 44,
                marginTop: 20,
                border: 0,
                borderRadius: 6,
                padding: "0 18px",
                background: "#0D1B3D",
                color: "#ffffff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Повторити
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
