import React, { useState, useEffect } from "react";
import Layout from "@/components/admin/layout/layout";

function Create() {
  const [openAddModal, setOpenAddModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Nouveau champ description
  const [price, setPrice] = useState(""); // Nouveau champ prix
  const [brand, setBrand] = useState(""); // Nouveau champ marque
  const [stock, setStock] = useState(""); // Nouveau champ stock
  const [category, setCategory] = useState(""); // Nouveau champ catégorie
  const [volume, setVolume] = useState(""); // Nouveau champ volume
  const [image, setImage] = useState(null); // Utilisation de l'état pour l'image
  const [otherImage, setOtherImage] = useState(null); // Utilisation de l'état pour l'image
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [collectionId, setCollectionId] = useState(""); // Pour la collection sélectionnée
  const [collections, setCollections] = useState([]);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Récupérer le premier fichier sélectionné
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setNotification({
        message: "Veuillez sélectionner une image.",
        type: "error",
      });
      return;
    }

    // Vérification de la validité des autres champs
    if (!name || !description || !price || !brand || !stock || !volume || !category) {
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
    formData.append("image", image); // Ajouter l'image au FormData

    try {
      // Envoi des données vers l'API avec FormData pour gérer le fichier
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
        // Réinitialiser les champs du formulaire
        setName("");
        setDescription("");
        setPrice("");
        setBrand("");
        setStock("");
        setVolume("");
        setCategory("");
        setImage(null);
        setOtherImage(null);
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

  // Récupérer la liste des collections depuis l'API
  useEffect(() => {
    async function fetchCollections() {
      const response = await fetch("/api/collections/products"); // Assurez-vous d'avoir une route pour récupérer les collections
      const data = await response.json();
      setCollections(data.collections); // Remplir le tableau de collections
    }

    fetchCollections();
  }, []);

  return (
    <Layout>
      <div className="flex items-center mt-6 overflow-scroll justify-center z-50 bg-gray-500 bg-opacity-75">
        <div className="bg-white border-4 rounded-lg shadow relative m-10 w-1/2">
          {/* Modal Header */}
          <div className="flex items-start justify-between p-5 border-b rounded-t sticky">
            <h3 className="text-xl font-semibold">Ajouter un produit</h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="product-name"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="product-name"
                    id="product-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Entrer le nom du produit"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="collection"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Collection
                  </label>
                  <select
                    id="collection"
                    name="collection"
                    onChange={(e) => setCollectionId(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner une collection</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="brand"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Marque du Produit
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Entrez la marque"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Prix du produit
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    name="price"
                    id="price"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Entrez le prix"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Stock du produit
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    name="stock"
                    id="stock"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Entrez le stock"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="volume"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Volume (ml)
                  </label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    name="volume"
                    id="volume"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Entrez le volume"
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="volume"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Image
                  </label>
                  <input type="file" onChange={handleFileChange} required />
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="product-description"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    Description du produit
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="product-description"
                    rows="3"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                    placeholder="Description"
                  ></textarea>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 rounded-b">
                <button
                  className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  type="submit"
                >
                  Save all
                </button>
              </div>
            </form>
            {notification.message && (
              <div className={`notification ${notification.type}`}>
                {notification.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Create;
