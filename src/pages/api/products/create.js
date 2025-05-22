import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import path from "path";

// Désactivation du bodyParser de Next.js
export const config = {
  api: {
    bodyParser: false, // Désactive le body parser de Next.js pour permettre à formidable de gérer les fichiers
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Crée un objet formidable pour gérer le formulaire
    const form = formidable({
      uploadDir: path.join(process.cwd(), "/public/uploads"), // Répertoire de stockage des fichiers
      keepExtensions: true, // Garder les extensions des fichiers
    });

    // Parse la requête et gère les fichiers
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erreur lors du parsing du formulaire:", err);
        return res
          .status(500)
          .json({ error: "Erreur lors du téléchargement du fichier." });
      }

      // Récupérer les champs du formulaire
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
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
      const category = Array.isArray(fields.category)
        ? fields.category[0]
        : fields.category;

      // Récupérer le fichier image
      const imageFile = files.image ? files.image[0] : null; // Supposons qu'il n'y a qu'un seul fichier image
      const otherImageFile = files.other_image ? files.other_image[0] : null;

      // Validation des champs requis
      if (
        !name ||
        !imageFile ||
        !description ||
        isNaN(price) ||
        !brand ||
        isNaN(stock) ||
        isNaN(volume) ||
        !collectionId ||
        !category
      ) {
        return res
          .status(400)
          .json({
            error: "Tous les champs sont obligatoires et doivent être valides.",
          });
      }

      try {
        // Sauvegarde du produit dans la base de données
        const product = await prisma.product.create({
          data: {
            name: name,
            description: description,
            price: price,
            brand: brand,
            category: category,
            stock: stock,
            initialStock: stock,
            volume: volume,
            image: `/uploads/${imageFile.newFilename}`, // Chemin de l'image stockée
            collectionId: collectionId,
            other_image: otherImageFile
              ? `/uploads/${otherImageFile.newFilename}`
              : null,
          },
        });

        // Répondre avec le produit créé
        return res.status(201).json(product);
      } catch (error) {
        console.error("Erreur lors de l'ajout du produit:", error);
        return res
          .status(500)
          .json({ error: "Erreur lors de l'ajout du produit." });
      }
    });
  } else {
    // Gérer les autres méthodes HTTP
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
