"use client";

import { useState, type FormEvent } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

export default function RegisterForm({ onBack, onRegistered }: {
  onBack: () => void;
  onRegistered: () => void;
}) {
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
        onRegistered();
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
    <>
        <h2>Crear cuenta</h2>
        <p className="auth-subtitle">Completa tus datos para registrarte</p>
        <form onSubmit={submit} className="space-y-4 text-gray-800">
          <label className="auth-field"><FaUser aria-hidden="true" /><span className="sr-only">Nombre</span>
            <input name="name" autoComplete="name" required maxLength={100} placeholder="Nombre" />
          </label>
          <label className="auth-field"><FaEnvelope aria-hidden="true" /><span className="sr-only">Correo electrónico</span>
            <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Correo electrónico" />
          </label>
          <label className="auth-field"><FaLock aria-hidden="true" /><span className="sr-only">Contraseña</span>
            <input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} placeholder="Contraseña (mínimo 8 caracteres)" />
          </label>
          {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
          <button disabled={pending} className="auth-primary w-full">
            {pending ? "Creando cuenta…" : "Registrarme"}
          </button>
        </form>
        <p className="auth-register">¿Ya tienes una cuenta? <button type="button" onClick={onBack} disabled={pending}>Inicia sesión</button></p>
    </>
  );
}
