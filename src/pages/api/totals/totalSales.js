import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const total = await prisma.order.aggregate({
        _sum: {
          totalPrice: true,
          deliveryPrice: true,
        },
      });

      

      const totalSales =
        (total._sum.totalPrice || 0) - (total._sum.deliveryPrice || 0);
      res.status(200).json(totalSales);

    } catch (error) {
      console.error(
        "Erreur lors de la récupération des ventes totales:",
        error
      );
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des ventes totales" });
    }
  }
}
