import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const total = await prisma.product.aggregate({
        _count: {
          id: true,
        },
        where: {
          stock: 0,
        },
      });

      const totalOutOfStockProducts = total._count.id || 0;
      res.status(200).json(totalOutOfStockProducts);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre total de produits en rupture de stock:",
        error
      );
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération du nombre total de produits en rupture de stock" });
    }
  }
}