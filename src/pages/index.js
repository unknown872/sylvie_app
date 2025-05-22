import React, { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import localFont from "next/font/local";
import Hero from "@/components/user/Hero";
import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";
import Services from "@/components/user/Services";
import Banner from "@/components/user/Banner";
import Collections from "@/components/user/Collections";
import NewItems from "@/components/user/NewItems";
import { FaWhatsapp } from "react-icons/fa";
import Man from "@/components/user/specials/Man";
import Woman from "@/components/user/specials/Woman";
import BestSellers from "@/components/user/BestSellers";
import First from "@/assets/eau-perfume.png";
import Second from "@/assets/beau-perfume.png";
import Third from "@/assets/bottle-parfum.png";
import Fourth from "@/assets/blue-orange.png";
import Firsts from "@/assets/Firsts.png";
import Seconds from "@/assets/Seconds.png";
import Thirds from "@/assets/Thirds.png";
import Fourths from "@/assets/Fouths.png";
import Swal from "sweetalert2";
import Loader from "@/components/user/Loader";
import { Alert } from "@mui/material";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Faire Appel l'API pour obtenir la liste des produits
  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.product);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  });

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
      }
    } else {
      // Ajouter un produit avec une quantité de 1
      setCart([...cart, { ...product, quantity: 1 }]);

      // Nouveau produit ajouté, afficher la notification
      setNotification({ message: "Produit ajouté au panier", type: "success" });

      // Mettre à jour le localStorage
      localStorage.setItem(
        "cart",
        JSON.stringify([...cart, { ...product, quantity: 1 }])
      );
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

  const clearCart = () => {
    setCart([]); // Vider le panier
    localStorage.removeItem("cart"); // Supprimer le panier du localStorage
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
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  // Fonction pour calculer la somme totale du panier
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Composants fixes */}
      <Banner />
      <Header
        openCart={openCart}
        handleOpenCart={handleOpenCart}
        cartButtonRef={cartButtonRef}
        cartMenuRef={cartMenuRef}
        handleClickOutside={handleClickOutside}
        cart={cart}
        addToCart={addToCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        totalPrice={totalPrice}
        clearCart={clearCart}
      />

      {/* Sections principales */}
      <main>
        <Hero />
        <Services />
        <Collections />

        {/* Sections de produits */}
        <NewItems
          addToCart={addToCart}
          cart={cart}
          addToWishlist={addToWishlist}
          isInWishlist={isInWishlist}
          wishlist={wishlist}
        />
        <Man products={products} addToCart={addToCart} />
        <Woman addToCart={addToCart} />
        <BestSellers addToCart={addToCart} cart={cart} />
      </main>
      <Footer />

      {/* Bouton WhatsApp */}
      <div className="fixed bottom-2 right-2 z-10">
        <button
          onClick={() => window.open("https://wa.me/221781016171")}
          type="button"
          className="text-white bg-green-500 p-2 rounded-lg"
        >
          <FaWhatsapp className="w-10 h-10" />
        </button>
      </div>
    </>
  );
}
