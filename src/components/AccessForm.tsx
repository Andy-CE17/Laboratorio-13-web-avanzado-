"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState, type FormEvent } from "react";
import { FaEye, FaEyeSlash, FaGithub, FaLock, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import AuthScene from "@/components/AuthScene";
import RegisterForm from "@/components/RegisterForm";

export default function AccessForm({ initialRegistration }: { initialRegistration: boolean }) {
  const [registering, setRegistering] = useState(initialRegistration);
  const [registered, setRegistered] = useState(false);
  const [githubEnabled, setGitHubEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthScene title="Bienvenido a Umbral" description="Accede a tu cuenta para consultar tu panel y tu perfil.">
      {registering ? (
        <RegisterForm onBack={() => setRegistering(false)} onRegistered={() => {
          setRegistered(true);
          setRegistering(false);
        }} />
      ) : (
      <>
        <h2>Inicia sesión</h2>
        <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>
        {registered && <p role="status" className="mb-4 text-center text-sm text-green-800">Cuenta creada. Ya puedes iniciar sesión.</p>}
        <form onSubmit={submitCredentials} className="space-y-4 text-sm text-gray-800">
          <label className="auth-field"><FaUser aria-hidden="true" /><span className="sr-only">Correo electrónico</span>
            <input name="email" type="email" autoComplete="username" required maxLength={254}
              placeholder="Correo electrónico" />
          </label>
          <div className="auth-field"><FaLock aria-hidden="true" />
            <label className="sr-only" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type={showPassword ? "text" : "password"}
              autoComplete="current-password" required maxLength={72} placeholder="Contraseña" />
            <button type="button" className="auth-visibility" aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
          {message && <p role="alert" className="text-red-700">{message}</p>}
          <button disabled={pending} className="auth-primary w-full">
            {pending ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </form>
        <div className="auth-divider">O continúa con</div>
        <div className="auth-providers">
        <button type="button" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="auth-provider" aria-label="Continuar con Google">
          <FcGoogle size={20} aria-hidden="true" /> Google
        </button>
        {githubEnabled && (
          <button type="button" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="auth-provider" aria-label="Continuar con GitHub">
            <FaGithub size={20} color="#181717" aria-hidden="true" /> GitHub
          </button>
        )}
        </div>
        <p className="auth-register">¿No tienes una cuenta? <button type="button" onClick={() => {
          setMessage("");
          setShowPassword(false);
          setRegistered(false);
          setRegistering(true);
        }}>Regístrate</button></p>
      </>
      )}
    </AuthScene>
  );
}
