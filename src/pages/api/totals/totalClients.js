import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    try {
      const clients = await prisma.order.findMany({
        where: {
          statut: "Livrée",
        },
        distinct: ["phone"], // Assure l'unicité des clients par numéro de téléphone
        select: {
          phone: true,
          email: true,
          firstName: true,
          lastName: true,
          address: true,
        },
      });

      const totalClients = clients.length;

      res.status(200).json({ clients, totalClients });
    } catch (error) {
      console.error("Erreur lors de la récupération des clients :", error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des clients" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}