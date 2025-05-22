import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fonction pour afficher les details d'une commande
export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { id } = req.query;
            const order = await prisma.order.findUnique({
                where: { id: parseInt(id) },
                include: {
                    products: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            quantity: true,
                            image: true,
                            other_image: true,
                        },
                    },
                },
            });

            if (!order) {
                return res.status(404).json({ error: "Commande introuvable" });
            }

            res.status(200).json(order);
        }
        catch (error) {
            console.error("Erreur lors de la récupération de la commande:", error);
            res.status(500).json({ error: "Erreur lors de la récupération de la commande" });
        }
    }
}