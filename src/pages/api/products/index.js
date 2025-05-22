import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { search, category, page = 1, pageSize = 10 } = req.query; 

        try {
            const skip = (page - 1) * pageSize;
            const take = parseInt(pageSize);

            // Construction de l'objet `where` pour filtrer dynamiquement
            const where = {
                name: {
                    contains: search || "",
                    mode: "insensitive",
                },
            };

            if (category) {
                where.category = category; // Ajout du filtre par catégorie
            }

            const products = await prisma.product.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: "desc" },
                include: { collection: true },
            });

            const totalProducts = await prisma.product.count({ where });

            res.status(200).json({
                products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / pageSize),
                currentPage: parseInt(page),
            });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des produits" });
        }
    } else {
        res.status(405).json({ error: "Méthode non autorisée" });
    }
}
