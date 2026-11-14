import { hash } from "bcrypt";
import { database } from "@/lib/db";

export async function POST(request: Request) {
  const data: unknown = await request.json().catch(() => null);
  if (!data || typeof data !== "object") {
    return Response.json({ message: "Revisa los datos del formulario." }, { status: 400 });
  }

  const input = data as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (
    !name || name.length > 100 || email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 || Buffer.byteLength(password, "utf8") > 72
  ) {
    return Response.json({ message: "Ingresa un nombre, un correo válido y una contraseña de al menos 8 caracteres y hasta 72 bytes." }, { status: 400 });
  }

  try {
    const sql = database();
    const passwordHash = await hash(password, 12);
    const users = await sql`
      INSERT INTO laboratorio13.users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    if (!users.length) {
      return Response.json({ message: "Ya existe una cuenta con ese correo." }, { status: 409 });
    }
    return Response.json({ message: "Cuenta creada." }, { status: 201 });
  } catch {
    return Response.json({ message: "El registro no está disponible en este momento." }, { status: 503 });
  }
}
