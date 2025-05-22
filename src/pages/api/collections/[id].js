import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      // Supprime l'élément de la base de données
      const deletedItem = await prisma.collection.delete({
        where: { id: parseInt(id, 10) }, // Assure-toi que l'id est converti en entier si nécessaire
      });

      res
        .status(200)
        .json({ message: "Collection supprimée avec succès.", deletedItem });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression.",
          error: error.message,
        });
    }
  } else if (req.method === "PUT") {
    try {
      const { name } = req.body;

      // Met à jour l'élément dans la base de données
      const updatedItem = await prisma.collection.update({
        where: { id: parseInt(id, 10) },
        data: { name },
      });

      res
        .status(200)
        .json({ message: "Collection mise à jour avec succès.", updatedItem });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la mise à jour.",
          error: error.message,
        });
    }
  } else {
    res.setHeader("Allow", ["DELETE", "PUT"]);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}
