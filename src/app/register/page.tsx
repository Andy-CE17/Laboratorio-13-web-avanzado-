"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (response.ok) {
        router.push("/signIn");
      } else {
        const result = await response.json();
        setMessage(result.message);
      }
    } catch {
      setMessage("No se pudo enviar el formulario. Inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gray-100 p-6">
      <section className="w-full max-w-md rounded-lg bg-white p-8 text-gray-800 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Crear cuenta</h1>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">Nombre
            <input name="name" autoComplete="name" required maxLength={100} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">Correo electrónico
            <input name="email" type="email" autoComplete="email" required maxLength={254} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">Contraseña
            <input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
          <button disabled={pending} className="w-full rounded bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-black disabled:opacity-50">
            {pending ? "Creando cuenta…" : "Registrarme"}
          </button>
        </form>
        <Link href="/signIn" className="mt-4 inline-block text-sm underline">Volver al inicio de sesión</Link>
      </section>
    </div>
  );
}
