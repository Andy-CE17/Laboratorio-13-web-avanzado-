import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/signIn");

  return (
    <div className="min-h-[75vh] bg-gray-100 p-6 sm:p-8">
      <section className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-700">
          Bienvenido, <span className="font-semibold">{session.user.name}</span>
        </p>
      </section>
    </div>
  );
}
