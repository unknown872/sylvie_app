import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const collections = await prisma.collection.findMany();
            return res.status(200).json({ collections });
        } catch (error) {
            console.error("Erreur API :", error);
            return res.status(500).json({ message: "Erreur lors de la récupération des collections." });
        }
    } else {
        return res.status(405).json({ message: "Méthode non autorisée." });
    }
}