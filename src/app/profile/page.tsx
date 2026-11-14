import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signIn");
  const { name, email, image } = session.user;

  return (
    <div className="min-h-[75vh] bg-gray-100 p-6 sm:p-8">
      <section className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Perfil</h1>
        <div className="space-y-2 text-gray-700">
          <p>Nombre <span className="font-semibold">{name}</span></p>
          <p>Correo <span className="font-semibold">{email}</span></p>
          {image && <Image src={image} width={64} height={64} alt="Foto de perfil"
            className="mt-4 rounded-full" />}
        </div>
      </section>
    </div>
  );
}
