import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "PUT") {
        const { stock } = req.body;

        if (isNaN(stock)) {
            return res.status(400).json({ message: "Le stock doit être un nombre valide." });
        }

        try {
            // Vérifier si le produit existe
            const existingProduct = await prisma.product.findUnique({
                where: { id: parseInt(id, 10) },
            });

            if (!existingProduct) {
                return res.status(404).json({ message: "Produit non trouvé." });
            }

            // Initialiser les nouvelles données à mettre à jour
            const updatedData = { stock };

            // Si le stock augmente, on met à jour initialStock
            if (stock > existingProduct.initialStock) {
                updatedData.initialStock = stock;
            }

            // Mettre à jour le produit dans la base de données
            const updatedProduct = await prisma.product.update({
                where: { id: parseInt(id, 10) },
                data: updatedData,
            });

            res.status(200).json({
                message: "Stock mis à jour avec succès.",
                updatedProduct,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur lors de la mise à jour du stock." });
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
}
