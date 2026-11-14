"use client";

import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [githubEnabled, setGitHubEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void getProviders().then((providers) => setGitHubEnabled(Boolean(providers?.github)));
  }, []);

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setMessage("");
    try {
      const result = await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        callbackUrl: "/dashboard",
        redirect: false,
      });
      if (result?.ok && !result.error) {
        window.location.replace(new URL("/dashboard", window.location.origin));
      } else if (result?.error === "AccountLocked") {
        setMessage("Cuenta bloqueada temporalmente por intentos fallidos. Inténtalo de nuevo en 15 minutos.");
      } else if (result?.error === "CredentialsSignin") {
        setMessage("El correo o la contraseña son incorrectos.");
      } else {
        setMessage("No se pudo iniciar sesión. Inténtalo más tarde.");
      }
    } catch {
      setMessage("No se pudo iniciar sesión. Inténtalo más tarde.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Iniciar sesión</h1>
        <form onSubmit={submitCredentials} className="space-y-4 text-sm text-gray-800">
          <label className="block">Correo electrónico
            <input name="email" type="email" autoComplete="username" required maxLength={254}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">Contraseña
            <input name="password" type="password" autoComplete="current-password" required maxLength={72}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2" />
          </label>
          {message && <p role="alert" className="text-red-700">{message}</p>}
          <button disabled={pending} className="w-full rounded bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-black disabled:opacity-50">
            {pending ? "Ingresando…" : "Entrar"}
          </button>
        </form>
        <div className="my-5 border-t border-gray-200" />
        <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex w-full items-center justify-center gap-2 rounded bg-gray-700 px-4 py-2 text-white transition hover:bg-black">
          <FaGoogle aria-hidden="true" /> Continuar con Google
        </button>
        {githubEnabled && (
          <button type="button" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-gray-900 px-4 py-2 text-white transition hover:bg-black">
            <FaGithub aria-hidden="true" /> Continuar con GitHub
          </button>
        )}
        <Link href="/register" className="mt-4 block text-center text-sm text-gray-700 underline">Crear cuenta</Link>
      </div>
    </div>
  );
}
