import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  providers: clientId && clientSecret ? [GoogleProvider({ clientId, clientSecret })] : [],
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn" },
};
