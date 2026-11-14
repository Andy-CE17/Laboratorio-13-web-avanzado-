"use client";

import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  return (
    <button type="button" onClick={() => signOut({ callbackUrl: "/signIn" })}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-inherit transition hover:bg-white/10">
      <FaSignOutAlt aria-hidden="true" />
      Cerrar sesión
    </button>
  );
}
