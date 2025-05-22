import { useSession, getSession } from "next-auth/react";
import React from "react";

export default function index() {
  const { data: session, status } = useSession();
  if (status === "loading") return <div>Chargement...</div>;
  if (!session) return <div>Non connecté</div>;
  return (
    <div>
      <h1>Ma page</h1>
      <h1>Bonjour, {session.user.email}</h1>
      <h1>Email: {session.user.email}</h1>
    </div>
  );
}

// Protéger côté serveur
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/admin/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
