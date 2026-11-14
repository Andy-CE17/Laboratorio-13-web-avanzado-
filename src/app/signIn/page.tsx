"use client";

import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [githubEnabled, setGitHubEnabled] = useState(false);

  useEffect(() => {
    void getProviders().then((providers) => setGitHubEnabled(Boolean(providers?.github)));
  }, []);

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Iniciar sesión</h1>
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
