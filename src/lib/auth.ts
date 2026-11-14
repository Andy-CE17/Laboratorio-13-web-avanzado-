import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    ...(clientId && clientSecret ? [GoogleProvider({ clientId, clientSecret })] : []),
    ...(githubId && githubSecret
      ? [GitHubProvider({ clientId: githubId, clientSecret: githubSecret })]
      : []),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn" },
};
