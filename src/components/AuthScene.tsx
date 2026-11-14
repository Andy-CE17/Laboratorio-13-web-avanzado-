import type { ReactNode } from "react";
import { FaAward } from "react-icons/fa";

export default function AuthScene({ title, description, children }: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-scene">
      <section className="auth-intro">
        <p className="auth-brand"><FaAward aria-hidden="true" /> UMBRAL</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
      <section className="auth-card">{children}</section>
    </div>
  );
}
