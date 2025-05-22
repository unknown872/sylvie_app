import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { BsGlobeEuropeAfrica } from "react-icons/bs";
import { RiSendPlaneFill } from "react-icons/ri";
import HeroImage from "../../../public/HeroImage.png";
import Header from "@/components/user/Header";
import Banner from "@/components/user/Banner";
import Footer from "@/components/user/Footer";
function index() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [wishlist, setWishlist] = useState([]);

  const handleOpenCart = () => {
    setOpenCart(!openCart);
  };

  const handleClickOutside = (event) => {
    if (
      cartMenuRef.current &&
      !cartMenuRef.current.contains(event.target) &&
      !cartButtonRef.current.contains(event.target)
    ) {
      setOpenCart(false); // Ferme le menu si on clique en dehors
    }
  };

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage chaque fois qu'il change
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      const currentQuantity = updatedCart[existingProductIndex].quantity;

      // Vérifier si la quantité actuelle est inférieure à la quantité en stock
      if (currentQuantity < product.quant) {
        updatedCart[existingProductIndex].quantity += 1;
        setCart(updatedCart);
      }
    } else {
      // Ajouter un produit avec une quantité de 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart.filter((item) => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    // Mettre à jour le localStorage après suppression
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Charger la Whistle
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Ajouter à la liste des envies
  const addToWishlist = (product) => {
    const storedWishlist = [...wishlist];

    if (!storedWishlist.find((item) => item.id === product.id)) {
      const updatedWishlist = [...storedWishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      Swal.fire({
        icon: "success",
        title: "Ajouté à la liste des envies",
        text: `${product.name} a été ajouté avec succès !`,
      });
    } else {
      Swal.fire({
        icon: "info",
        title: "Déjà dans la liste des envies",
        text: `${product.name} est déjà dans votre liste.`,
      });
    }
  };

  // Vérifier si un produit est dans la wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Fonction pour calculer le total du panier
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const totalPrice = calculateTotalPrice();
  return (
    <>
      <Banner />
      <Header
        openCart={openCart}
        handleOpenCart={handleOpenCart}
        cartButtonRef={cartButtonRef}
        cartMenuRef={cartMenuRef}
        handleClickOutside={handleClickOutside}
        cart={cart}
      />
      <main>
        {/* Section Hero (Bannière) */}
        <div className="h-40 md:h-52 lg:h-60 overflow-hidden w-full border flex justify-center items-center relative">
          <Image
            src={HeroImage}
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
            className="w-full"
          />
          <div className="absolute text-white text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins">
              Contactez-nous
            </h2>
            <p className="text-sm md:text-base">
              Pour toute réclamation ou support
            </p>
          </div>
        </div>

        {/* Conteneur principal */}
        <div className="flex flex-col md:flex-row py-6 lg:py-10 mx-4 md:mx-8 lg:mx-10">
          {/* Formulaire de contact */}
          <div className="w-full md:w-1/2 md:px-6 lg:px-10">
            <div
              id="contact-us"
              className="overflow-hidden bg-white px-2 dark:bg-slate-900"
            >
              <div className="relative mx-auto max-w-xl">
                <div className="mt-2">
                  <form className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-600 dark:text-slate-400"
                      >
                        Prénom et Nom
                      </label>
                      <div className="mt-1">
                        <input
                          name="name"
                          type="text"
                          id="name"
                          autoComplete="organization"
                          required
                          className="border border-gray-300 block w-full rounded-md py-3 px-4 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-white/5 dark:bg-slate-700/50 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="tel"
                        className="block text-sm font-medium text-gray-600 dark:text-slate-400"
                      >
                        Téléphone
                      </label>
                      <div className="mt-1">
                        <input
                          name="tel"
                          id="tel"
                          required
                          type="tel"
                          autoComplete="tel"
                          className="border border-gray-300 block w-full rounded-md py-3 px-4 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-white/5 dark:bg-slate-700/50 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-600 dark:text-slate-400"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          name="email"
                          id="email"
                          required
                          type="email"
                          autoComplete="email"
                          className="border border-gray-300 block w-full rounded-md py-3 px-4 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-white/5 dark:bg-slate-700/50 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-600 dark:text-slate-400"
                      >
                        Message
                      </label>
                      <div className="mt-1">
                        <textarea
                          required
                          name="message"
                          id="message"
                          rows="4"
                          className="border border-gray-300 block w-full rounded-md py-3 px-4 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:border-white/5 dark:bg-slate-700/50 dark:text-white"
                        ></textarea>
                      </div>
                    </div>
                    <div className="flex justify-end sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex space-x-1 items-center rounded-md px-4 py-2 font-medium focus:outline-none focus-visible:ring focus-visible:ring-sky-500 shadow-sm sm:text-sm transition-colors duration-75 text-sky-500 border border-sky-500 hover:bg-sky-50 active:bg-sky-100 disabled:bg-sky-100 dark:hover:bg-gray-900 dark:active:bg-gray-800 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                      >
                        <RiSendPlaneFill />
                        <span>Envoyer</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="border-l border-gray-300 dark:border-gray-700 h-0 md:h-auto w-full md:w-px my-6 md:my-0 md:mx-6 lg:mx-8"></div>

          {/* Informations de contact */}
          <div className="w-full md:w-1/2 text-gray-600 font-poppins px-4 md:px-6 lg:px-10">
            <div className="space-y-2">
              <p className="text-xl md:text-2xl font-semibold">
                Envoyez-nous un message
              </p>
              <p className="text-sm md:text-base">
                Nous vous reviendrons au plus vite !
              </p>
            </div>
            <div className="space-y-6 pt-6">
              <div className="flex items-center space-x-2">
                <FaLocationDot className="w-6 h-6" />
                <span>Médina 31x2 bis</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="w-6 h-6" />
                <span>(+221) 78 101 61 71</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="w-6 h-6" />
                <span>senteurdesylvie@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <BsGlobeEuropeAfrica className="w-6 h-6" />
                <span>www.senteurdesylvie.com</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default index;
