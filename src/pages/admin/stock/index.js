import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Alert } from "@mui/material";
import Layout from "@/components/admin/layout/layout";
import { BsBagDash, BsDashLg } from "react-icons/bs";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdAdd,
  IoMdClose,
} from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { PiEyeBold } from "react-icons/pi";
import { IoFilter } from "react-icons/io5";
import Link from "next/link";
import { TiArrowUnsorted } from "react-icons/ti";
import { GoDash } from "react-icons/go";
import { FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function index() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [totalValueCount, setTotalValueCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const menuRef = useRef(null);
  const [countTotalProducts, setCountTotalProducts] = useState(0);
  const [countTotalUnity, setCountTotalUnity] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Nombre d'éléments par page
  const [totalPages, setTotalPages] = useState(1);
  const [load, setLoad] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Fonction pour fermer le menu si on clique en dehors
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Utilisation de useEffect pour ajouter et nettoyer l'écouteur d'événements
  useEffect(() => {
    // Ajouter un écouteur d'événement pour détecter les clics en dehors du menu
    document.addEventListener("mousedown", handleClickOutside);

    // Nettoyer l'écouteur d'événements lorsque le composant est démonté
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Total des quantités en stock
  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0
  );

  //Recuperer de l'API Stock
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const url = new URL(`/api/stock`, window.location.origin);
        if (selectedCollection)
          url.searchParams.append("collectionId", selectedCollection);
        if (searchQuery) url.searchParams.append("search", searchQuery);
        url.searchParams.append("page", currentPage); // Ajouter le numéro de page
        url.searchParams.append("limit", 10); // Limiter à 10 produits par page

        const response = await fetch(url);
        const data = await response.json();

        setProducts(data.products); // Mettre à jour les produits
        setTotalPages(data.pagination.totalPages); // Mettre à jour le nombre total de pages
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock:", error);
        setLoading(false);
      }
    };

    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();
        setCollections(data.collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    const startCountProducts = async () => {
      for (let i = 0; i <= products.length; i++) {
        setCountTotalProducts(i);
        await new Promise((resolve) => setTimeout(resolve, 100)); // délai de 100ms pour chaque incrément
      }
    };

    const startCountUnity = async () => {
      for (let i = 0; i <= totalStock; i++) {
        setCountTotalUnity(i);
        await new Promise((resolve) => setTimeout(resolve, 50)); // délai de 100ms pour chaque incrément
      }
    };

    fetchCollections();
    fetchStock();
    startCountProducts();
    startCountUnity();
  }, [
    selectedCollection,
    products.length,
    totalStock,
    searchQuery,
    currentPage,
  ]);

  const handleCollectionClick = (collectionId) => {
    setSelectedCollection(collectionId === "all" ? "" : collectionId); // Si "all", on reset la sélection
  };

  const updateStock = async (id, newStock) => {
    try {
      const response = await fetch(`/api/stock/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, stock: newStock } : product
          )
        );

        setNotification({
          message: "Stock mis à jour avec succès!",
          type: "success",
        });

        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 5000);

        fetchStock();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock :", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white shadow relative px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Alert */}
        {notification.message && (
          <Alert
            severity={notification.type}
            className="fixed top-16 right-4 sm:right-6 md:right-10 z-50"
          >
            {notification.message}
          </Alert>
        )}

        {/* Titre */}
        <div className="border-b border-gray-300 pb-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">Stock</h2>
        </div>

        {/* Statistiques Stock Total */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <div className="flex items-center space-x-2">
            <p className="text-4xl sm:text-5xl font-bold text-blue-950">
              {countTotalProducts}
            </p>
            <span className="text-gray-600 font-semibold">produits</span>
          </div>
          <span className="hidden md:inline text-gray-600 font-semibold">
            |
          </span>
          <div className="flex items-center space-x-2">
            <p className="text-4xl sm:text-5xl font-bold text-blue-950">
              {countTotalUnity}
            </p>
            <span className="text-gray-600 font-semibold">unités</span>
          </div>
        </div>

        {/* Barre de progression des stocks */}
        <div className="space-y-4">
          <div className="flex space-x-1 w-full max-w-md">
            <motion.div
              className="bg-green-400 rounded h-2"
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.div
              className="bg-amber-400 rounded h-2"
              initial={{ width: 0 }}
              animate={{ width: "16%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.div
              className="bg-red-400 rounded h-2"
              initial={{ width: 0 }}
              animate={{ width: "32%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>

          {/* Légendes */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="bg-green-400 w-2 h-2 rounded-full"></div>
              <span className="text-sm text-gray-500">
                En stock :{" "}
                <span className="text-gray-950 font-bold">
                  {products.filter((product) => product.stock >= 10).length}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-amber-400 w-2 h-2 rounded-full"></div>
              <span className="text-sm text-gray-500">
                Stock faible :{" "}
                <span className="text-gray-950 font-bold">
                  {
                    products.filter(
                      (product) => product.stock < 10 && product.stock > 0
                    ).length
                  }
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-red-400 w-2 h-2 rounded-full"></div>
              <span className="text-sm text-gray-500">
                Rupture de stock :{" "}
                <span className="text-gray-950 font-bold">
                  {products.filter((product) => product.stock === 0).length}
                </span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="mt-8">
        {/* Barre de recherche + Filtres */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Recherche */}
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Bouton filtre */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800"
            >
              <IoFilter className="w-4 h-4 mr-2" />
              <span>Filtrer</span>
              {isOpen && (
                <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
              )}
            </button>

            {isOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50"
              >
                <div className="py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCollectionClick("all");
                    }}
                  >
                    Tous les produits
                  </a>
                  {collections.map((collection) => (
                    <a
                      key={collection.id}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCollectionClick(collection.id);
                      }}
                    >
                      {collection.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tableau responsive */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 w-8"></th>
                  <th className="p-3">Nom du produit</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Quantité</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className={`border-t ${
                        product.stock === 0
                          ? "bg-red-50"
                          : "bg-white hover:bg-blue-50"
                      }`}
                    >
                      <td className="text-center">
                        {product.stock < 5 && (
                          <FiAlertCircle
                            className="w-5 h-5 text-red-500"
                            onClick={handleOpenModal}
                          />
                        )}
                      </td>
                      <td className="p-3 flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <span>{product.name}</span>
                      </td>
                      <td className="p-3">
                        {product.stock === 0 ? (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md">
                            Rupture
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md">
                            Disponible
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateStock(
                                product.id,
                                Math.max(product.stock - 1, 0)
                              )
                            }
                            disabled={product.stock === 0}
                            className={`p-1 ${
                              product.stock === 0
                                ? "cursor-not-allowed"
                                : "hover:text-amber-500"
                            }`}
                          >
                            <GoDash className="w-4 h-4" />
                          </button>
                          <div
                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-semibold ${
                              product.stock >= 10
                                ? "border-blue-500"
                                : product.stock > 0
                                ? "border-amber-400"
                                : "border-red-500"
                            }`}
                          >
                            {product.stock}
                          </div>
                          <button
                            onClick={() =>
                              updateStock(product.id, product.stock + 1)
                            }
                            className="p-1 hover:text-amber-500"
                          >
                            <IoMdAdd className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 gap-4 sm:gap-0">
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            className="px-4 py-2 border rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </Layout>
  );
}
