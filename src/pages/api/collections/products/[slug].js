import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { slug, search } = req.query;

  if (!slug) {
    return res.status(400).json({ message: "Une collection est requise!" });
  }

  try {
    const collection = await prisma.collection.findUnique({
      where: { name: slug },
      include: {
        products: {
          where: search
            ? {
                name: {
                  contains: search, // Recherche insensible à la casse
                  mode: "insensitive",
                },
              }
            : {}, // Si pas de recherche, renvoyer tous les produits
        },
      },
    });

    if (!collection) {
      return res.status(404).json({ message: "Collection non trouvée." });
    }

    return res.status(200).json(collection);
  } catch (error) {
    console.error("Erreur API :", error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la collection." });
  }
}
