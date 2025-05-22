import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { search, page = 1, pageSize = 10 } = req.query; // Récupération des paramètres de pagination

        try {
            const skip = (page - 1) * pageSize; // Calculer le nombre d'éléments à ignorer (pour la pagination)
            const take = parseInt(pageSize); // Nombre d'éléments à récupérer

            // Recherche avec pagination et optionnellement avec un filtre de recherche
            const collections = await prisma.collection.findMany({
                where: {
                    name: {
                        contains: search || "", // Recherche de catégories par nom
                        mode: 'insensitive', // Insensible à la casse
                    },
                },
                skip, // Ignorer les premiers éléments en fonction de la page
                take, // Limiter le nombre d'éléments à récupérer
                orderBy: {
                    createdAt: 'desc', // Tri décroissant par date de création (les derniers en premier)
                },
            });

            // Calcul du nombre total de collections pour la pagination
            const totalCollections = await prisma.collection.count({
                where: {
                    name: {
                        contains: search || "",
                        mode: 'insensitive',
                    },
                },
            });

            res.status(200).json({
                collections,
                totalCollections,
                totalPages: Math.ceil(totalCollections / pageSize), // Calcul du nombre total de pages
                currentPage: parseInt(page),
            });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des catégories" });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée" });
    }
}
