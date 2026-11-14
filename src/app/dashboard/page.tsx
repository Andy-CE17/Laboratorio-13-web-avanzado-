import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { FaArrowDown, FaAward, FaCheckCircle, FaEnvelope, FaThLarge, FaUser } from "react-icons/fa";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signIn");
  const { name, email, image } = session.user;
  const displayName = name || email || "Mi cuenta";

  return (
    <div className="account-shell">
      <aside className="account-sidebar">
        <a href="#panel" className="auth-brand"><span className="account-logo"><FaAward aria-hidden="true" /></span> UMBRAL</a>
        <nav aria-label="Menú de cuenta">
          <a href="#panel"><FaThLarge aria-hidden="true" /> Panel</a>
          <a href="#perfil"><FaUser aria-hidden="true" /> Mi perfil</a>
        </nav>
        <LogoutButton />
      </aside>
      <div id="panel" className="account-content">
        <header className="account-header">
          <p>Panel de cuenta</p>
          <span><FaCheckCircle aria-hidden="true" /> Sesión activa</span>
        </header>
        <div className="account-inner">
          <section className="account-welcome">
            <h1>Bienvenido, {displayName}</h1>
            <p>Consulta los datos de la cuenta con la que iniciaste sesión.</p>
            <a className="account-jump" href="#perfil">Ver mi perfil <FaArrowDown aria-hidden="true" /></a>
          </section>
          <section id="perfil" className="account-profile" aria-labelledby="profile-heading">
            <div className="account-profile-heading">
              <span><FaUser aria-hidden="true" /></span>
              <h2 id="profile-heading">Mi perfil</h2>
            </div>
            <div className="account-profile-body">
              {image ? (
                <Image src={image} width={88} height={88} alt="Foto de perfil" className="account-avatar" />
              ) : (
                <div className="account-avatar account-avatar-placeholder"><FaUser aria-hidden="true" /></div>
              )}
              <dl>
                <div><dt><FaUser aria-hidden="true" /> Nombre</dt><dd>{name || "Sin nombre registrado"}</dd></div>
                <div><dt><FaEnvelope aria-hidden="true" /> Correo electrónico</dt><dd>{email || "Sin correo registrado"}</dd></div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
