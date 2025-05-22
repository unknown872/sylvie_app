import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { name } = req.body;
      try {
        const newCollection = await prisma.collection.create({
          data: { name },
        });
        res.status(200).json(newCollection);
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création de la catégorie" });
      }
    } else {
      res.status(405).json({ error: "Méthode non autorisée" });
    }
  }
