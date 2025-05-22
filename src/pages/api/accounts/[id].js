import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      // Supprime l'élément de la base de données
      const deletedAccount = await prisma.admin.delete({
        where: { id: parseInt(id) }, // Assure-toi que l'id est converti en entier si nécessaire
      });

      res
        .status(200)
        .json({ message: "Collection supprimée avec succès.", deletedAccount });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la suppression.",
          error: error.message,
        });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Méthode ${req.method} non autorisée.`);
  }
}
