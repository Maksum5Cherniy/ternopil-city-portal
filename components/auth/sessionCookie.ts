import type { User } from "firebase/auth";

export async function syncSessionCookie(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Не вдалося створити серверну сесію.");
  }
}

export async function clearSessionCookie() {
  await fetch("/api/auth/session", {
    method: "DELETE",
  });
}
