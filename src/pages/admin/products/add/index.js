import React, { useState, useEffect } from "react";
import Layout from "@/components/admin/layout/layout";
import { GoDash } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { BiSolidImageAdd } from "react-icons/bi";
import { Alert } from "@mui/material";
import { FaHome, FaRegSave } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { MdKeyboardArrowRight } from "react-icons/md";

function index() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(1);
  const [volume, setVolume] = useState(0);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [otherImage, setOtherImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [collectionId, setCollectionId] = useState("");
  const [collections, setCollections] = useState([]);
  const [imageName, setImageName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  const handleOtherImageChange = (e) => {
    setOtherImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setNotification({
        message: "La Premiere image est obligatoire.",
        type: "error",
      });
      return;
    }

    if (!name || !description || !price || !brand || !stock || !volume || !category ) {
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
    formData.append("category", category);
    formData.append("collectionId", collectionId);
    formData.append("image", image);
    if (otherImage) {
      formData.append("other_image", otherImage); // Ajouter l'autre image si elle est présente
    }

    try {
      const response = await fetch("/api/products/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNotification({
          message: "Produit ajouté avec succès!",
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
        setOtherImage(null);

        // Redirection vers les details du nouveau produit
        window.location.href = `/admin/products/${data.id}`;
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
      <div className="flex items-center justify-end mb-4 text-sm space-x-2">
        <Link href="/admin/dashboard">
          <FaHome className="w-5 h-5" />
        </Link>
        <MdKeyboardArrowRight className="w-5 h-5" />
        <Link href="/admin/products">
          <span className="font-semibold cursor-pointer">Produits</span>
        </Link>
        <MdKeyboardArrowRight className="w-5 h-5" />
        <span className="text-gray-600">Ajouter un produit</span>
      </div>
      {/* Formulaire directement dans le flux de la page */}
      <div className="bg-white shadow-gray-300 shadow-lg relative">
        {notification.message && (
          <Alert
            severity={notification.type}
            className="mb- fixed top-16 right-0"
          >
            {notification.message}
          </Alert>
        )}
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold ">Ajouter un produit</h3>
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
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6">
                  <div className="w-full">
                    <label
                      className="flex justify-center w-full h-32 px-4 transition overflow-hidden bg-blue-50 border-2 border-blue-200 border-dashed rounded-md appearance-none cursor-pointer hover:border-cyan-600 focus:outline-none"
                      htmlFor="input"
                    >
                      <span className="flex flex-col justify-center items-center space-x-2">
                        {image ? (
                          // Si une image est sélectionnée, afficher l'aperçu de l'image
                          <Image
                            alt="Aperçu de l'image"
                            src={URL.createObjectURL(image)}
                            width={70}
                            height={70}
                          />
                        ) : (
                          // Si aucune image n'est sélectionnée, afficher l'icône
                          <BiSolidImageAdd className="w-12 h-12 text-gray-600" />
                        )}
                        {imageName ? (
                          <span className="font-medium text-gray-700">
                            Nom de l'image : {imageName}
                          </span>
                        ) : (
                          <span className="font-medium text-gray-600">
                            Cliquez ici pour charger une image
                          </span>
                        )}
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
                <div className="col-span-6 w-full">
                  <label
                    htmlFor="product-name"
                    className="text-sm font-medium text-gray-600 block mb-2"
                  >
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="product-name"
                    id="product-name"
                    className="shadow-sm border text-gray-900 sm:text-sm rounded-sm focus:ring-cyan-600 focus:outline-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Entrer le nom du produit"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
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
                    placeholder="Entrez le nom de la marque"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
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
                      onChange={(e) => setPrice(e.target.value)}
                      name="price"
                      id="price"
                      className="pl-12 shadow-sm  border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-cyan-600 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="collection"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Collection
                  </label>
                  <select
                    id="collection"
                    name="collection"
                    onChange={(e) => setCollectionId(e.target.value)}
                    required
                    className="shadow-sm cursor-pointer border border-gray-300 sm:text-sm rounded-sm focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  >
                    <option value="" className="text-gray-300">
                      Sélectionner une collection
                    </option>
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
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Catégorie
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="shadow-sm  border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Stock du produit
                  </label>
                  <div className="flex items-center">
                    {/* Bouton - */}
                    <button
                      type="button"
                      onClick={() => setStock((prev) => Math.max(0, prev - 1))} // Décrémenter le stock, mais ne pas passer en dessous de 0
                      className="px-2 py-3 rounded-l-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <GoDash />
                    </button>

                    {/* Input de stock */}
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      name="stock"
                      id="stock"
                      className="border-y-2 pl-6 border-gray-200 text-gray-900 sm:text-sm focus:ring-cyan-600 focus:border-cyan-600 block w-20 p-2.5 text-center"
                      placeholder="0"
                      required
                    />

                    {/* Bouton + */}
                    <button
                      type="button"
                      onClick={() => setStock((prev) => prev + 1)} // Incrémenter le stock
                      className="px-2 py-3 rounded-r-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="volume"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Contenance (ml)
                  </label>
                  <div className="flex items-center">
                    {/* Bouton - */}
                    <button
                      type="button"
                      onClick={() => setVolume((prev) => Math.max(0, prev - 1))} // Décrémenter le stock, mais ne pas passer en dessous de 0
                      className="px-2 py-3 rounded-l-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <GoDash />
                    </button>

                    {/* Input de stock */}
                    <input
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      name="volume"
                      id="volume"
                      className="border-y-2 pl-6 border-gray-200 text-gray-700 sm:text-sm focus:ring-cyan-600 focus:border-cyan-600 block w-20 p-2.5 text-center"
                      placeholder="0"
                      required
                    />

                    {/* Bouton + */}
                    <button
                      type="button"
                      onClick={() => setVolume((prev) => prev + 1)} // Incrémenter le stock
                      className="px-2 py-3 rounded-r-sm border-2 border-gray-200 text-gray-600 focus:outline-none"
                    >
                      <IoMdAdd />
                    </button>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    className="block text-sm font-bold mb-2"
                    htmlFor="other-image"
                  >
                    Nouvelle image (facultatif)
                  </label>
                  {otherImage ? (
                    // Si une image est sélectionnée, afficher l'aperçu de l'image
                    <Image
                      src={URL.createObjectURL(otherImage)}
                      alt="Aperçu de l'image"
                      width={70}
                      height={70}
                      className="rounded-md mb-2"
                    />
                  ) : (
                    // Si aucune image n'est sélectionnée, afficher l'icône
                    <BiSolidImageAdd className="w-12 h-12 text-gray-600" />
                  )}
                  <label class="block">
                    <span class="sr-only">Choose profile photo</span>
                    <input
                      type="file"
                      id="other-image"
                      name="other-image"
                      onChange={handleOtherImageChange}
                      class="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-blue-700
                    hover:file:bg-violet-100"
                    />
                  </label>
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="product-description"
                    className="text-sm font-medium text-gray-700 block mb-2"
                  >
                    Description du produit
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="product-description"
                    name="product-description"
                    rows="6"
                    className="bg-gray-50 border border-gray-300 focus:outline-blue-600 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4"
                    placeholder="Description"
                  ></textarea>
                </div>
              </div>

              {/* Footer du formulaire */}
              <div className="py-6 border-t border-gray-200 rounded-b">
                <button
                  className="flex items-center space-x-1 justify-center text-white bg-blue-600 hover:bg-gradient-to-r from-blue-800 to-amber-500 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
