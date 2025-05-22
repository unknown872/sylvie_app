import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Header from "@/components/user/Header";
import Banner from "@/components/user/Banner";
import { BsArrowRight, BsTrash } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import Image from "next/image";
import Footer from "@/components/user/Footer";
import { FaShoppingCart } from "react-icons/fa";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

const Livraison = [
  {
    id: 1,
    zone: "Zone A",
    title: "Zone A",
    quartiers: ["Cité Keur Gorgui", "Mermoz", "Sacré Coeur"],
    price: 2000,
  },
  {
    id: 2,
    zone: "Zone B",
    title: "Zone B",
    quartiers: ["Point E", "Medina", "Colobane"],
    price: 1500,
  },
  {
    id: 3,
    zone: "Zone C",
    title: "Zone C",
    quartiers: ["Ouest Foire", "Nord Foire", "Yoff"],
    price: 2500,
  },
];

const CartPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [notificationAddress, setNotificationAddress] = useState({
    message: "",
    type: "",
  });
  const [selectedLivraison, setSelectedLivraison] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Fonction apres la suppression d'un produit du panier
  const handleRemoveProduct = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setNotification({ message: "Produit supprimé du panier", type: "success" });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

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

  // Calculer le total avec livraison
  const livraisonPrice = selectedLivraison
    ? Livraison.find((l) => l.id === parseInt(selectedLivraison))?.price || 0
    : 0;
  const totalWithDelivery = totalPrice + livraisonPrice;

  const livraisonAddress =
    Livraison.find((l) => l.id === parseInt(selectedLivraison))?.quartiers ||
    [];
  const handleCheckout = () => {
    if (selectedLivraison) {
      const livraison = Livraison.find(
        (l) => l.id === parseInt(selectedLivraison)
      );
      if (livraison) {
        localStorage.setItem("livraison", JSON.stringify(livraison));
        router.push("/cart/checkout");
        // Enregistrer livraisonAddress dans le localStorage
        localStorage.setItem(
          "livraisonAddress",
          JSON.stringify(livraisonAddress)
        );
        // Enregistrer le total avec livraison dans le localStorage
        localStorage.setItem(
          "totalWithDelivery",
          JSON.stringify(totalWithDelivery)
        );
        // Enregistrer le prix de la livraison dans le localStorage
        localStorage.setItem("livraisonPrice", JSON.stringify(livraisonPrice));
      }
    } else {
      setNotificationAddress({
        message: "Veuillez sélectionner une adresse de livraison",
        type: "error",
      });
    }
  };

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
        <div className="font-poppins space-y-0 md:space-y-10 py-10">
          {cart.length > 0 && (
            <h2 className="text-3xl font-bold font-poppins ml-5 md:ml-10">
              Panier
            </h2>
          )}
          {/* Notification */}
          {notification.message && (
            <div className="mt-12 mx-10 px-8 border-t-2 border-green-500 bg-green-50 md:max-w-full transition-all duration-500">
              <div className="flex justify-between py-3">
                <div className="flex">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 rounded-full text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="self-center ml-3 text-sm">
                    <span className="text-green-600 font-semibold">
                      Success
                    </span>
                    <p className="text-green-600 mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotification({ message: "", type: "" })}
                  className="self-start text-green-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-col lg:flex-row px-4 lg:px-10 space-y-6 lg:space-y-0 lg:space-x-10">
            {cart.length > 0 && (
              <>
                <div className="w-full lg:w-2/3 space-y-4">
                  {/* Cart Summary */}
                  <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full border">
                      <thead>
                        <tr className="bg-gray-100 text-base border">
                          <th className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                            Produit
                          </th>
                          <th className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                            Prix
                          </th>
                          <th className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                            Quantité
                          </th>
                          <th className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                            Total
                          </th>
                          <th className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                        {cart.length > 0 &&
                          cart.map((item) => (
                            <tr key={item.id}>
                              <td className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                                <div className="flex space-x-4 items-center">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-contain w-20 h-20 rounded-md"
                                  />
                                  <span className="break-words">
                                    {item.name}
                                  </span>
                                </div>
                              </td>
                              <td className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                                {new Intl.NumberFormat("fr-FR", {
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                  style: "currency",
                                  currency: "CFA",
                                }).format(item.price)}
                              </td>
                              <td className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                                <div className="flex gap-2 items-center">
                                  <button
                                    onClick={() => decreaseQuantity(item.id)}
                                    className={
                                      item.quantity > 1
                                        ? "text-white bg-amber-400 px-1 text-lg w-6 h-6 shadow-lg"
                                        : "cursor-not-allowed text-white bg-orange-200 px-1 text-lg w-6 h-6 shadow-lg"
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="w-6 font-semibold text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => increaseQuantity(item.id)}
                                    className={
                                      item.quantity < item.stock
                                        ? "text-white bg-amber-400 px-1 text-lg h-6 shadow-lg w-6"
                                        : "cursor-not-allowed pointer-events-none text-white bg-orange-200 px-1 w-6 text-lg h-6 shadow-lg"
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins font-semibold text-gray-900 capitalize">
                                {new Intl.NumberFormat("fr-FR", {
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                  style: "currency",
                                  currency: "CFA",
                                }).format(item.price * item.quantity)}
                              </td>
                              <td className="p-2 lg:p-5 text-left text-sm leading-6 font-poppins text-gray-900 capitalize">
                                <button
                                  className="text-gray-400 hover:text-amber-400"
                                  onClick={() => handleRemoveProduct(item.id)}
                                >
                                  <BsTrash size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Mobile Cart Summary */}
                  <div className="flex flex-col space-y-4 divide-y divide-gray-300 border-gray-300 border md:hidden">
                    {cart.length > 0 &&
                      cart.map((item) => (
                        <div className="flex justify-between items-center text-sm h-auto p-4">
                          <div className="flex space-x-4 items-start">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="object-contain w-20 h-20 rounded-md"
                            />
                            <div className="flex flex-col space-y-2">
                              <span className="font-semibold">{item.name}</span>
                              <span className="text-gray-500">
                                {new Intl.NumberFormat("fr-FR", {
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                  style: "currency",
                                  currency: "CFA",
                                }).format(item.price)}
                              </span>
                              <div className="flex gap-2 items-center">
                                <button
                                  onClick={() => decreaseQuantity(item.id)}
                                  className={
                                    item.quantity > 1
                                      ? "text-white bg-amber-400 px-1 text-lg w-6 h-6 shadow-lg"
                                      : "cursor-not-allowed text-white bg-orange-200 px-1 text-lg w-6 h-6 shadow-lg"
                                  }
                                >
                                  -
                                </button>
                                <span className="w-6 font-semibold text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => increaseQuantity(item.id)}
                                  className={
                                    item.quantity < item.stock
                                      ? "text-white bg-amber-400 px-1 text-lg h-6 shadow-lg w-6"
                                      : "cursor-not-allowed pointer-events-none text-white bg-orange-200 px-1 w-6 text-lg h-6 shadow-lg"
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-semibold">
                                {new Intl.NumberFormat("fr-FR", {
                                  maximumFractionDigits: 0,
                                  minimumFractionDigits: 0,
                                  style: "currency",
                                  currency: "CFA",
                                }).format(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <button
                              className="text-gray-400 hover:text-amber-400"
                              onClick={() => handleRemoveProduct(item.id)}
                            >
                              <BsTrash size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* Boutons de navigation */}
                  <div className="hidden md:flex justify-between">
                    <button
                      onClick={() => router.push("/shop")}
                      className="flex items-center text-gray-500 space-x-2 hover:text-amber-400 cursor-pointer"
                    >
                      <BsArrowLeft size={20} />
                      <span>Continuer vos achats</span>
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex items-center text-gray-500 space-x-2 hover:text-amber-400 cursor-pointer"
                    >
                      <span>Passer la commande</span>
                      <BsArrowRight size={20} />
                    </button>
                  </div>
                </div>
                {/* Section de résumé */}
                <div className="w-full lg:w-1/3">
                  <div className="p-6 bg-gray-200 border-gray-200">
                    <h3 className="font-semibold mb-3">Total Panier</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Sous-total</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("fr-FR", {
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                            style: "currency",
                            currency: "CFA",
                          }).format(totalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Livraison</span>
                        <div className="overflow-hidden">
                          <select
                            className="border border-gray-300 p-1 w-full"
                            value={selectedLivraison || ""}
                            onChange={(e) =>
                              setSelectedLivraison(e.target.value)
                            }
                          >
                            <option value="">
                              Selectionnez une adresse de livraison
                            </option>
                            {Livraison.map((liv) => (
                              <option
                                key={liv.id}
                                value={liv.id}
                                className="capitalize"
                              >
                                {liv.quartiers.join(", ")} - {liv.price}CFA
                              </option>
                            ))}
                          </select>
                          <p className="text-red-600 mt-1 text-xs">
                            {notificationAddress.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mt-4">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        {new Intl.NumberFormat("fr-FR", {
                          maximumFractionDigits: 0,
                          minimumFractionDigits: 0,
                          style: "currency",
                          currency: "CFA",
                        }).format(totalWithDelivery)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="bg-amber-400 text-white w-full p-3 mt-2 md:static fixed bottom-0 left-0 right-0 z-10"
                  >
                    Commander
                  </button>
                  <button
                    onClick={clearCart}
                    className="bg-gray-200 text-gray-500 w-full p-3 mt-2 hidden md:block"
                  >
                    Vider le panier
                  </button>
                </div>
              </>
            )}
            {cart.length === 0 && (
              <div className="w-full flex flex-col space-y-6 md:justify-start justify-center items-center text-center h-96">
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
          </div>
        </div>
      </main>
      <Footer /> // Ajout du footer
    </>
  );
};

export default CartPage;
