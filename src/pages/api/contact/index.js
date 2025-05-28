import nodemailer from "nodemailer"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" })
  }

  const { name, tel, email, message } = req.body

  if (!name || !email || !tel || !message) {
    return res.status(400).json({ message: "Tous les champs sont requis." })
  }

  
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouveau message de contact</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                    📬 Nouveau Message
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #e8f0fe; font-size: 16px;">
                    Formulaire de contact du site web
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                    Vous avez reçu un nouveau message via le formulaire de contact de votre site web.
                  </p>
                  
                  <!-- Contact Info Cards -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    
                    <!-- Name -->
                    <tr>
                      <td style="padding: 0 0 20px 0;">
                        <table role="presentation" style="width: 100%; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
                          <tr>
                            <td style="padding: 20px;">
                              <table role="presentation" style="width: 100%;">
                                <tr>
                                  <td style="width: 40px; vertical-align: top;">
                                    <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                      <span style="color: #ffffff; font-size: 16px;">👤</span>
                                    </div>
                                  </td>
                                  <td style="padding-left: 15px;">
                                    <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">NOM COMPLET</p>
                                    <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">${name}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Email -->
                    <tr>
                      <td style="padding: 0 0 20px 0;">
                        <table role="presentation" style="width: 100%; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981;">
                          <tr>
                            <td style="padding: 20px;">
                              <table role="presentation" style="width: 100%;">
                                <tr>
                                  <td style="width: 40px; vertical-align: top;">
                                    <div style="width: 32px; height: 32px; background-color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                      <span style="color: #ffffff; font-size: 16px;">📧</span>
                                    </div>
                                  </td>
                                  <td style="padding-left: 15px;">
                                    <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">ADRESSE EMAIL</p>
                                    <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                                      <a href="mailto:${email}" style="color: #10b981; text-decoration: none;">${email}</a>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Phone -->
                    <tr>
                      <td style="padding: 0 0 20px 0;">
                        <table role="presentation" style="width: 100%; background-color: #fef3f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                          <tr>
                            <td style="padding: 20px;">
                              <table role="presentation" style="width: 100%;">
                                <tr>
                                  <td style="width: 40px; vertical-align: top;">
                                    <div style="width: 32px; height: 32px; background-color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                      <span style="color: #ffffff; font-size: 16px;">📞</span>
                                    </div>
                                  </td>
                                  <td style="padding-left: 15px;">
                                    <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">TÉLÉPHONE</p>
                                    <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">
                                      <a href="tel:${tel}" style="color: #ef4444; text-decoration: none;">${tel}</a>
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                  </table>
                  
                  <!-- Message -->
                  <div style="background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b; padding: 25px; margin-bottom: 30px;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                      <div style="width: 32px; height: 32px; background-color: #f59e0b; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                        <span style="color: #ffffff; font-size: 16px;">💬</span>
                      </div>
                      <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 500;">MESSAGE</p>
                    </div>
                    <div style="background-color: #ffffff; border-radius: 6px; padding: 20px; border: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="text-align: center; padding: 20px 0;">
                        <table role="presentation" style="display: inline-block; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 0 10px 0 0;">
                              <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                                Répondre par email
                              </a>
                            </td>
                            <td style="padding: 0 0 0 10px;">
                              <a href="tel:${tel}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                                Appeler
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    Ce message a été envoyé depuis le formulaire de contact de votre site web
                  </p>
                  <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                    ${new Date().toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const mailOptions = {
    from: `"Formulaire Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `📬 Nouveau message de ${name}`,
    html: emailTemplate,
  }

  try {

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Message envoyé avec succès." })
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error)
    return res.status(500).json({
      message: "Une erreur est survenue lors de l'envoi du message.",
    })
  }
}
