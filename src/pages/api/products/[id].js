import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import path from "path";
import fs from "fs";

// Désactivation du bodyParser de Next.js
export const config = {
  api: {
    bodyParser: false, // Désactive le body parser de Next.js pour permettre à formidable de gérer les fichiers
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: {
          collection: true, // Inclure la collection associée au produit
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Produit introuvable" });
      }

      res.status(200).json(product);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération du produit" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id: parseInt(id) },
      });

      if (!deletedProduct) {
        return res.status(404).json({ error: "Produit introuvable" });
      }

      res
        .status(200)
        .json({ message: "Collection supprimée avec succès.", deletedProduct });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du produit" });
    }
  } else if (req.method === "PUT") {
    const form = formidable({
      keepExtensions: true,
      uploadDir: path.join(process.cwd(), "/public/uploads"),
    });

    // Parse la requête et gérer les fichiers
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erreur lors du parsing du formulaire:", err);
        return res
          .status(500)
          .json({ error: "Erreur lors du téléchargement du fichier." });
      }

      // Récupérer le fichier image
      const imageFile = files.image ? files.image[0] : null; // Supposons qu'il n'y a qu'un seul fichier image
      const otherImageFile = files.other_image ? files.other_image[0] : null;

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const category = Array.isArray(fields.category)
        ? fields.category[0]
        : fields.category;
      const description = Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description;
      const price = parseInt(fields.price);
      const brand = Array.isArray(fields.brand)
        ? fields.brand[0]
        : fields.brand;
      const stock = parseInt(fields.stock);
      const volume = parseInt(fields.volume);
      const collectionId = parseInt(fields.collectionId);

      // Validation des champs numériques
      if (
        isNaN(price) ||
        isNaN(stock) ||
        isNaN(volume) ||
        isNaN(collectionId)
      ) {
        return res.status(400).json({ error: "Champs numériques invalides" });
      }

      // Vérifier que l'id est bien fourni et valide
      const productId = parseInt(req.query.id, 10); // ou récupérez l'ID d'une autre manière, selon votre logique
      if (isNaN(productId)) {
        return res.status(400).json({ error: "ID du produit invalide" });
      }

      // Vérifier si le produit existe avant de tenter de le mettre à jour
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: "Produit introuvable" });
      }

      const imageUrl = imageFile
      ? `/uploads/${imageFile.newFilename}` // Nouvelle image téléchargée
      : existingProduct.image; // Ancienne image existante

      const otherImageUrl = otherImageFile
      ? `/uploads/${otherImageFile.newFilename}` // Nouvelle image téléchargée
      : existingProduct.other_image; // Ancienne image existante

      // Récupérer les champs du formulaire
      try {
        const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id) },
          data: {
            name,
            description,
            price,
            brand,
            stock,
            volume,
            category,
            image: imageUrl, // Chemin de l'image stockée
            collectionId: collectionId,
            other_image: otherImageUrl,
          },
        });

        res.status(200).json(updatedProduct);
      } catch (error) {
        res
          .status(500)
          .json({ error: "Erreur lors de la mise à jour du produit" });
      }
    });
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
