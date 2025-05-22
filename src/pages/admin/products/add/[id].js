import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const UpdateProductForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [volume, setVolume] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState(null);
  const [otherImage, setOtherImage] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const [collections, setCollections] = useState([]);
  const [imageName, setImageName] = useState("");
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
  const [imagePreview, setImagePreview] = useState(product.image || "");
  const [otherImagePreview, setOtherImagePreview] = useState(
    product.other_image || ""
  );
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return; // Assurez-vous que l'ID est chargé avant de faire la requête
      try {
        const response = await fetch(`/api/products/${id}`);
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
        // Ne pas définir les images directement dans les états
        // car elles sont des fichiers à traiter au moment du formulaire.
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      }
    }

    async function fetchCollections() {
      const response = await fetch("/api/collections");
      const data = await response.json();
      setCollections(data.collections);
    }

    fetchProduct();
    fetchCollections();
  }, [id]);

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
    setOtherImage(e.target.files[0]);
    // Utilisez FileReader pour générer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setOtherImagePreview(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("volume", volume);
    formData.append("collectionId", collectionId);
    formData.append("brand", brand);
    formData.append("image", image);
    if (otherImage) {
      formData.append("other_image", otherImage); // Ajouter l'autre image si elle est présente
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        // Assurez-vous que l'ID est correct ou dynamique
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Produit mis à jour avec succès!");
      } else {
        setMessage(data.error || "Erreur lors de la mise à jour du produit.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setMessage("Erreur serveur.");
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
    <div>
      <h1>Mettre à jour le produit</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Volume</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Collection</label>
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image</label>
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Image Preview"
              width={100}
              height={100}
            />
          ) : product.image ? (
            <Image
              src={product.image}
              alt="Image Preview"
              width={100}
              height={100}
            />
          ) : (
            <p>Aucune image disponible</p>
          )}
          <p>{imageName}</p>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
        </div>

        <div>
          <label>Other Image</label>
          {otherImagePreview ? (
            <div>
              <Image
                src={otherImagePreview} // Chemin vers l'autre image actuelle
                alt="Current other image"
                width={100}
                height={100}
              />
              <p>{otherImagePreview}</p>
            </div>
          ) : product.other_image ? (
            <div>
              <Image
                src={product.other_image} // Chemin vers l'autre image actuelle
                alt="Current other image"
                width={100}
                height={100}
              />
              <p>{product.other_image}</p>
            </div>
          ) : (
            <p>Aucune autre image disponible</p>
          )}
          <input
            type="file"
            onChange={handleOtherImageChange}
            accept="image/png,image/jpeg"
          />
        </div>
        <div>
          <button type="submit">Mettre à jour le produit</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateProductForm;
