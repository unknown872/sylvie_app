import "@/styles/globals.css";
import { useRouter } from "next/router";
import Loader from "@/components/user/Loader";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react"; // Importer le SessionProvider

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Simuler un premier "chargement" de l'application
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Retirer le loader après un certain temps (ex: 1 seconde)
    }, 300); // Durée de 1 seconde pour simuler un premier chargement
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true); // Commence à charger
    const handleRouteChangeComplete = () => setLoading(false); // Fin de chargement
    const handleRouteChangeError = () => setLoading(false); // En cas d'erreur

    // Écouter les changements de route
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    // Nettoyage lors du démontage
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router]);

  return (
    <SessionProvider session={pageProps.session}>
      {/* Encapsuler l'application avec SessionProvider */}
      {loading ? (
        <Loader />
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}