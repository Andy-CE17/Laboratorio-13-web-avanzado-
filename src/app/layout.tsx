import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import Provider from "@/components/SessionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Umbral",
  description: "Inicio de sesión y perfil de cuenta",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-100">
        <Provider>
          <nav aria-label="Navegación principal" className="bg-black text-white shadow-sm">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
              <Link href="/" className="text-xl font-semibold">UMBRAL</Link>
              <ul className="flex flex-wrap items-center gap-4 text-sm sm:gap-6">
                <li><Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
                {session?.user && (
                  <>
                    <li><Link href="/profile" className="hover:text-gray-300">Perfil</Link></li>
                    <li><LogoutButton /></li>
                    {session.user.image && (
                      <li><Image src={session.user.image} width={40} height={40}
                        alt="Foto de perfil" className="rounded-full" /></li>
                    )}
                  </>
                )}
              </ul>
            </div>
          </nav>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
