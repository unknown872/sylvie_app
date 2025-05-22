import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/admin/layout/layout";
import { MdOutlineChangeCircle } from "react-icons/md";
import { set } from "react-hook-form";
import Alert from "@mui/material/Alert";
import Images from "next/image";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import monImage from "@/assets/images/reine_logo.jpeg";

// Créer les styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  logo: {
    height: 50,
    width: 120, // Ajustez la largeur selon vos besoins
    objectFit: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    borderTopColor: "#e5e7eb",
  },
  status: {
    fontSize: 8,
    padding: 5,
    borderRadius: "100px",
    textTransform: "uppercase",
    marginTop: 5,
    alignSelf: "flex-start",
  },
  statusEnAttente: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  statusAnnulee: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
  },
  statusExpediee: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
  },
  statusLivree: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  section: {
    marginBottom: 15,
  },
  twoColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  column: {
    width: "48%",
  },
  row: {
    flexDirection: "row",
    paddingBottom: 5,
  },
  label: {
    width: 100,
    fontSize: 11,
    color: "#6b7280",
  },
  value: {
    fontSize: 11,
    flex: 1,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    alignItems: "center",
  },
  tableCol1: {
    width: "40%",
    paddingLeft: 5,
    fontSize: 11,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 30,
    height: 30,
    marginRight: 5,
    objectFit: "cover",
  },
  tableCol2: {
    width: "20%",
    textAlign: "center",
    fontSize: 11,
  },
  tableCol3: {
    width: "20%",
    textAlign: "right",
    fontSize: 11,
  },
  tableCol4: {
    width: "20%",
    textAlign: "right",
    paddingRight: 5,
    fontSize: 11,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 5,
  },
  totalLabel: {
    width: "60%",
    textAlign: "right",
    paddingRight: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  totalValue: {
    width: "20%",
    textAlign: "right",
    paddingRight: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    paddingVertical: 2,
    marginBottom: 10,
    gap: "10px",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
});

// Fonction pour obtenir les styles en fonction du statut
const getStatusStyle = (status) => {
  switch (status) {
    case "En attente":
      return styles.statusEnAttente;
    case "Annulée":
      return styles.statusAnnulee;
    case "Expédiée":
      return styles.statusExpediee;
    case "Livrée":
      return styles.statusLivree;
    default:
      return {};
  }
};

// Créer le composant PDF de la facture
const InvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={{ flexDirection: "column", gap: "10px" }}>
          <Text style={{ fontSize: 16, fontWeight: 700 }}>
            Commande #{order?.id}
          </Text>
          <View
            style={{ flexDirection: "row", gap: "5px", alignItems: "center" }}
          >
            <Text style={{ fontSize: 11, fontWeight: 100 }}>
              Date de la commande :
            </Text>
            <Text style={{ fontSize: 11, color: "#6b7280" }}>
              {order?.createdAt
                ? new Date(order?.createdAt).toLocaleDateString("fr-FR")
                : "Date non disponible"}
            </Text>
          </View>
          <View style={[styles.status, getStatusStyle(order?.statut)]}>
            <Text>{order?.statut}</Text>
          </View>
        </View>
        <View
          style={{ flexDirection: "column", gap: "3px", fontWeight: "bold" }}
        >
          <Text style={{ fontSize: 10 }}>Les Senteurs de Sylvie</Text>
          <Text style={{ fontSize: 10 }}>Email: senteurdesylvie@gmail.com</Text>
          <Text style={{ fontSize: 10 }}>Tel: +221 78 101 61 71</Text>
          <Text style={{ fontSize: 10 }}>Adresse: Dakar, Médina 31x2 bis</Text>
        </View>
      </View>

      {/* Informations Client */}
      <View style={styles.card}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 5,
            color: "#111827",
          }}
        >
          Informations Client
        </Text>
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={{ color: "#6b7280", fontSize: 11, width: 75 }}>
                Nom:
              </Text>
              <Text style={styles.value}>
                {order?.firstName} {order?.lastName}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: "#6b7280", fontSize: 11, width: 75 }}>
                Téléphone:
              </Text>
              <Text style={styles.value}>{order?.phone}</Text>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={{ color: "#6b7280", fontSize: 11, width: 70 }}>
                Adresse:
              </Text>
              <Text style={styles.value}>{order?.address}</Text>
            </View>
            <View style={styles.row}>
              <Text style={{ color: "#6b7280", fontSize: 11, width: 70 }}>
                Email:
              </Text>
              <Text style={styles.value}>{order?.email}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Détails de la commande et expédition */}
      <View style={styles.twoColumns}>
        <View style={[styles.column, styles.card]}>
          <Text style={styles.cardTitle}>Détails de la commande</Text>
          <View style={{ flexDirection: "column" }}>
            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>
                {order?.createdAt
                  ? new Date(order?.createdAt).toLocaleString("fr-FR")
                  : "Date non disponible"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Méthode de paiement:</Text>
              <Text style={styles.value}>Paiement à la livraison</Text>
            </View>
          </View>
        </View>

        <View style={[styles.column, styles.card]}>
          <Text style={styles.cardTitle}>Expédition</Text>
          <View style={{ flexDirection: "column" }}>
            <View style={styles.row}>
              <Text style={styles.label}>Méthode:</Text>
              <Text style={styles.value}>Livraison Express</Text>
            </View>
            {order?.shippedAt && (
              <View style={styles.row}>
                <Text style={styles.label}>Date d'expédition:</Text>
                <Text style={styles.value}>
                  {new Date(order?.shippedAt).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            )}
            {order?.deliveredAt && (
              <View style={styles.row}>
                <Text style={styles.label}>Date de livraison:</Text>
                <Text style={styles.value}>
                  {new Date(order?.deliveredAt).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            )}
            {order?.cancelledAt && (
              <View style={styles.row}>
                <Text style={styles.label}>Date d'annulation:</Text>
                <Text style={styles.value}>
                  {new Date(order?.cancelledAt).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Adresses */}
      <View style={styles.twoColumns}>
        <View style={[styles.column, styles.card]}>
          <Text style={styles.cardTitle}>Adresse de livraison</Text>
          <View style={styles.row}>
            <Text style={styles.value}>
              {order?.deliveryQuartier || order?.address}
            </Text>
          </View>
        </View>

        <View style={[styles.column, styles.card]}>
          <Text style={styles.cardTitle}>Adresse de facturation</Text>
          <View style={styles.row}>
            <Text style={styles.value}>
              {order?.deliveryQuartier || order?.address}
            </Text>
          </View>
        </View>
      </View>

      {/* Tableau des produits */}
      <View style={styles.table}>
        <Text style={styles.subtitle}>Produits</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.tableCol1}>Produit</Text>
          <Text style={styles.tableCol2}>Quantité</Text>
          <Text style={styles.tableCol3}>Prix</Text>
          <Text style={styles.tableCol4}>Total</Text>
        </View>

        {order?.products.map((product, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableCol1}>
              {/* Si vous avez besoin de manipuler les images, il est recommandé de les convertir en base64 côté serveur */}
              <Image src={product.image} style={styles.productImage} />
              <Text>{product.name}</Text>
            </View>
            <Text style={styles.tableCol2}>{product.quantity}</Text>
            <Text style={styles.tableCol3}>
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
                minimumFractionDigits: 0,
              })
                .format(product.price)
                .replace(/\s/g, " ")}
            </Text>
            <Text style={styles.tableCol4}>
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
                minimumFractionDigits: 0,
              })
                .format(product.price * product.quantity)
                .replace(/\s/g, " ")}
            </Text>
          </View>
        ))}
      </View>

      {/* Totaux */}
      <View style={{ marginTop: 10 }}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Sous-total:</Text>
          <Text style={styles.totalValue}>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
              minimumFractionDigits: 0,
            })
              .format(order?.totalPrice - order?.deliveryPrice)
              .replace(/\s/g, " ")}
          </Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Frais de livraison:</Text>
          <Text style={styles.totalValue}>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
              minimumFractionDigits: 0,
            })
              .format(order?.deliveryPrice)
              .replace(/\s/g, " ")}
          </Text>
        </View>

        <View
          style={[
            styles.totalRow,
            {
              marginTop: 5,
              borderTopWidth: 1,
              borderTopColor: "#e5e7eb",
              paddingTop: 5,
            },
          ]}
        >
          <Text style={[styles.totalLabel, { fontSize: 12 }]}>Total:</Text>
          <Text style={[styles.totalValue, { fontSize: 12 }]}>
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "XOF",
              minimumFractionDigits: 0,
            })
              .format(order?.totalPrice)
              .replace(/\s/g, " ")}
          </Text>
        </View>
      </View>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text>Merci pour votre commande!</Text>
        <Text>
          Pour toute question, veuillez nous contacter au +221 78 101 61 71
        </Text>
        <Text style={{ marginTop: 5 }}>
          Livraison effectuée le {new Date().toLocaleDateString("fr-FR")}
        </Text>
      </View>
    </Page>
  </Document>
);

function DetailsOrders() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const fetchOrderDetails = async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la commande");
      }
      const data = await response.json();
      console.log("Les donnees", data);
      setOrder(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (order) => {
    setIsOpen(true);
    setSelectedOrderId(order.id);
    setNewStatus(order.statut);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedOrderId(null);
    setNewStatus("");
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "En attente":
        return "bg-amber-100 text-amber-800"; // Couleur amber pour "En attente"
      case "Annulée":
        return "bg-red-100 text-red-800"; // Couleur bleu pour "Annulée"
      case "Expédiée":
        return "bg-blue-100 text-blue-800"; // Couleur verte pour "Expédiée"
      case "Livrée":
        return "bg-green-100 text-green-800"; // Couleur gris pour "Livrée"
      default:
        return "bg-gray-100 text-gray-800"; // Valeur par défaut
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const res = await fetch(`/api/orders/edit/${selectedOrderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setNotification({
          message: "Statut mis à jour avec succès",
          type: "success",
        });
        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 3000);
        setStatus(updatedOrder);

        fetchOrderDetails(id); // Recharger les détails de la commande après la mise à jour
      } else if (res.status === 404) {
        console.error("Commande introuvable");
        setNotification({
          message: "Commande introuvable",
          type: "error",
        });
        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 3000);
      } else {
        console.error("Erreur de mise à jour du statut");
        setNotification({
          message: "Erreur de mise à jour du statut",
          type: "error",
        });
        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 3000);
      }
    } catch (err) {
      console.error("Erreur lors du changement de statut :", err);
      setNotification({
        message: "Erreur lors du changement de statut",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 md:p-4 bg-gray-50">
        {/* En-tête de la commande */}
        <div className="flex flex-col sm:flex-row justify-between border border-slate-200 rounded-md bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-0">
            <span className="text-lg sm:text-xl font-bold text-gray-800">
              Commande #{order?.id}
            </span>
            <div className="flex gap-2">
              <span className="text-xs sm:text-sm text-gray-500">Date : </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800">
                {order?.createdAt
                  ? new Date(order?.createdAt).toLocaleDateString("fr-FR")
                  : "Date non disponible"}
              </span>
            </div>
            <div>
              <span
                className={`text-xs font-medium px-2 sm:px-4 py-1 rounded-full uppercase ${getStatusClasses(
                  order?.statut
                )}`}
              >
                {order?.statut}
              </span>
            </div>
          </div>
          <div className="py-2 sm:py-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {order?.statut == "Livrée" && (
                <PDFDownloadLink
                  document={<InvoicePDF order={order} />}
                  fileName={`facture-commande-${order?.id}.pdf`}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      "Préparation..."
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="hidden sm:inline">
                          Télécharger la facture
                        </span>
                        <span className="sm:hidden">Facture</span>
                      </>
                    )
                  }
                </PDFDownloadLink>
              )}
              <button
                onClick={() => handleOpenModal(order)}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <MdOutlineChangeCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Changer le statut</span>
                <span className="sm:hidden">Statut</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="flex flex-col border border-slate-200 rounded-md space-y-2 bg-white p-4 sm:p-6">
          <h3 className="text-sm sm:text-base text-gray-800 font-medium mb-2">
            Informations Client
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="flex gap-2 w-full sm:w-2/5">
              <span className="text-xs sm:text-sm text-gray-500">
                Prénom :{" "}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800">
                {order?.firstName} {order?.lastName}
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-3/5">
              <span className="text-xs sm:text-sm text-gray-500">
                Adresse :{" "}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                {order?.address}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="flex gap-2 w-full sm:w-2/5">
              <span className="text-xs sm:text-sm text-gray-500">
                Téléphone :{" "}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800">
                {order?.phone}
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-3/5">
              <span className="text-xs sm:text-sm text-gray-500">Email : </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                {order?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Détails de la commande et expédition */}
        <div className="flex flex-col sm:flex-row border border-slate-200 rounded-md bg-white p-4 sm:p-6">
          <div className="space-y-2 w-full sm:w-2/5 mb-4 sm:mb-0">
            <h3 className="text-sm sm:text-base text-gray-800 font-medium">
              Détails de la commande
            </h3>
            <div className="">
              <div>
                <span className="text-xs sm:text-sm text-gray-500">
                  Date de la commande :{" "}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-800">
                  {order?.createdAt
                    ? new Date(order?.createdAt).toLocaleString("fr-FR")
                    : "Date non disponible"}
                </span>
              </div>
              <div>
                <span className="text-xs sm:text-sm text-gray-500">
                  Méthode de paiement :{" "}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-800">
                  Paiement à la livraison
                </span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block w-px bg-gray-200 mx-4" />
          <div className="space-y-2 w-full sm:w-3/5 sm:pl-4">
            <h3 className="text-sm sm:text-base text-gray-800 font-medium mt-4 sm:mt-0">
              Expédition
            </h3>
            <div className="">
              <div>
                <span className="text-xs sm:text-sm text-gray-500">
                  Méthode de livraison :{" "}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-800">
                  Livraison Express
                </span>
              </div>
              <div>
                <span className="text-xs sm:text-sm text-gray-500">
                  Méthode de paiement :{" "}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-800">
                  Paiement à la livraison
                </span>
              </div>
              {order?.shippedAt && (
                <div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Date d'expédition :{" "}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    {new Date(order?.shippedAt).toLocaleString("fr-FR")}
                  </span>
                </div>
              )}
              {order?.deliveredAt && (
                <div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Date de livraison :{" "}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    {new Date(order?.deliveredAt).toLocaleString("fr-FR")}
                  </span>
                </div>
              )}
              {order?.cancelledAt && (
                <div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Date d'Annulation :{" "}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-800">
                    {new Date(order?.cancelledAt).toLocaleString("fr-FR")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Adresses de livraison et facturation */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-full sm:w-1/2 bg-white border border-slate-200 rounded-md p-4 sm:p-6 space-y-2">
            <h3 className="text-sm sm:text-base text-gray-800 font-medium">
              Adresse de livraison
            </h3>
            <div className="flex gap-2">
              <span className="text-xs sm:text-sm text-gray-500">
                Adresse :{" "}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                {order?.deliveryQuartier}
              </span>
            </div>
          </div>
          <div className="w-full sm:w-1/2 bg-white border border-slate-200 rounded-md p-4 sm:p-6 space-y-2">
            <h3 className="text-sm sm:text-base text-gray-800 font-medium">
              Adresse de facturation
            </h3>
            <div className="flex gap-2">
              <span className="text-xs sm:text-sm text-gray-500">
                Adresse :{" "}
              </span>
              <span className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                {order?.deliveryQuartier}
              </span>
            </div>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow relative overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-2 sm:pb-4 text-xs sm:text-sm font-medium text-gray-500">
                  Produit
                </th>
                <th className="text-center pb-2 sm:pb-4 text-xs sm:text-sm font-medium text-gray-500">
                  Quantité
                </th>
                <th className="text-right pb-2 sm:pb-4 text-xs sm:text-sm font-medium text-gray-500">
                  Prix
                </th>
                <th className="text-right pb-2 sm:pb-4 text-xs sm:text-sm font-medium text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order?.products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200">
                  <td className="py-2 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-md"
                      />
                      <h4 className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                        {product.name}
                      </h4>
                    </div>
                  </td>
                  <td className="py-2 sm:py-4 text-center text-xs sm:text-sm text-gray-500">
                    {product.quantity}
                  </td>
                  <td className="py-2 sm:py-4 text-right text-xs sm:text-sm text-gray-500">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-2 sm:py-4 text-right text-xs sm:text-sm font-medium text-gray-800">
                    {formatPrice(product.price * product.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan="3"
                  className="pt-2 sm:pt-4 text-right text-xs sm:text-sm font-medium text-gray-500"
                >
                  Sous-total
                </td>
                <td className="pt-2 sm:pt-4 text-right text-xs sm:text-sm font-semibold text-gray-800">
                  {formatPrice(order?.totalPrice - order?.deliveryPrice)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="3"
                  className="pt-2 sm:pt-4 text-right text-xs sm:text-sm font-medium text-gray-500"
                >
                  Frais de livraison
                </td>
                <td className="pt-2 sm:pt-4 text-right text-xs sm:text-sm font-semibold text-gray-800">
                  {formatPrice(order?.deliveryPrice)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="3"
                  className="pt-2 sm:pt-4 text-right text-xs sm:text-sm font-bold text-gray-800"
                >
                  Total
                </td>
                <td className="pt-2 sm:pt-4 text-right text-xs sm:text-sm font-bold text-gray-800">
                  {formatPrice(order?.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal pour changer le statut */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm">
            {notification.message && (
              <Alert severity={notification.type} className="mb-4">
                {notification.message}
              </Alert>
            )}
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Changer le statut
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Statut de la commande :
              </label>
              <div className="relative mt-1 sm:mt-0">
                <select
                  value={order?.statut}
                  onChange={handleStatusChange}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-xs sm:text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="En attente">En attente</option>
                  <option value="Expédiée">Expédiée</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-800 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default DetailsOrders;
