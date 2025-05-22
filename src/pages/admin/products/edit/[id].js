import React, { useState, useEffect } from "react";
import Layout from "@/components/admin/layout/layout";
import { GoDash } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { BiSolidImageAdd } from "react-icons/bi";
import { Alert } from "@mui/material";
import { FaRegSave } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";
import { set } from "react-hook-form";
import Image from "next/image";
import { FaHome } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";

function index() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(1);
  const [volume, setVolume] = useState(0);
  const [image, setImage] = useState(null);
  const [other_image, setOther_image] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [collectionId, setCollectionId] = useState("");
  const [collections, setCollections] = useState([]);
  const [imageName, setImageName] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    brand: "",
    stock: 1,
    volume: 0,
    image: null,
    other_image: null,
    collectionId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(product.image || "");
  const [otherImagePreview, setOtherImagePreview] = useState(
    product.other_image || ""
  );

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  const fetchProductDetails = async (productId) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setBrand(data.brand);
        setStock(data.stock);
        setVolume(data.volume);
        setImage(data.image);
        setOther_image(data.other_image);
        setCollectionId(data.collectionId);
      } else {
        console.error("Erreur lors du chargement des détails du produit");
        setError("Impossible de charger les détails du produit.");
      }
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setError("Une erreur est survenue lors du chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Utilisez FileReader pour générer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImageChange = (e) => {
    setOther_image(e.target.files[0]);
    // Utilisez FileReader pour générer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setOtherImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.image) {
      setNotification({
        message: "L'image principale est obligatoire.",
        type: "error",
      });
      return;
    }

    if (!name || !description || !price || !brand || !stock || !volume) {
      setNotification({
        message: "Tous les champs doivent être remplis.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("stock", stock);
    formData.append("volume", volume);
    formData.append("collectionId", collectionId);
    formData.append("image", image);
    if (other_image) {
      formData.append("other_image", other_image); // Ajouter l'autre image si elle est présente
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        // Utilisation de la méthode PUT
        method: "PUT", // Changement de la méthode POST à PUT
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNotification({
          message: "Produit mis  jour avec succès avec succès!",
          type: "success",
        });

        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 3000);

        setName("");
        setDescription("");
        setPrice(0);
        setBrand("");
        setStock(0);
        setVolume(0);
        setImage(null);
        setOther_image(null);
        setCollectionId("");

        //Redirection vers les details du produit mis à jour
        router.push(`/admin/products/${data.id}`);
      } else {
        const errorData = await response.json();
        setNotification({
          message: `Erreur : ${errorData.error}`,
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: `Erreur réseau : ${error.message}`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchCollections() {
      const response = await fetch("/api/collections");
      const data = await response.json();
      setCollections(data.collections);
    }

    fetchCollections();
  }, []);

  return (
    <Layout>
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
      {/* Formulaire directement dans le flux de la page */}
      <div className="bg-white border border-gray-300 rounded-xl shadow relative">
        {notification.message && (
          <Alert
            severity={notification.type}
            className="mb- fixed top-16 right-0"
          >
            {notification.message}
          </Alert>
        )}
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold ">Modifier un produit</h3>
          <Link href="/admin/products">
            <span className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md">
              <IoArrowBackCircleOutline className="w-5 h-5" />
              <span>Retour</span>
            </span>
          </Link>
        </div>
        <div className="flex lg:space-x-6">
          <div className="w-1/4 p-6 lg:block hidden">
            <div className="space-y-10">
              <div className="flex flex-col space-y-1">
                <label className="text-black">
                  <div className="flex space-x-1">
                    <FaCircleInfo className="w-6 h-6" />
                    <span className="font-semibold">Infos Images</span>
                  </div>
                </label>
                <p className="text-gray-600 text-sm/relaxed">
                  <span className="block mb-1">
                    Les images doivent avoir une taille minimale de 500x500
                    pixels.
                  </span>
                  Téléchargez des images de haute qualité du produit sous
                  plusieurs angles
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-black">
                  <div className="flex space-x-1">
                    <FaCircleInfo className="w-6 h-6" />
                    <span className="font-semibold whitespace-normal">
                      Infos Produits
                    </span>
                  </div>
                </label>
                <p className="text-gray-600 text-sm/relaxed">
                  <span className="block mb-1">
                    Remplissez le formulaire avec les informations données.
                  </span>
                  Vous pouvez aussi ajouter une image supplémentaire.
                </p>
              </div>
            </div>
          </div>
          <div className="md:p-6 p-2 space-y-6 w-full">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Champ pour l'image principale */}
                <div className="col-span-full md:col-span-6">
                  <div className="w-full">
                    <label
                      className="flex justify-center w-full h-32 px-4 transition bg-blue-50 border-2 border-blue-200 border-dashed rounded-md appearance-none cursor-pointer hover:border-cyan-600 focus:outline-none"
                      htmlFor="input"
                    >
                      <span className="flex flex-col justify-center items-center space-x-2 overflow-hidden">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Image Preview"
                            className="rounded-md"
                            width={70}
                            height={70}
                          />
                        ) : product.image ? (
                          <Image
                            src={product.image}
                            alt="Image Preview"
                            className="rounded-md"
                            width={70}
                            height={70}
                          />
                        ) : (
                          <p className="text-sm text-gray-600">
                            Aucune image disponible
                          </p>
                        )}
                        <p className="text-gray-600 font-semibold text-sm">
                          Cliquez ici pour changer d'image
                        </p>
                      </span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        name="file_upload"
                        className="hidden"
                        accept="image/png,image/jpeg"
                        id="input"
                      />
                    </label>
                  </div>
                </div>

                {/* Nom du produit */}
                <div className="col-span-full md:col-span-6">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600 block mb-2"
                  >
                    Nom du Produit
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    className="shadow-sm border text-gray-900 sm:text-sm rounded-sm focus:ring-cyan-600 focus:outline-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    required
                  />
                </div>

                {/* Prix et Collection */}
                <div className="col-span-full md:col-span-3">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Prix du produit
                  </label>
                  <div className="relative mt-2 max-w-xs text-gray-500">
                    <span className="h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
                      CFA
                    </span>
                    <input
                      type="number"
                      value={price}
                      name="price"
                      id="price"
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-12 shadow-sm border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-cyan-600 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="col-span-full md:col-span-3">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Collection
                  </label>
                  <select
                    name="collectionId"
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    required
                    className="shadow-sm border border-gray-300 sm:text-sm rounded-sm focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  >
                    {collections.map((collection) => (
                      <option
                        className="text-gray-900"
                        key={collection.id}
                        value={collection.id}
                      >
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marque, Stock et Contenance */}
                <div className="col-span-full md:col-span-6 sm:col-span-3">
                  <label
                    htmlFor="brand"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Marque du produit
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="shadow-sm border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-cyan-600 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="col-span-full md:col-span-3 sm:col-span-3">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Stock du produit
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setStock((prevStock) => Math.max(prevStock - 1, 0))
                      }
                      className="px-2 py-3 rounded-l-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <GoDash />
                    </button>
                    <input
                      type="text"
                      name="stock"
                      id="stock"
                      disabled
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="border-y-2 border-gray-200 text-gray-900 sm:text-sm focus:ring-cyan-600 focus:border-cyan-600 block w-20 p-2.5 text-center"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setStock((prevStock) => prevStock + 1)}
                      className="px-2 py-3 rounded-r-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                </div>
                <div className="col-span-full md:col-span-3 sm:col-span-3">
                  <label
                    htmlFor="volume"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Contenance (ml)
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVolume((prevVolume) => Math.max(prevVolume - 1, 0))
                      }
                      className="px-2 py-3 rounded-l-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <GoDash />
                    </button>
                    <input
                      type="text"
                      name="volume"
                      id="volume"
                      disabled
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="border-y-2 border-gray-200 text-gray-700 sm:text-sm focus:ring-cyan-600 focus:border-cyan-600 block w-20 p-2.5 text-center"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setVolume((prevVolume) => prevVolume + 1)}
                      className="px-2 py-3 rounded-r-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                </div>

                {/* Nouvelle image facultative */}
                <div className="col-span-full">
                  <div className="mb-4 space-y-2 cursor-pointer">
                    <label
                      className="block text-sm font-bold mb-2"
                      htmlFor="new-image"
                    >
                      Nouvelle image (facultatif)
                    </label>
                    {otherImagePreview ? (
                      <div>
                        <img
                          src={otherImagePreview}
                          alt="Preview"
                          width={70}
                          height={70}
                        />
                      </div>
                    ) : product.other_image ? (
                      <div>
                        <Image
                          src={product.other_image}
                          alt="Preview"
                          className="rounded-md"
                          width={70}
                          height={70}
                        />
                      </div>
                    ) : (
                      <p>Aucune autre image</p>
                    )}
                    <input
                      type="file"
                      id="new-image"
                      name="new-image"
                      accept="image/*"
                      onChange={handleOtherImageChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-blue-700 hover:file:bg-violet-100"
                    />
                  </div>
                </div>

                {/* Description du produit */}
                <div className="col-span-full">
                  <label
                    htmlFor="product-description"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Description du produit
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="6"
                    className="bg-gray-50 border border-gray-300 focus:outline-blue-600 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4"
                  ></textarea>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="py-6 border-t border-gray-200 rounded-b">
                <button
                  className="flex items-center space-x-1 justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full md:w-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <FaRegSave />
                  <span>
                    {isSubmitting ? "Enregistrement..." : "Sauvegarder"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default index;
