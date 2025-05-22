import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Entrez votre email",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email et mot de passe sont requis.");
        }

        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Aucun utilisateur trouvé avec cet email.");
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Mot de passe incorrect.");
        }

        // Retourner l'utilisateur si tout est valide
        return { id: user.id, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Ajouter l'ID de l'utilisateur au token JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Ajouter l'ID de l'utilisateur à la session
      return session;
    },
  },
  pages: {
    signIn: "/admin/auth/signin", // Page de connexion personnalisée
  },
};

export default NextAuth(authOptions);
