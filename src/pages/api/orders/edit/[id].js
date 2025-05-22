import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { statut } = req.body;

    try {
      // Initialiser l'objet des données à mettre à jour
      const updateData = { statut };

      // Ajouter les champs de date selon le statut choisi
      const now = new Date();
      if (statut === "Expédiée") {
        updateData.shippedAt = now;
        updateData.deliveredAt = null; // Réinitialiser la date de livraison si elle existe
        updateData.cancelledAt = null; // Réinitialiser la date d'annulation si elle existe
      } else if (statut === "Livrée") {
        updateData.deliveredAt = now;
        updateData.cancelledAt = null; // Réinitialiser la date d'annulation si elle existe
      } else if (statut === "Annulée") {
        updateData.cancelledAt = now;
        updateData.shippedAt = null; // Réinitialiser la date d'expédition si elle existe
        updateData.deliveredAt = null; // Réinitialiser la date de livraison si elle existe
      } else if (statut === "En attente") {
        updateData.shippedAt = null; // Réinitialiser la date d'expédition si elle existe
        updateData.deliveredAt = null; // Réinitialiser la date de livraison si elle existe
        updateData.cancelledAt = null; // Réinitialiser la date d'annulation si elle existe
      }

      // Mise à jour de la commande
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      return res.status(500).json({ message: "Erreur serveur", error });
    }
  }

  return res.status(405).json({ message: "Méthode non autorisée" });
}
