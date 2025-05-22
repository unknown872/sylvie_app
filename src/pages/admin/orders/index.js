import React, { useEffect, useState, useRef } from "react";
import Layout from "@/components/admin/layout/layout";
//import order from "./order";
import Link from "next/link";
import { Alert } from "@mui/material";
import { CiSearch } from "react-icons/ci";

export default function index() {
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8); // nombre d’éléments par page
  const [totalPages, setTotalPages] = useState(1);
  const [statsCommandes, setStatsCommandes] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async (statut = "", page = 1, search = "") => {
    try {
      setIsLoading(true);
      let url = `/api/orders?page=${page}&limit=${limit}`;
      if (statut) {
        url += `&statut=${encodeURIComponent(statut)}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
      if (data.statsCommandes) {
        setStatsCommandes(data.statsCommandes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders(selectedStatus, currentPage, searchTerm);
    }, 300); // petit debounce pour éviter trop de requêtes

    return () => clearTimeout(delayDebounce);
  }, [selectedStatus, currentPage, searchTerm]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedOrder((prev) => ({
      ...prev,
      statut: newStatus,
    }));

    try {
      setIsLoading(true);
      const res = await fetch(`/api/orders/edit/${selectedOrder.id}`, {
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
        setSelectedOrder(updatedOrder);

        fetchOrders();
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
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchOrders(selectedStatus, pageNumber);
  };

  const handleFilterClick = (status) => {
    setSelectedStatus(status);
    fetchOrders(status);
  };
  const handleAllOrdersClick = () => {
    setSelectedStatus("");
    fetchOrders();
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

  const handleOpenModal = (productOrder) => {
    setIsOpen(!isOpen);
    setSelectedOrder(productOrder);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white shadow-xl shadow-slate-300 divide-y text-sm divide-gray-300 py-6">
        <main className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filtres par statut */}
          <div className="flex flex-col space-y-4 mb-6">
            {statsCommandes && (
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div
                  onClick={() => handleFilterClick("")}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm cursor-pointer border ${
                    selectedStatus === ""
                      ? "bg-amber-400 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Toutes ({statsCommandes.totalCommandes})
                </div>
                <div
                  onClick={() => handleFilterClick("En attente")}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm cursor-pointer border ${
                    selectedStatus === "En attente"
                      ? "bg-amber-400 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  En attente ({statsCommandes.EnAttente})
                </div>
                <div
                  onClick={() => handleFilterClick("Expédiée")}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm cursor-pointer border ${
                    selectedStatus === "Expédiée"
                      ? "bg-amber-400 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Expédiées ({statsCommandes.Expédiée})
                </div>
                <div
                  onClick={() => handleFilterClick("Livrée")}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm cursor-pointer border ${
                    selectedStatus === "Livrée"
                      ? "bg-amber-400 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Livrées ({statsCommandes.Livrée})
                </div>
                <div
                  onClick={() => handleFilterClick("Annulée")}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm cursor-pointer border ${
                    selectedStatus === "Annulée"
                      ? "bg-amber-400 text-white"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Annulées ({statsCommandes.Annulée})
                </div>
              </div>
            )}
          </div>

          {/* Barre de recherche et boutons d'action */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Entrez le numéro de commande"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <CiSearch className="absolute h-6 w-6 left-3 top-3 text-gray-400" />
              </div>
              <div className="flex gap-2 sm:gap-4">
                <button className="flex-1 sm:flex-none bg-transparent border border-gray-300 px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200">
                  Exporter
                </button>
                <button className="flex-1 sm:flex-none bg-transparent border border-gray-300 px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium hover:bg-gray-200">
                  Filtres avancés
                </button>
              </div>
            </div>
          </div>

          {/* Tableau des commandes */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100">
                        Commande{" "}
                        <span className="inline-block ml-1 text-xs">↓</span>
                      </th>
                      <th className="px-3 py-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100 hidden sm:table-cell">
                        Date
                      </th>
                      <th className="px-3 py-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100">
                        Client
                      </th>
                      <th className="px-3 py-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100 hidden md:table-cell">
                        Produits
                      </th>
                      <th className="px-3 py-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100">
                        Total
                      </th>
                      <th className="px-3 py-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100">
                        Statut
                      </th>
                      <th className="px-3 py-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders?.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 sm:p-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-3 py-3 sm:p-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {
                            new Date(order.createdAt)
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td className="px-3 py-3 sm:p-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div className="font-medium">
                            {order.firstName} {order.lastName}
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:p-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                              {order.products.length} articles
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 sm:p-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <span className="font-semibold">
                            {new Intl.NumberFormat("fr-FR", {
                              style: "currency",
                              currency: "XOF",
                              currencyDisplay: "symbol",
                              minimumFractionDigits: 0,
                            }).format(order.totalPrice)}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:p-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusClasses(
                              order.statut
                            )}`}
                          >
                            {order.statut}
                          </span>
                        </td>
                        <td className="px-3 py-3 sm:p-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link href={`/admin/orders/${order.id}`}>
                              <button className="w-full sm:w-auto bg-transparent border border-gray-300 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-200">
                                Détails
                              </button>
                            </Link>
                            {order?.statut !== "Livrée" && (
                              <button
                                onClick={() => handleOpenModal(order)}
                                className="w-full sm:w-auto bg-primary hover:bg-primary-light text-white px-3 py-1.5 rounded-md text-xs font-medium"
                              >
                                Traiter
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex gap-1">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded border ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400"
                          : "bg-white cursor-pointer hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                    >
                      «
                    </div>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <div
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded border text-sm cursor-pointer ${
                            currentPage === page
                              ? "bg-primary text-white border-primary"
                              : "bg-white hover:bg-gray-100 border-gray-300"
                          }`}
                        >
                          {page}
                        </div>
                      )
                    )}

                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded border ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400"
                          : "bg-white cursor-pointer hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                    >
                      »
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal de mise à jour du statut */}
          {isOpen && selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
              <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
                {notification.message && (
                  <Alert severity={notification.type} className="mb-4">
                    {notification.message}
                  </Alert>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-2 top-2 sm:-right-5 sm:-top-8 bg-primary hover:bg-primary-light text-white w-8 h-8 sm:px-4 sm:py-2 flex items-center justify-center rounded-full text-sm font-medium"
                >
                  X
                </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Commande #{selectedOrder?.id}
                  </h2>
                  <div className="mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusClasses(
                        selectedOrder.statut
                      )}`}
                    >
                      {selectedOrder?.statut}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Statut de la commande :
                  </label>
                  <div className="relative mt-1 sm:mt-0 w-full sm:w-auto">
                    <select
                      value={selectedOrder?.statut}
                      onChange={handleStatusChange}
                      className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
