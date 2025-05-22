import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée." });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.admin.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Utilisateur créé avec succès.", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur est survenue lors de l'inscription." });
  }
}