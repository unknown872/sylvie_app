import React, { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import { FaFilter, FaTimes } from "react-icons/fa";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaSortAmountDownAlt } from "react-icons/fa";
import HeroImage from "../../../../public/HeroImage.png";
import Header from "@/components/user/Header";
import Banner from "@/components/user/Banner";
import { useRouter } from "next/router";
import Footer from "@/components/user/Footer";
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { set } from "react-hook-form";

function index() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0); // Initialisé à 0 ou une valeur par défaut
  const [loading, setLoading] = useState(false);
  // Utilisation de useEffect pour s'assurer que l'accès à 'window' se fait uniquement côté client
  useEffect(() => {
    // Vérifier si l'objet window est disponible
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth); // Mettre à jour la largeur de l'écran
    }
  }, []); // Cette logique s'exécute uniquement au montage (côté client)

  // Faire appel à l'API pour obtenir les produits
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `/api/products?search=${searchQuery}&category=homme`
      );
      const data = await response.json();
      setProducts(data.products);
      setIsLoading(false);
      console.log("Mes donnees : ", data.products);
    };
    fetchProducts();
  }, [searchQuery]);

  // Fonction pour rechercher un produit par son nom avec un le mot clé
  // Fonction pour rechercher un produit par son nom via l'API
  const searchProduct = async (keyword) => {
    if (!keyword) {
      // Si le mot-clé est vide, on remet tous les produits
      const response = await fetch(`/api/products?category=homme`);
      const data = await response.json();
      setProducts(data.products);
    } else {
      const normalizedKeyword = normalizeText(keyword);
      // Recherche dans l'API avec le mot-clé
      const response = await fetch(`/api/products?search=${normalizedKeyword}&category=homme`);
      const data = await response.json();
      setProducts(data.products);
    }
  };

  // Fonction pour gérer la modification du mot-clé de recherche
  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
    searchProduct(event.target.value); // Appel de la fonction de recherche dès que l'utilisateur tape
  };

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
      if (currentQuantity < product.stock) {
        updatedCart[existingProductIndex].quantity += 1;
        setCart(updatedCart);

        // Mettre à jour le localStorage
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Notification de succès
        setNotification({
          message: "Quantité mise à jour dans le panier",
          type: "success",
        });
        setLoading(true);

        setTimeout(() => {
          setNotification({ message: "", type: "" });
          setLoading(false);
        }, 3000);
      } else {
        // Notification d'erreur si stock épuisé
        setNotification({
          message: "Stock insuffisant pour ajouter ce produit",
          type: "error",
        });
        setLoading(true);

        setTimeout(() => {
          setNotification({ message: "", type: "" });
          setLoading(false);
        }, 3000);
      }
    } else {
      if (product.stock > 0) {
        // Ajouter un produit avec une quantité de 1
        const newCart = [...cart, { ...product, quantity: 1 }];
        setCart(newCart);

        // Mettre à jour le localStorage
        localStorage.setItem("cart", JSON.stringify(newCart));

        // Notification de succès
        setNotification({
          message: "Produit ajouté au panier",
          type: "success",
        });
        setLoading(true);
        setTimeout(() => {
          setNotification({ message: "", type: "" });
          setLoading(false);
        }, 3000);
      } else {
        // Notification d'erreur si stock épuisé
        setNotification({
          message: "Ce produit est en rupture de stock",
          type: "error",
        });
        setLoading(true);
        setTimeout(() => {
          setNotification({ message: "", type: "" });
          setLoading(false);
        }, 3000);
      }
    }
  };

  // Fonction pour augmenter la quantité d'un produit dans le panier
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  // Fonction pour diminuer la quantité d'un produit dans le panier
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart.filter((item) => item.quantity > 0));
  };

  // Fonction pour supprimer un produit du panier
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

  const normalizeText = (text) => {
    return text
      .normalize("NFD") // Normalisation en forme décomposée
      .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .toLowerCase(); // Convertit en minuscules
  };

  const isNewProduct = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInDays = (now - created) / (1000 * 60 * 60 * 24); // ms to days
    return diffInDays <= 5;
  };

  return (
    <>
      <Banner />
      <Header
        products={products}
        openCart={openCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        handleOpenCart={handleOpenCart}
        cartButtonRef={cartButtonRef}
        cartMenuRef={cartMenuRef}
        handleClickOutside={handleClickOutside}
        cart={cart}
      />
      <main>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="bg-gray-100 relative"
        >
          {notification.message && (
            <div className="w-80 md:w-96 rounded-lg shadow-lg z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white overflow-hidden">
              {/* Barre de chargement */}
              {loading && (
                <div className="w-full bg-gray-200 h-1">
                  <div
                    className="bg-amber-400 h-1 origin-left transition-transform duration-1000 ease-in-out"
                    style={{
                      animation: "progressBar 3s ease-in-out infinite",
                    }}
                  />
                </div>
              )}

              <div
                className={`flex items-center p-4 ${
                  notification.type === "success"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                <button
                  onClick={() => setNotification({ message: "", type: "" })}
                  className="absolute top-2 right-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                  aria-label="Fermer"
                >
                  <IoIosClose className="text-white text-xl" />
                </button>

                <div className="flex items-center space-x-3">
                  {notification.type === "success" ? (
                    <BsCheckCircle className="text-xl flex-shrink-0" />
                  ) : (
                    <BsExclamationCircle className="text-xl flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">
                    {notification.message}
                  </span>
                </div>
              </div>
            </div>
          )}
          {/* Section Hero */}
          <div className="h-40 sm:h-60 overflow-hidden w-full border flex justify-center items-center relative">
            <Image
              src={HeroImage}
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
              className="w-full"
            />
            <div className="absolute text-white text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins">
                Parfum pour Homme
              </h2>
              <p className="text-sm md:text-base">
                Une sensation de merveille olfactive
              </p>
            </div>
          </div>
          <div className="">
            <div className="p-4 bg-white">
              <div className="flex flex-col sm:flex-row justify-between  space-y-4 sm:space-y-0">
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 font-poppins text-sm px-4 py-2 bg-cyan-200 rounded">
                    <FaFilter />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 font-poppins text-sm px-4 py-2 bg-cyan-200 rounded">
                    <span>Sort by</span>
                    <FaSortAmountDownAlt />
                  </button>
                </div>
                <div className="relative text-gray-500 focus-within:text-gray-900 w-full sm:w-auto">
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
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    id="default-search"
                    className="block w-full sm:w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded placeholder-gray-400 focus:outline-none"
                    placeholder="Rechercher un produit"
                  />
                </div>
              </div>
            </div>
            {/* Liste des produits */}
            {products.length === 0 && (
              <div className="flex justify-center items-center h-96">
                <h1 className="text-xl font-poppins">Aucun produit trouvé</h1>
              </div>
            )}
            <div className="py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-4 gap-y-8 px-4">
              {products.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="md:mx-2 bg-bgColor rounded shadow-lg relative hover:shadow-xl transition duration-200 group"
                  >
                    <div className="flex flex-col justify-center items-center">
                      <div
                        className="relative w-full h-80 cursor-pointer"
                        onClick={() => {
                          router.push({
                            pathname: `/product/${product.id}`,
                          });
                        }}
                      >
                        <Image
                          src={product.image}
                          alt="product"
                          layout="fill"
                          className="transition-opacity object-cover duration-500 ease-in-out group-hover:opacity-0"
                        />
                        <Image
                          src={product?.other_image || product?.image}
                          alt="product-hover"
                          layout="fill"
                          className="absolute inset-0 object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                        />
                      </div>
                      {/* Badge de nouveauté */}
                      {isNewProduct(product.createdAt) && (
                        <div className="bg-news text-white rounded absolute top-0 left-0 font-poppins text-sm px-1 md:px-4">
                          Nouveauté
                        </div>
                      )}
                      <div className="absolute top-1 right-1 md:hidden">
                        <span className="bg-slate-300 text-white rounded-full font-poppins text-sm p-1">
                          {product?.volume} ML
                        </span>
                      </div>
                      <div className="flex flex-col py-2 bg-white w-full">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock < 1}
                          className={`hidden md:flex justify-center items-center space-x-1 absolute bottom-16 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 w-full px-4 py-2 bg-black text-white opacity-0 group-hover:opacity-100 transition duration-500 ease-out ${
                            product.stock < 1
                              ? "bg-gray-400 cursor-not-allowed"
                              : "hover:bg-amber-400"
                          }`}
                        >
                          {product.stock < 1 ? (
                            <span>Rupture de Stock</span>
                          ) : (
                            <div className="hidden md:flex space-x-1 items-center">
                              <LiaShoppingBagSolid />
                              <span>Ajouter au panier</span>
                            </div>
                          )}
                        </button>
                        {/* Bouton d'ajout au panier pour mobile */}
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock < 1}
                          className={`md:hidden flex justify-center items-center space-x-1 absolute bottom-16 w-full px-4 py-2 bg-black text-white ${
                            product.stock < 1
                              ? "bg-gray-400 cursor-not-allowed"
                              : "hover:bg-amber-400"
                          }`}
                        >
                          {product.stock < 1 ? (
                            <span>Rupture de Stock</span>
                          ) : (
                            <div className="flex space-x-1 items-center">
                              <LiaShoppingBagSolid />
                              <span>Ajouter au panier</span>
                            </div>
                          )}
                        </button>
                        <p className="text-gray-700 font-thin text-center mb-2">
                          {product?.volume} ML
                        </p>
                        <div className="pl-4 h-full">
                          <h3
                            className="font-poppins text-sm text-gray-600 cursor-pointer hover:text-amber-400"
                            onClick={() => {
                              router.push(`/product/${product.id}`);
                            }}
                          >
                            {screenWidth < 768 &&
                              `${product.name.slice(0, 19)}...`}
                            {screenWidth > 768 &&
                              `${product.name.slice(0, 30)}...`}
                          </h3>
                          <p className="text-gray-900 text-lg font-semibold font-poppins">
                            {new Intl.NumberFormat("fr-FR", {
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                              style: "currency",
                              currency: "CFA",
                            }).format(product.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </>
  );
}

export default index;
