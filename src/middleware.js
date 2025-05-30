// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // Middleware personnalisé
  function middleware(req) {},
  {
    callbacks: {
      authorized: ({ token }) => {
        // Autoriser uniquement les utilisateurs connectés
        return !!token; // Redirige vers la page de connexion si non connecté
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/dashboard",
    "/admin/products/:path*",
    "/admin/orders/:path*",
    "/admin/accounts",
    "/admin/collections/:path*",  
    "/admin/stock/:path*",
    "/admin/customers/:path*",
  ],
};
