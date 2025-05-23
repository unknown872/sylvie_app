import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import cloudinary from "@/lib/cloudinary"; // 🔗 import config
import fs from "fs";

// Désactivation du body parser par Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erreur parsing form", err);
        return res.status(500).json({ error: "Erreur de parsing" });
      }

      const imageFile = files.image?.[0];
      const otherImageFile = files.other_image?.[0];

      // 🖼️ Upload image principale
      let imageUrl = "";
      if (imageFile) {
        const result = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: "produits", // optionnel : crée un dossier
        });
        imageUrl = result.secure_url;
      }

      // 🖼️ Upload autre image (si elle existe)
      let otherImageUrl = null;
      if (otherImageFile) {
        const result = await cloudinary.uploader.upload(otherImageFile.filepath, {
          folder: "produits",
        });
        otherImageUrl = result.secure_url;
      }

      // Créer le produit dans la base
      try {
        const product = await prisma.product.create({
          data: {
            name: fields.name?.[0],
            description: fields.description?.[0],
            price: parseInt(fields.price?.[0]),
            brand: fields.brand?.[0],
            category: fields.category?.[0],
            stock: parseInt(fields.stock?.[0]),
            initialStock: parseInt(fields.stock?.[0]),
            volume: parseInt(fields.volume?.[0]),
            collectionId: parseInt(fields.collectionId?.[0]),
            image: imageUrl,
            other_image: otherImageUrl,
          },
        });

        res.status(201).json(product);
      } catch (error) {
        console.error("Erreur création produit", error);
        res.status(500).json({ error: "Erreur lors de la création du produit" });
      } finally {
        fs.unlink(imageFile?.filepath, () => {});
        fs.unlink(otherImageFile?.filepath, () => {});
      }
    });
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
