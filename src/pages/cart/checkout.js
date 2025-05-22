import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Banner from "@/components/user/Banner";
import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";
import { Checkbox } from "@mui/material";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { CheckCircle, Gift, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  // Récupérer les prix et les informations de livraison
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryQuartier, setDeliveryQuartier] = useState([]);
  const [image, setImage] = useState("");
  const [otherImage, setOtherImage] = useState("");
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [confirmation, setConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const livraisonPrice = localStorage.getItem("livraisonPrice");
    const livraisonQuartier = localStorage.getItem("livraisonAddress");
    const storedCart = localStorage.getItem("cart");

    setDeliveryPrice(livraisonPrice ? JSON.parse(livraisonPrice) : 0);
    setDeliveryQuartier(livraisonQuartier ? JSON.parse(livraisonQuartier) : []);
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart.filter((item) => item.quantity > 0));
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleClickOutside = (event) => {
    if (
      cartMenuRef.current &&
      !cartMenuRef.current.contains(event.target) &&
      !cartButtonRef.current.contains(event.target)
    ) {
      setOpenCart(false); // Ferme le menu si on clique en dehors
    }
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const handleOpenCart = () => {
    setOpenCart(!openCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Fonction pour soumettre le formulaire de commande avec
  // les informations de l'utilisateur et les produits commandés
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const data = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      city: form.get("city"),
      address: form.get("address"),
      phone: form.get("phone"),
      email: form.get("email"),
      notes: form.get("notes"),
      products: cart,
      deliveryQuartier: deliveryQuartier,
      deliveryPrice: deliveryPrice,
      totalPrice: totalPrice + deliveryPrice,
    };
    console.log("Données du formulaire :", data);

    try {
      setIsLoading(true); // Démarrer le chargement
      // Envoi de la commande à l'API
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Si la réponse est OK, on traite la réponse
        const result = await response.json();
        console.log("Commande soumise avec succès :", result);
        clearCart(); // Vider le panier après soumission réussie
        // Enregistrer les informations du formulaire (prenom, nom, etc) dans le localStorage
        localStorage.setItem("formData", JSON.stringify(data));
        setConfirmation(true);
      } else {
        const error = await response.json();
        console.error("Erreur lors de la soumission :", error.message);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    } finally {
      setIsLoading(false); // Arrêter le chargement
    }
  };

  const handleRedirect = () => {
    router.push("/shop");
    setConfirmation(false);
  };

  console.log("Panier :", cart);

  return (
    <>
      <Banner />
      <Header
        openCart={openCart}
        handleOpenCart={handleOpenCart}
        handleClickOutside={handleClickOutside}
        cartButtonRef={cartButtonRef}
        cartMenuRef={cartMenuRef}
        cart={cart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
      />
      <main className="font-poppins">
        {cart.length > 0 && (
          <div className="font-poppins space-y-10 py-10">
            <h2 className="text-3xl font-bold font-poppins ml-10">Commande</h2>
            <div className="flex flex-col lg:flex-row px-4 lg:px-10 space-y-6 lg:space-y-0 lg:space-x-10">
              <div className="w-full lg:w-4/6 space-y-4">
                <h3 className="font-semibold text-lg">Details - Adresse</h3>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 w-full lg:w-[40rem]"
                >
                  <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="flex flex-col space-y-1.5 w-full lg:w-1/2">
                      <label className="text-sm">
                        Prénom{" "}
                        <span className="text-red-500 font-bold ">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Votre Prénom"
                        className="border border-gray-700 text-sm px-4 py-3"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 w-full lg:w-1/2">
                      <label className="text-sm">
                        Nom{" "}
                        <span className="text-red-500 font-bold pl-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Votre Nom"
                        className="border border-gray-700 text-sm px-4 py-3"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="flex flex-col space-y-1.5 w-full lg:w-1/2">
                      <label className="text-sm">
                        Ville{" "}
                        <span className="text-red-500 font-bold pl-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Ville"
                        className="border border-gray-700 text-sm px-4 py-3"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 w-full lg:w-1/2">
                      <label className="text-sm">
                        Adresse{" "}
                        <span className="text-red-500 font-bold pl-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Adresse"
                        className="border border-gray-700 text-sm px-4 py-3"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm">
                      Téléphone{" "}
                      <span className="text-red-500 font-bold pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Téléphone"
                      className="border border-gray-700 text-sm px-4 py-3"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm">
                      E-mail{" "}
                      <span className="text-red-500 font-bold pl-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      placeholder="E-mail"
                      className="border border-gray-700 text-sm px-4 py-3"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm">
                      Notes de commande (facultatif)
                    </label>
                    <textarea
                      name="notes"
                      placeholder="Laissez un message pour votre commande, Ex: Lieu de livraison, heure de livraison, etc."
                      className="border border-gray-300 text-sm px-4 py-3"
                      cols={2}
                      rows={6}
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-6 bg-amber-400 uppercase text-white py-4 w-full md:static md:w-auto md:mt-0 fixed bottom-0 left-0 right-0 z-10 md:z-0"
                  >
                    Commander
                  </button>
                </form>
              </div>
              <div className="w-full lg:w-3/6 space-y-4">
                <h3 className="font-semibold text-lg">Votre Commande</h3>
                <div className="flex flex-col">
                  <div className="flex text-sm justify-between p-4 bg-slate-100 border-b-0 border border-gray-300">
                    <p>Produits</p>
                    <p>Sous-total</p>
                  </div>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex border-b-0 border space-x-4 border-gray-300 p-4 text-sm items-center justify-between w-full"
                    >
                      <div className="flex space-x-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <p>
                          {item.name}{" "}
                          <span className="font-bold">x {item.quantity}</span>
                        </p>
                      </div>
                      <p className="font-bold">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "XOF",
                        }).format(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  <div className="flex text-sm justify-between p-4 border-b-0 border border-gray-300">
                    <p>Sous-total</p>
                    <p className="font-bold">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      }).format(totalPrice)}
                    </p>
                  </div>
                  <div className="flex text-sm justify-between p-4 border-b-0 border border-gray-300">
                    <p>Expédition</p>
                    <p>{deliveryQuartier.join(", ")}</p>
                  </div>
                  <div className="flex text-sm justify-between p-4 border border-gray-300">
                    <p>Total</p>
                    <p className="font-bold">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "XOF",
                      }).format(totalPrice + deliveryPrice)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col h-auto w-auto border border-gray-300 bg-slate-200 p-4">
                  <div>
                    <Checkbox className="text-amber-500" color="" checked />
                    <span className="text-sm">Paiement à la livraison</span>
                  </div>
                  <span className="text-sm pl-10">
                    Régler en espèces lors de la livraison.
                  </span>
                </div>
                <div className="flex flex-col space-y-2 h-auto w-auto border border-gray-300 bg-slate-200 p-4">
                  <div>
                    <Checkbox className="text-amber-500" color="" disabled />
                    <span className="text-sm">Paiement par Mobile Money</span>
                  </div>
                  <div className="flex space-x-4 pl-10">
                    <img
                      src="/mobile-money/orange-money.webp"
                      alt="momo"
                      className="rounded-sm w-16 h-16 cursor-pointer hover:-translate-y-2"
                    />
                    <img
                      src="/mobile-money/wave.webp"
                      alt="orange"
                      className="rounded-sm w-16 h-16 cursor-pointer hover:-translate-y-2"
                    />
                  </div>
                  <span className="text-sm pl-10 text-red-600">
                    Cette option n'est pas encore disponible!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {cart.length === 0 && (
          <div className="w-full flex flex-col space-y-6 md:justify-normal md:pt-14 justify-center items-center text-center h-96">
            <div className="flex flex-col justify-center items-center">
              <PiShoppingCartSimpleLight className="text-6xl text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600">
                Votre panier est vide
              </h3>
            </div>
            <button
              onClick={() => router.push("/shop")}
              className="bg-amber-400 text-white py-2 px-4 mt-4 w-auto"
            >
              Continuer vos achats
            </button>
          </div>
        )}
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-24 w-24 animate-spin rounded-full border-4 border-t-transparent border-orange-500"></div>
              <p className="text-white text-lg">
                Traitement de votre commande...
              </p>
            </div>
          </div>
        )}

        {/* Confirmation de commande */}
        {confirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm px-4">
            {/* Conteneur principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-3xl shadow-2xl w-[90%] sm:max-w-md overflow-hidden"
            >
              {/* En-tête coloré */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 relative overflow-hidden">
                {/* Effets visuels d'arrière-plan */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white bg-opacity-20 rounded-full blur-lg"></div>
                <div className="absolute right-12 top-12 w-16 h-16 bg-white bg-opacity-20 rounded-full blur-lg"></div>

                {/* Icône centrale animée */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                  className="flex justify-center mb-4"
                >
                  <div className="bg-white rounded-full p-4 shadow-lg">
                    <CheckCircle size={40} className="text-amber-500" />
                  </div>
                </motion.div>

                {/* Titre principal */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
                  Commande confirmée !
                </h2>
              </div>

              {/* Corps */}
              <div className="p-6 space-y-4">
                {/* Message de confirmation */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-gray-700 text-center text-base sm:text-lg"
                >
                  Nous avons bien reçu votre commande. Un e-mail de confirmation
                  a été envoyé à votre adresse.
                </motion.p>

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                  {/* Bouton principal */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRedirect}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center shadow-md"
                  >
                    Continuer mes achats
                  </motion.button>

                  {/* Bouton secondaire */}
                  <button
                    onClick={() => console.log("Voir la commande")}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium transition-colors hover:bg-gray-50 flex items-center justify-center"
                  >
                    Voir ma commande
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
