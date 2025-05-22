import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { collectionId, search, page = 1, limit = 10 } = req.query; // Récupérez les paramètres de pagination

    if (req.method === "GET") {
        try {
            // Création de l'objet de filtre dynamique
            const whereClause = {};

            if (collectionId) {
                whereClause.collectionId = parseInt(collectionId);
            }

            if (search) {
                whereClause.name = {
                    contains: search,
                    mode: "insensitive", // Pour une recherche insensible à la casse
                };
            }

            // Calcul du nombre d'éléments à ignorer
            const skip = (parseInt(page) - 1) * parseInt(limit);

            // Récupération du nombre total d'éléments correspondant aux critères
            const totalItems = await prisma.product.count({
                where: whereClause,
            });

            // Récupération des produits paginés
            const products = await prisma.product.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    image: true,
                    stock: true,
                },
                skip: skip, // Ignorer les éléments précédents
                take: parseInt(limit), // Limiter le nombre d'éléments
            });

            // Calcul du nombre total de pages
            const totalPages = Math.ceil(totalItems / parseInt(limit));

            // Réponse incluant les produits et les informations de pagination
            res.status(200).json({
                products,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalItems,
                    itemsPerPage: parseInt(limit),
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la récupération des produits." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
}