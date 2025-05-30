"use client";
import Layout from "@/components/admin/layout/layout";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { Alert } from "@mui/material";
import Swal from "sweetalert2";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import { MdCategory } from "react-icons/md";
import { motion } from "framer-motion";
import { BiLoaderAlt } from "react-icons/bi";

export default function index() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const [totalPages, setTotalPages] = useState(1); // Total de pages
  const [pageSize, setPageSize] = useState(5); // Nombre d'éléments par page
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCollection, setEditCollection] = useState({ id: null, name: "" });
  const [count, setCount] = useState(0);

  const handleOpen = () => setOpenAddModal(true);
  const handleClose = () => setOpenAddModal(false);

  const openEditModal = (collection) => {
    setEditCollection({ id: collection.id, name: collection.name });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditCollection({ id: null, name: "" });
    setEditModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/collections/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const result = await response.json();

    if (response.ok) {
      setNotification({
        message: "Collection ajoutée avec succès!",
        type: "success",
      });
      setIsLoading(false);
      const fetchCollections = async () => {
        try {
          const response = await fetch(
            `/api/collections?search=${searchQuery}&page=${currentPage}&pageSize=${pageSize}`
          );
          const data = await response.json();
          setCollections(data.collections); // Mettre à jour la liste des collections
          setTotalPages(data.totalPages);
          //setLoading(false);
        } catch (error) {
          console.error("Erreur lors du chargement des collections", error);
          //setLoading(false);
        } finally {
          setLoading(false);
          setIsLoading(false);
        }
      };

      fetchCollections(); // Récupère les collections mises à jour
      setOpenAddModal(false);
      setName("");
    } else {
      //Affichage de la notification
      setNotification({
        message: "Une erreur est survenue, réessayez.",
        type: "error",
      });
    }
    // Réinitialiser la notification après un délai
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  // Suppression d'une collection
  const handleDelete = async (id) => {
    // Affiche une confirmation SweetAlert2
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/collections/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Mise à jour locale après suppression
          setCollections((prevCollections) =>
            prevCollections.filter((collection) => collection.id !== id)
          );
          //Affichage de la notification
          setNotification({
            message: "Collection supprimée avec succès!",
            type: "success",
          });
          // Réinitialiser la notification après un délai
          setTimeout(() => {
            setNotification({ message: "", type: "" });
          }, 3000);
          const fetchCollections = async () => {
            try {
              const response = await fetch(
                `/api/collections?search=${searchQuery}&page=${currentPage}&pageSize=${pageSize}`
              );
              const data = await response.json();
              setCollections(data.collections); // Mettre à jour la liste des collections
              setTotalPages(data.totalPages);
              setLoading(false);
            } catch (error) {
              console.error("Erreur lors du chargement des collections", error);
              setLoading(false);
            }
          };

          fetchCollections();
        } else {
          console.error(
            "Erreur lors de la suppression :",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      } finally{
        setIsLoading(false);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/collections/${editCollection.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editCollection.name }),
      });

      if (response.ok) {
        const updated = await response.json();
        console.log("Collection mise à jour :", updated);
        setCollections((prev) =>
          prev.map((col) =>
            col.id === editCollection.id ? updated.updatedItem : col
          )
        );
        closeEditModal();
        //Affichage de la notification
        setNotification({
          message: "Collection modifiée avec succès!",
          type: "success",
        });
        // Réinitialiser la notification après un délai
        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 3000);
      } else {
        console.error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          `/api/collections?search=${searchQuery}&page=${currentPage}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setCollections(data.collections);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des collections :", error);
        setLoading(false);
      }
    };

    fetchCollections();
  }, [searchQuery, currentPage, pageSize]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  useEffect(() => {
    const startCount = async () => {
      for (let i = 0; i <= collections.length; i++) {
        setCount(i);
        await new Promise((resolve) => setTimeout(resolve, 100)); // délai de 100ms pour chaque incrément
      }
    };

    startCount();
  }, [collections.length]);

  if (isLoading) {
    <Layout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    </Layout>;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white shadow relative"
      >
        {notification.message && (
          <Alert
            severity={notification.type}
            className="mb- fixed top-16 right-0"
          >
            {notification.message}
          </Alert>
        )}
        <div className="divide-y divide-gray-200">
          {/* En-tête */}
          <div className="flex rounded-t">
            <h3 className="text-xl font-semibold p-6">Collections</h3>
          </div>

          {/* Statistiques */}
          <div className="flex justify-start p-6 divide-x divide-gray-300 space-x-4">
            <div className="flex space-x-4">
              <div>
                <div
                  className="text-amber-400 rounded-full bg-blue-50 p-1.5"
                  size="lg"
                >
                  <MdCategory className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col ml-4 space-y-2">
                <h2 className="font-semibold text-gray-500 text-lg">
                  Total Collections
                </h2>
                <div className="text-2xl text-blue-950 font-bold">
                  {count}{" "}
                  <span>
                    {collections.length < 1 ? "collection" : "collections"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche et boutons */}
          <div className="flex flex-col p-4">
            <div className="overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="flex items-center md:justify-between space-x-6 w-full mb-6">
                  {/* Barre de recherche */}
                  <div className="relative text-gray-500 focus-within:text-gray-900">
                    <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                          stroke="#9CA3AF"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="default-search"
                      className="block cursor-pointer w-full md:w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-sm placeholder-gray-400 focus:outline-none"
                      placeholder="Rechercher une collection..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Boutons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleOpen}
                      className="px-4 py-2 hidden md:block min-w-[120px] text-center text-white bg-amber-400 hover:bg-gradient-to-r from-blue-800 to-amber-500 rounded-sm"
                    >
                      <div className="flex items-center space-x-1">
                        <IoMdAdd className="w-6 h-6" />
                        <span>Ajouter une collection</span>
                      </div>
                    </button>
                    <button
                      onClick={handleOpen}
                      className="px-2 py-2 md:hidden block text-white border hover:border-amber-500 rounded bg-amber-500"
                    >
                      <IoMdAdd className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Tableau */}
                <div className="overflow-hidden">
                  {loading ? (
                    <div className="flex-col gap-4 w-full mt-8 flex items-center justify-center">
                      <div className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full">
                        <div className="w-16 h-16 border-4 border-transparent text-amber-500 text-2xl animate-spin flex items-center justify-center border-t-amber-500 rounded-full"></div>
                      </div>
                    </div>
                  ) : (
                    <table className="min-w-full rounded-xl overflow-x-auto">
                      <thead>
                        <tr className="bg-gray-100">
                          <th
                            scope="col"
                            className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                          >
                            Collection
                          </th>
                          <th
                            scope="col"
                            className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                          >
                            Date de création
                          </th>
                          <th
                            scope="col"
                            className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                          >
                            Date de modification
                          </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                        {collections.length === 0 || !collections ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="p-5 text-center text-sm font-medium text-gray-500"
                            >
                              Aucun résultat trouvé.
                            </td>
                          </tr>
                        ) : (
                          collections.map((collection, index) => (
                            <tr
                              key={collection.id}
                              className="bg-white cursor-default transition-all duration-500 hover:bg-blue-100 text-gray-900 hover:text-white"
                            >
                              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium">
                                {collection.name}
                              </td>
                              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium">
                                {formatDate(collection.createdAt)}
                              </td>
                              <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium">
                                {formatDate(collection.updatedAt)}
                              </td>
                              <td className="p-5">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => openEditModal(collection)}
                                    className="p-2 text-blue-500 hover:text-blue-900 rounded-full group transition-all duration-500 flex item-center"
                                  >
                                    <FiEdit className="w-5 h-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(collection.id)}
                                    className="p-2 text-amber-400 hover:text-amber-700 rounded-full group transition-all duration-500 flex item-center"
                                  >
                                    <FiTrash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Pagination */}
                  <div className="flex justify-between items-center space-x-4 shadow-black shadow-lg mt-6 border py-4 px-8">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-1">
                        <IoIosArrowBack />
                        <span>Précédent</span>
                      </div>
                    </button>
                    <span className="text-gray-600">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Suivant</span>
                        <IoIosArrowForward />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal pour ajouter une collection */}
          {openAddModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={handleClose}
            >
              <div
                className="bg-white w-[20rem] rounded-md relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">
                    Ajouter une collection
                  </h2>
                  <IoMdCloseCircle
                    className="w-6 h-6 cursor-pointer"
                    onClick={handleClose}
                  />
                </div>
                <form onSubmit={handleSubmit} className="p-4 bg-white rounded">
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="name"
                    >
                      Nom de la collection
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                      placeholder="Nom de la collection"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-gradient-to-r flex items-center from-blue-800 to-amber-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Ajouter{" "}
                    {isLoading ? (
                      <BiLoaderAlt className="animate-spin text-white" />
                    ) : (
                      ""
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Modal pour modifier une collection */}
          {editModalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={closeEditModal}
            >
              <div
                className="bg-white p-4 w-[20rem] relative rounded-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold mb-4">
                    Modifier une collection
                  </h2>
                  <IoMdCloseCircle
                    className="w-6 h-6 cursor-pointer"
                    onClick={closeEditModal}
                  />
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="editName"
                      className="block text-sm font-medium mb-2"
                    >
                      Nom de la collection
                    </label>
                    <input
                      type="text"
                      id="editName"
                      value={editCollection.name}
                      onChange={(e) =>
                        setEditCollection((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded focus:ring focus:ring-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Enregistrer{" "}
                    {isLoading ? (
                      <BiLoaderAlt className="animate-spin text-white" />
                    ) : (
                      ""
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
