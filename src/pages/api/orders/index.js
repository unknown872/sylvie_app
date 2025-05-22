import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const { statut, page = 1, limit = 10, search } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    try {
      const whereClause = {
        ...(statut ? { statut } : {}),
        ...(search ? { id: parseInt(search, 10) } : {}),
      };

      const [orders, total, groupedStatuts] = await Promise.all([
        prisma.order.findMany({
          where: whereClause,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                quantity: true,
                image: true,
              },
            },
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        prisma.order.count({
          where: whereClause,
        }),
        // Statistiques globales par statut
        prisma.order.groupBy({
          by: ["statut"],
          _count: {
            _all: true,
          },
        }),
      ]);

      const statsCommandes = {
        totalCommandes: 0,
        EnAttente: 0,
        Expédiée: 0,
        Livrée: 0,
        Annulée: 0,
      };

      groupedStatuts.forEach(({ statut, _count }) => {
        statsCommandes.totalCommandes += _count._all;
        switch (statut) {
          case "En attente":
            statsCommandes.EnAttente = _count._all;
            break;
          case "Expédiée":
            statsCommandes.Expédiée = _count._all;
            break;
          case "Livrée":
            statsCommandes.Livrée = _count._all;
            break;
          case "Annulée":
            statsCommandes.Annulée = _count._all;
            break;
        }
      });

      const totalPages = Math.ceil(total / limitNumber);

      res.status(200).json({
        orders,
        pagination: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages,
        },
        statsCommandes,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la récupération des commandes.",
      });
    }
    // Note : on ne fait pas prisma.$disconnect ici pour éviter des erreurs dans des environnements avec appels concurrents
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
