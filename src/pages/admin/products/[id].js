import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "@/components/admin/layout/layout";
import { FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Link from "next/link";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Alert, CircularProgress } from "@mui/material";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

export default function Details() {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [volume, setVolume] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [brand, setBrand] = useState("");
  const [imageName, setImageName] = useState("");
  const [otherImage, setOtherImage] = useState(null);
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [fadeKey, setFadeKey] = useState(0);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return; // S'assurer que l'ID est chargé avant de faire la requête
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setNotification({ message: "Produit introuvable", type: "error" });
          } else {
            setNotification({  message: "Une erreur s'est produite", type: "error" });
          }
          return;
        }

        const data = await response.json();
        setProduct(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setVolume(data.volume);
        setBrand(data.brand);
        setCollectionId(data.collectionId);
        setImageName(data.image);
        setOtherImage(data.other_image);
        setMainImage(data.image);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Fonction pour mettre à jour l'image principale avec animation
  const updateMainImage = (image) => {
    setMainImage(image);
    setFadeKey(fadeKey + 1);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const result = await Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer ce produit ?",
        icon: "warning",
        text: "Cette action est irréversible !",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Non, annuler",
      });

      if (result.isConfirmed) {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setNotification({
            message: "Produit supprimé avec succès",
            type: "success",
          });

          setTimeout(() => {
            setNotification({ message: "", type: "" });
            router.push("/admin/products");
          }, 2000);
        } else if (response.status === 400) {
          setNotification({
            message: "Ce produit ne peut pas étre supprimé",
            type: "error",
          });
        } else {
          setNotification({
            message: "Une erreur est survenue lors de la suppression",
            type: "error",
          });

          setTimeout(() => {
            setNotification({ message: "", type: "" });
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    } finally {
      setLoading(false);
    }
  };

  // Formatter le prix avec un séparateur de milliers
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
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
      {notification.message && (
        <Alert
          severity={notification.type}
          className="fixed top-16 right-4 z-50 shadow-xl"
        >
          {notification.message}
        </Alert>
      )}

      {/* Breadcrumb */}
      <div className="bg-white px-6 py-3 mb-6 rounded-lg shadow-sm">
        <div className="flex items-center text-sm">
          <Link
            href="/admin/dashboard"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            <FaHome className="w-4 h-4" />
          </Link>
          <MdKeyboardArrowRight className="w-4 h-4 text-gray-400 mx-2" />
          <Link
            href="/admin/products"
            className="text-gray-500 hover:text-blue-600 transition"
          >
            Produits
          </Link>
          <MdKeyboardArrowRight className="w-4 h-4 text-gray-400 mx-2" />
          <span className="text-blue-600 font-medium">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Header with actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <a onClick={() => router.back()} className="flex-grow cursor-pointer sm:flex-grow-0">
                <span className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm w-full">
                  <IoArrowBackCircleOutline className="w-4 h-4 mr-2" />
                  <span>Retour</span>
                </span>
              </a>
              <Link
                href={`/admin/products/edit/${product.id}`}
                className="flex-grow sm:flex-grow-0"
              >
                <span className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm w-full">
                  <FaEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span>Modifier</span>
                </span>
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm text-sm flex-grow sm:flex-grow-0"
              >
                <FaTrashCan className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                <Zoom zoomMargin={40} wrapStyle={{ width: "100%" }}>
                  <Image
                    key={fadeKey}
                    width={600}
                    height={600}
                    src={mainImage || product.image}
                    alt={product.name}
                    className="object-contain max-h-96 transition-all duration-300"
                  />
                </Zoom>
              </div>

              <div className="p-4 flex justify-center gap-4">
                <div
                  onClick={() => updateMainImage(product.image)}
                  className={`p-1 cursor-pointer ${
                    mainImage === product.image
                      ? "ring-2 ring-blue-500"
                      : "hover:ring-2 hover:ring-blue-300"
                  } rounded-md transition-all duration-200`}
                >
                  <Image
                    width={80}
                    height={80}
                    src={product.image}
                    alt="Image principale"
                    className="object-cover w-20 h-20 rounded"
                  />
                </div>

                {product.other_image && (
                  <div
                    onClick={() => updateMainImage(product.other_image)}
                    className={`p-1 cursor-pointer ${
                      mainImage === product.other_image
                        ? "ring-2 ring-blue-500"
                        : "hover:ring-2 hover:ring-blue-300"
                    } rounded-md transition-all duration-200`}
                  >
                    <Image
                      width={80}
                      height={80}
                      src={product.other_image}
                      alt="Image secondaire"
                      className="object-cover w-20 h-20 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm h-full">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  Informations
                </h2>
                <p className="text-sm text-gray-500">Détails du produit</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Prix</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(product.price)} CFA
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Catégorie</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.collection?.name || "Non catégorisé"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Stock</span>
                  <span
                    className={`font-medium ${
                      parseInt(product.stock) > 20
                        ? "text-green-600"
                        : parseInt(product.stock) > 5
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock}{" "}
                    {parseInt(product.stock) <= 1 ? "unité" : "unités"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Volume</span>
                  <span className="text-gray-700">{product.volume} ML</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Marque</span>
                  <span className="text-gray-700">
                    {product.brand || "Non spécifiée"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Date d'ajout</span>
                  <span className="text-gray-700">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Description</h2>
          </div>
          <div className="p-6">
            <div className="prose max-w-none">
              {product.description ? (
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Aucune description disponible
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
