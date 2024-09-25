import { Role } from "@prisma/client";
import {
  AuthOptions,
  getServerSession as nextAuthGetServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { compareHash } from "@/lib/encryption";

import type { DefaultJWT } from "next-auth/jwt";

import prisma from "./prisma";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
      name: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    name: string;
    email: string;
  }
}

export const authOptions: AuthOptions = {
  theme: {
    colorScheme: "dark",
    brandColor: "#E04E4E",
    logo: "/logo.png",
  },
  session: {
    strategy: "jwt",
  },
  pages: { signIn: "/auth/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@student.smktelkom-mlg.sch.id",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          });
          if (!user?.password) return null;

          const isPasswordCorrect = compareHash(
            credentials?.password as string,
            user.password,
          );

          if (!isPasswordCorrect) return null;

          const userPayload = {
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email,
          };

          return userPayload;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      const redirectUrl = url.startsWith("/")
        ? new URL(url, baseUrl).toString()
        : url;
      return redirectUrl;
    },
    async signIn({ user }) {
      if (user.email) {
        const userdb = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!userdb) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "",
              verified: true,
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const userdb = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!userdb) return token;
        token.id = userdb?.id;
        token.role = userdb?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        const userdb = await prisma.user.findUnique({
          where: { id: token.id },
        });
        session.user.role = userdb?.role || "GUEST";
        session.user.name = userdb?.name as string;
        session.user.email = userdb?.email as string;
        session.user.id = userdb?.id as string;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerSession = () => nextAuthGetServerSession(authOptions);
