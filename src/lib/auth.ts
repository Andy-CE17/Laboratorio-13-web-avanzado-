import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { database } from "@/lib/db";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;
const maxAttempts = 5;
const dummyHash = "$2b$12$knHtMD2zA4ZeH0vY1mbhb.QO4woanEhS1KuY1E5kpKaDYYHHethcq";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Correo y contraseña",
      credentials: {
        email: { label: "Correo electrónico", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || email.length > 254 || !password || Buffer.byteLength(password) > 72) {
          return null;
        }

        const result = await database().begin(async (sql) => {
          const [account] = await sql`
            SELECT id, name, email, password_hash, failed_attempts,
                   locked_until IS NOT NULL AS had_lock,
                   COALESCE(locked_until > clock_timestamp(), false) AS is_locked
            FROM laboratorio13.users
            WHERE email = ${email}
            FOR UPDATE
          `;
          if (account?.is_locked) return "AccountLocked";
          const valid = await compare(password, account?.password_hash ?? dummyHash);
          if (!account) return null;
          if (valid) {
            await sql`
              UPDATE laboratorio13.users SET failed_attempts = 0, locked_until = NULL
              WHERE id = ${account.id}
            `;
            return { id: account.id, name: account.name, email: account.email };
          }

          const attempts = (account.had_lock ? 0 : account.failed_attempts) + 1;
          const locked = attempts >= maxAttempts;
          await sql`
            UPDATE laboratorio13.users
            SET failed_attempts = ${attempts},
                locked_until = CASE WHEN ${locked} THEN clock_timestamp() + interval '15 minutes' END
            WHERE id = ${account.id}
          `;
          return locked ? "AccountLocked" : null;
        }).catch(() => {
          throw new Error("CredentialsUnavailable");
        });

        if (result === "AccountLocked") throw new Error(result);
        return result;
      },
    }),
    ...(clientId && clientSecret ? [GoogleProvider({ clientId, clientSecret })] : []),
    ...(githubId && githubSecret
      ? [GitHubProvider({ clientId: githubId, clientSecret: githubSecret })]
      : []),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn" },
};
