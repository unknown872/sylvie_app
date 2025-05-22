import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) { 
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const total = await prisma.order.aggregate({
        _count: {
          id: true,
        },
        where: {
          statut: "En attente",
        },
      });

      const totalPendingOrders = total._count.id || 0;
      res.status(200).json(totalPendingOrders);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre total de commandes:",
        error
      );
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération du nombre total de commandes" });
    }
  }
}