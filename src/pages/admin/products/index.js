"use client";
import Layout from "@/components/admin/layout/layout";
import React, { useEffect, useState } from "react";
import { IoMdAdd, IoMdAddCircleOutline } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { Alert } from "@mui/material";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Create from "./add/create";
import { IoEyeOutline, IoFilter } from "react-icons/io5";
import { PiEye, PiEyeBold } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import Link from "next/link";
import { TiArrowUnsorted } from "react-icons/ti";
import { HiOutlineFilter } from "react-icons/hi";
import { CgSortAz } from "react-icons/cg";
import Image from "next/image";
import { AiFillProduct } from "react-icons/ai";
import { FaRegMoneyBill1 } from "react-icons/fa6";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";

export default function index() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Page courante
  const [totalPages, setTotalPages] = useState(1); // Total de pages
  const [pageSize, setPageSize] = useState(10); // Nombre d'éléments par page
  const [selectedProduct, setSelectedProduct] = useState(null); // Produit sélectionné pour le modal
  const [modalVisible, setModalVisible] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCollection, setEditCollection] = useState({ id: null, name: "" });
  const router = useRouter();
  const [mainImage, setMainImage] = useState(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [countStock, setCountStock] = useState(0);
  const [countStockValue, setStockValue] = useState(0);

  const handleOpen = () => setOpenAddModal(true);
  const handleClose = () => setOpenAddModal(false);

  const totalValue = products.reduce(
    (total, product) => total + product?.price * product?.stock,
    0
  );

  const totalStock = products.reduce(
    (total, product) => total + product?.stock,
    0
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?search=${searchQuery}&page=${currentPage}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, currentPage, pageSize]);

  useEffect(() => {
    const startCount = async () => {
      for (let i = 0; i <= totalStock; i++) {
        setCountStock(i);
        await new Promise((resolve) => setTimeout(resolve, 100)); // délai de 100ms pour chaque incrément
      }
    };

    startCount();
  }, [totalStock]);

  return (
    <Layout>
      <div className="flex flex-col py-2 z-50">
        {notification.message && (
          <Alert
            severity={notification.type}
            className="mb- fixed top-16 right-0"
          >
            {notification.message}
          </Alert>
        )}
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 1, ease: "anticipate" }}
          className="bg-white mr-0 md:mr-4 shadow-xl shadow-slate-300 divide-y divide-gray-300"
        >
          <div className="flex items-start justify-between p-4">
            <h3 className="text-xl font-semibold">Produits</h3>
          </div>
          {/* Section des statistiques */}
          <div className="flex flex-col md:flex-row justify-start p-3 md:p-6 divide-y md:divide-y-0 md:divide-x divide-gray-300 space-y-4 md:space-y-0 md:space-x-4">
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1, ease: "anticipate" }}
              className="flex space-x-4 pt-2 md:pt-0"
            >
              <div>
                <div
                  className="text-amber-400 rounded-full bg-blue-50 p-1.5"
                  size="lg"
                >
                  <FaRegMoneyBillAlt className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col ml-4 space-y-2">
                <span className="font-semibold text-gray-500 text-base md:text-lg">
                  Valeur Totale
                </span>
                {/* Animation counter */}
                <motion.div
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "anticipate" }}
                  className="text-xl md:text-2xl text-blue-950 font-bold"
                >
                  {new Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(totalValue)}
                  <span> CFA</span>
                </motion.div>
              </div>
            </motion.div>
            <div className="pl-0 md:pl-4 pt-4 md:pt-0 space-y-2">
              <div className="flex items-center space-x-1">
                <motion.h2
                  initial={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  animate={{ opacity: 1 }}
                  className="text-lg md:text-xl text-blue-950 font-bold"
                >
                  {countStock}
                </motion.h2>
                <span className="text-xs md:text-sm text-gray-500 font-medium">
                  {totalStock > 1 ? "Produits" : "Produit"} en stock
                </span>
              </div>
              <div className="flex space-x-1">
                <motion.div
                  className="bg-green-400 rounded h-2"
                  initial={{ width: 0 }}
                  animate={{ width: "30%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
                <motion.div
                  className="bg-amber-400 rounded h-2"
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
                <motion.div
                  className="bg-red-400 rounded h-2"
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 2, ease: "anticipate" }}
                className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0"
              >
                <div className="flex items-center space-x-2">
                  <div className="bg-green-400 w-2 rounded-full h-2"></div>
                  <label className="text-gray-500 text-xs md:text-sm">
                    En Stock:{"  "}
                    <span className="text-gray-950 font-bold">
                      {products.filter((product) => product.stock >= 10).length}
                    </span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-400 w-2 rounded-full h-2"></div>
                  <label className="text-gray-500 text-xs md:text-sm">
                    Stock faible:{"  "}
                    <span className="text-gray-950 font-bold">
                      {
                        products.filter(
                          (product) => product.stock < 10 && product.stock > 0
                        ).length
                      }
                    </span>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-red-400 w-2 rounded-full h-2"></div>
                  <label className="text-gray-500 text-xs md:text-sm">
                    Rupture de Stock:{"  "}
                    <span className="text-gray-950 font-bold">
                      {products.filter((product) => product.stock === 0).length}
                    </span>
                  </label>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="">
            <div className="py-3 md:py-5 px-2 md:px-4 overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col md:flex-row items-center md:justify-between md:space-x-6 w-full mb-6 space-y-3 md:space-y-0"
                >
                  <div className="relative text-gray-500 focus-within:text-gray-900 w-full md:w-auto">
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
                        <path
                          d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z"
                          stroke="black"
                          strokeOpacity="0.2"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="default-search"
                      className="block w-full md:w-80 h-10 pr-5 pl-12 py-2.5 cursor-pointer hover:border-gray-600 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none"
                      placeholder="Rechercher un produit"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-between md:justify-end">
                    <Link href="/admin/products/add" className="w-auto">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 md:space-x-2 bg-blue-500 hover:bg-gradient-to-r from-blue-800 to-amber-500 text-white px-2 py-1.5 rounded-sm"
                      >
                        <IoMdAdd className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">
                          Ajouter un produit
                        </span>
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {loading ? (
                    <div className="flex-col gap-4 w-full mt-8 flex items-center justify-center">
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-20 h-20 border-4 border-transparent text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-500 rounded-full"
                      >
                        <div className="w-16 h-16 border-4 border-transparent text-amber-500 text-2xl animate-spin flex items-center justify-center border-t-amber-500 rounded-full"></div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <motion.table
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="min-w-full divide-y divide-gray-300 border-separate border-spacing-0 rounded-lg"
                      >
                        <thead className="hidden md:table-header-group">
                          <tr className="bg-slate-100">
                            <th
                              scope="col"
                              className="p-2 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-tl-lg"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Nom du produit</span>
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="p-2 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Catégorie</span>
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="p-2 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Quantité</span>
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="p-2 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                            >
                              <div className="flex items-center space-x-1">
                                <span>Prix</span>
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="p-2 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"
                            >
                              {" "}
                              Statut{" "}
                            </th>
                            <th className="px-4 py-2 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-tr-lg">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                          {products.length === 0 ? (
                            <tr>
                              <td
                                colSpan="10"
                                className="p-5 text-center text-sm font-medium text-gray-500"
                              >
                                Aucun résultat trouvé.
                              </td>
                            </tr>
                          ) : (
                            products.map((product, index) => (
                              <motion.tr
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                key={product.id}
                                className="bg-white transition-all duration-700 hover:bg-blue-100 text-gray-900"
                              >
                                {/* Version mobile - Affichage en carte */}
                                {/* Version mobile - Affichage en carte */}
                                <td className="md:hidden block py-4 px-2">
                                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white">
                                      <div className="flex items-center space-x-3">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                          <img
                                            src={product.image}
                                            alt={product.name}
                                            className="object-cover w-full h-full"
                                          />
                                          {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                              <span className="text-white text-xs font-bold px-1 py-0.5 rounded">
                                                RUPTURE
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="font-medium text-sm text-blue-900 line-clamp-1">
                                            {product.name}
                                          </span>
                                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit mt-1">
                                            {product.collection.name}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <div className="font-bold text-sm text-blue-900">
                                          {new Intl.NumberFormat("fr-FR", {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                          }).format(product.price)}
                                          <span className="text-xs ml-1">
                                            CFA
                                          </span>
                                        </div>
                                        {product.stock > 0 ? (
                                          <span className="text-green-500 text-xs flex items-center mt-1">
                                            <span className="w-2 h-2 mr-1 rounded-full bg-green-500"></span>
                                            Disponible
                                          </span>
                                        ) : (
                                          <span className="text-red-500 text-xs flex items-center mt-1">
                                            <span className="w-2 h-2 mr-1 rounded-full bg-red-500"></span>
                                            Rupture
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="p-3 border-t border-gray-100">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">
                                          Stock:
                                        </span>
                                        <span className="text-xs font-medium">
                                          {product.stock} /{" "}
                                          {product.initialStock}
                                        </span>
                                      </div>
                                      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                                        <div
                                          className={`h-2 rounded-full ${
                                            product.stock >= 10
                                              ? "bg-gradient-to-r from-blue-400 to-blue-600"
                                              : product.stock < 10 &&
                                                product.stock > 0
                                              ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                              : "bg-gradient-to-r from-red-400 to-red-600"
                                          }`}
                                          style={{
                                            width: `${Math.max(
                                              5,
                                              (product.stock /
                                                product.initialStock) *
                                                100
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>

                                      <div className="flex justify-between items-center pt-1">
                                        <div className="flex items-center space-x-1">
                                          <Link
                                            href={`/admin/products/${product.id}`}
                                          >
                                            <button className="p-1.5 text-white bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-300">
                                              <PiEyeBold className="w-3.5 h-3.5" />
                                            </button>
                                          </Link>
                                          <Link
                                            href={`/admin/products/edit/${product.id}`}
                                          >
                                            <button className="p-1.5 text-white bg-amber-500 hover:bg-amber-600 rounded-full transition-all duration-300">
                                              <TbEdit className="w-3.5 h-3.5" />
                                            </button>
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Version desktop - Affichage en table */}
                                <td className="hidden md:table-cell px-2 py-3 w-60 whitespace-normal text-sm leading-6 font-medium">
                                  <div className="flex space-x-2">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      width={60}
                                      height={60}
                                      className="object-contain w-30 h-30 rounded-md"
                                    />
                                    <span className="break-words">
                                      {product.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="hidden md:table-cell px-2 py-1 w-32 whitespace-nowrap text-sm leading-6 font-medium">
                                  {product.collection.name}
                                </td>
                                <td className="hidden md:table-cell px-6 py-1 w-32 whitespace-nowrap text-sm leading-6 font-medium">
                                  <div className="flex flex-col items-center space-y-2">
                                    <div className="text-gray-700 font-bold">
                                      <motion.span
                                        initial={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        animate={{ opacity: 1 }}
                                      >
                                        {product.stock}
                                      </motion.span>{" "}
                                      / {product.initialStock}
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full">
                                      <div
                                        className={`text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full ${
                                          product.stock >= 10
                                            ? "bg-blue-500"
                                            : product.stock < 10 &&
                                              product.stock > 0
                                            ? "bg-amber-500"
                                            : "bg-red-500"
                                        }`}
                                        style={{
                                          width: `${
                                            (product.stock /
                                              product.initialStock) *
                                            100
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="hidden md:table-cell px-2 py-1 w-32 whitespace-nowrap text-sm leading-6 font-medium">
                                  {new Intl.NumberFormat("fr-FR", {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  }).format(product.price)}
                                  <span> CFA</span>
                                </td>
                                <td className="hidden md:table-cell px-2 py-1 w-32 whitespace-nowrap text-sm leading-6 font-medium">
                                  {product.stock > 0 ? (
                                    <span className="text-green-400 bg-green-100 px-2 py-1 rounded-md">
                                      Disponible
                                    </span>
                                  ) : (
                                    <span className="text-red-500 bg-red-100 px-2 py-1 rounded-md">
                                      Rupture de stock
                                    </span>
                                  )}
                                </td>
                                <td className="hidden md:table-cell px-2 py-1 w-28">
                                  <div className="flex items-center gap-1">
                                    <Link
                                      href={`/admin/products/${product.id}`}
                                    >
                                      <button className="p-2 text-blue-600 hover:text-amber-500 rounded-full group transition-all duration-500 flex item-center">
                                        <PiEyeBold className="w-5 h-5" />
                                      </button>
                                    </Link>
                                    <Link
                                      href={`/admin/products/edit/${product.id}`}
                                    >
                                      <button className="p-2 text-blue-600 hover:text-amber-500 rounded-full group transition-all duration-500 flex item-center">
                                        <TbEdit className="w-5 h-5" />
                                      </button>
                                    </Link>
                                  </div>
                                </td>
                              </motion.tr>
                            ))
                          )}
                        </tbody>
                      </motion.table>
                    </div>
                  )}
                  {/* Pagination */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex justify-between items-center space-x-2 md:space-x-4 shadow-black shadow-lg mt-6 border py-3 md:py-4 px-2 md:px-8"
                  >
                    <motion.button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-2 md:px-4 py-1 md:py-2 border rounded disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base"
                    >
                      <div className="flex items-center space-x-1">
                        <IoIosArrowBack />
                        <span className="hidden md:inline">Précédent</span>
                      </div>
                    </motion.button>
                    <span className="text-gray-600 text-xs md:text-sm">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-2 md:px-4 py-1 md:py-2 border rounded disabled:cursor-not-allowed disabled:opacity-50 text-sm md:text-base"
                    >
                      <div className="flex items-center space-x-1">
                        <span className="hidden md:inline">Suivant</span>
                        <IoIosArrowForward />
                      </div>
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
