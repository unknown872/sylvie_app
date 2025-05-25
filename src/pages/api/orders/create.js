import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import path from "path";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fonction pour uploader vers Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: "orders",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Erreur Cloudinary :", error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), "/public/uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error("Erreur formidable:", err);
        return res.status(500).json({ error: "Erreur de parsing du formulaire." });
      }

      const { firstName, lastName, city, address, phone, email, notes } = fields;
      const deliveryQuartier = fields.deliveryQuartier || [];
      const deliveryPrice = parseInt(fields.deliveryPrice);
      const totalPrice = parseInt(fields.totalPrice);
      const products = typeof fields.products === "string"
        ? JSON.parse(fields.products)
        : fields.products;

      if (!firstName || !lastName || !city || !address || !phone || !email || !products.length) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
      }

      // Vérification du stock
      for (const product of products) {
        const existingProduct = await prisma.product.findUnique({
          where: { id: product.id },
        });
        if (!existingProduct || existingProduct.stock < product.quantity) {
          return res.status(400).json({
            error: `Le produit ${product.name} n'a pas assez de stock.`,
          });
        }
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: existingProduct.stock - product.quantity },
        });
      }

      // Upload images
      const imageFile = files.image ? files.image[0] : null;
      const otherImageFile = files.other_image ? files.other_image[0] : null;

      const imageUrl = imageFile ? await uploadToCloudinary(imageFile) : null;
      const otherImageUrl = otherImageFile ? await uploadToCloudinary(otherImageFile) : null;

      // Création de la commande
      const order = await prisma.order.create({
        data: {
          firstName,
          lastName,
          city,
          address,
          phone,
          email,
          notes,
          deliveryQuartier: deliveryQuartier.join(", "),
          deliveryPrice,
          totalPrice,
          products: {
            create: products.map((product) => ({
              productId: product.id,
              name: product.name,
              price: product.price,
              quantity: product.quantity,
              image: product.image,
              other_image: product.other_image,
            })),
          },
        },
      });

      // Mise à jour des images du premier produit
      const productId = products[0]?.id;
      if (productId && (imageUrl || otherImageUrl)) {
        await prisma.product.update({
          where: { id: productId },
          data: {
            image: imageUrl || undefined,
            other_image: otherImageUrl || undefined,
          },
        });
      }

      // Envoi de l’email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎉 Confirmation de votre commande",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
             
              body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
              }
             
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
             
              .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 2px solid #f0f0f0;
              }
             
              .header h1 {
                color: #4a4a4a;
                margin: 0;
                font-size: 24px;
              }
             
              .content {
                padding: 20px 0;
              }
             
              .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
              }
             
              .order-details {
                background-color: #f8fafc;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 20px;
              }
             
              .product-list {
                list-style-type: none;
                padding: 0;
              }
             
              .product-item {
                padding: 10px 0;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
              }
             
              .product-item:last-child {
                border-bottom: none;
              }
             
              .price-summary {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px dashed #ddd;
              }
             
              .price-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              }
             
              .total-price {
                font-weight: 700;
                font-size: 18px;
                color: #e74c3c;
              }
             
              .shipping-info {
                margin-top: 20px;
                padding: 15px;
                background-color: #e8f4f8;
                border-radius: 6px;
              }
             
              .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 2px solid #f0f0f0;
                color: #7f8c8d;
                font-size: 14px;
              }
             
              .contact-button {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 20px;
                background-color: #3498db;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 500;
              }
             
              .social-links {
                margin-top: 15px;
              }
             
              .social-icon {
                display: inline-block;
                margin: 0 8px;
                width: 30px;
                height: 30px;
                background-color: #3498db;
                border-radius: 50%;
                text-align: center;
                line-height: 30px;
                color: white;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Confirmation de Commande ✨</h1>
              </div>
             
              <div class="content">
                <p class="greeting">Bonjour ${firstName} ${lastName},</p>
               
                <p>Nous sommes ravis de vous confirmer que votre commande a bien été reçue et est en cours de traitement. Merci pour votre confiance !</p>
               
                <div class="order-details">
                  <h3>Détails de votre commande:</h3>
                  <ul class="product-list">
                    ${products.map(product => `
                      <li class="product-item">
                        <span>${product.name}</span>
                        <span>x${product.quantity}</span>
                      </li>
                    `).join('')}
                  </ul>
                 
                  <div class="price-summary">
                    <div class="price-item">
                      <span>Sous-total:</span>
                      <span>${totalPrice - deliveryPrice} FCFA</span>
                    </div>
                    <div class="price-item">
                      <span>Frais de livraison:</span>
                      <span>${deliveryPrice} FCFA</span>
                    </div>
                    <div class="price-item total-price">
                      <span>Total:</span>
                      <span>${totalPrice} FCFA</span>
                    </div>
                  </div>
                </div>
               
                <div class="shipping-info">
                  <h3>Adresse de livraison:</h3>
                  <p>${address}, ${city}</p>
                  <p>Vous recevrez prochainement un email avec les informations de suivi de votre colis.</p>
                </div>
               
                <p>Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.</p>
                <div style="text-align: center;">
                  <a href="mailto:${process.env.EMAIL_USER}" class="contact-button">Nous contacter</a>
                </div>
              </div>
             
              <div class="footer">
                <p>Merci encore pour votre achat!</p>
                <p>© 2025 Les Senteurs de Sylvie. Tous droits réservés.</p>
                <div class="telephone">
                  <p>Contactez notre service client: ${process.env.PHONE_NUMBER}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      };
      // Configuration des emails de notification pour l'administrateur
      const mailOptionsAdmin = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "🔔 Nouvelle commande - Action requise",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
             
              body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
              }
             
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
             
              .header {
                text-align: center;
                padding: 15px 0;
                background-color: #2c3e50;
                color: white;
                border-radius: 6px 6px 0 0;
              }
             
              .header h1 {
                margin: 0;
                font-size: 22px;
              }
             
              .content {
                padding: 20px 0;
              }
             
              .order-summary {
                background-color: #f8fafc;
                border-radius: 6px;
                padding: 15px;
                margin-bottom: 20px;
              }
             
              .customer-info {
                margin-bottom: 15px;
              }
             
              .product-table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
              }
             
              .product-table th, .product-table td {
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid #eee;
              }
             
              .product-table th {
                background-color: #e8f4f8;
              }
             
              .price-summary {
                margin-top: 15px;
              }
             
              .price-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
              }
             
              .total-price {
                font-weight: 700;
                font-size: 18px;
                color: #2980b9;
                padding-top: 8px;
                border-top: 1px solid #ddd;
              }
             
              .action-button {
                display: inline-block;
                margin-top: 15px;
                padding: 10px 20px;
                background-color: #27ae60;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 500;
                text-align: center;
              }
             
              .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #f0f0f0;
                color: #7f8c8d;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔔 Nouvelle Commande Reçue</h1>
              </div>
             
              <div class="content">
                <p>Une nouvelle commande vient d'être passée et nécessite votre attention.</p>
               
                <div class="order-summary">
                  <div class="customer-info">
                    <h3>Informations client:</h3>
                    <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Adresse de livraison:</strong> ${address}, ${city}</p>
                  </div>
                 
                  <h3>Détails de la commande:</h3>
                  <table class="product-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${products.map(product => `
                        <tr>
                          <td>${product.name}</td>
                          <td>${product.quantity}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                 
                  <div class="price-summary">
                    <div class="price-item">
                      <span>Sous-total:</span>
                      <span>${totalPrice - deliveryPrice} FCFA</span>
                    </div>
                    <div class="price-item">
                      <span>Frais de livraison:</span>
                      <span>${deliveryPrice} FCFA</span>
                    </div>
                    <div class="price-item total-price">
                      <span>Total:</span>
                      <span>${totalPrice} FCFA</span>
                    </div>
                  </div>
                </div>
               
                <div style="text-align: center;">
                  <a href="VOTRE_URL_TABLEAU_DE_BORD" class="action-button">Accéder au tableau de bord</a>
                </div>
              </div>
             
              <div class="footer">
                <p>Cet email a été généré automatiquement. Merci de ne pas y répondre.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptionsAdmin);
      } catch (error) {
        console.error("Erreur envoi email :", error);
        return res.status(500).json({ error: "Erreur lors de l'envoi des emails." });
      }

      return res.status(201).json({ message: "Commande soumise avec succès", order });

    } catch (error) {
      console.error("Erreur générale :", error);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }
  });
}
