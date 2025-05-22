import React, { useState, useEffect, useRef } from "react";
import HeroImage from "../../../public/HeroImage.png";
import Image from "next/image";
import Header from "@/components/user/Header";
import Banner from "@/components/user/Banner";
import Footer from "@/components/user/Footer";

function Index() {
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
        <div className="h-40 sm:h-60 overflow-hidden w-full border flex justify-center items-center relative">
          <Image
            src={HeroImage}
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
            className="w-full"
          />
          <div className="absolute text-white text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins">À propos</h2>
            <p className="text-sm md:text-base">
              Une sensation de merveille olfactive
            </p>
          </div>
        </div>

        {/* Section de contenu */}
        <div className="flex flex-col items-center py-6 sm:py-10 space-y-6 px-4 sm:px-6">
          <div className="w-full max-w-3xl leading-relaxed">
            <h2 className="relative uppercase text-center font-poppins text-lg sm:text-xl">
              Les Senteurs de Sylvie
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 sm:w-24 h-1 bg-yellow-500 rounded"></div>
            </h2>
          </div>

          {/* Contenu de la page */}
          <div className="flex flex-col items-center py-6 sm:py-10 px-4 sm:px-6 space-y-6 md:space-y-0">
            <div className="flex md:flex-row flex-col">
              <div className="md:w-1/2 w-full">
                <Image
                  src="/about/img_about2.webp"
                  alt="Sylvie"
                  width={800}
                  height={400}
                />
              </div>
              <div className="md:w-1/2 w-full">
                <div className="md:px-8 px-0 md:mt-6 mt-4 space-y-6">
                  <p className="text-sm sm:text-base/7 font-poppins text-gray-600 font-semibold">
                    Notre boutique en ligne réunit trois experts passionnés pour
                    vous offrir une sélection de parfums de qualité supérieure
                  </p>
                  <ul className="text-sm md:text-base list-item list-inside mt-4 sm:mt-6 md:space-y-4 space-y-2">
                    <li className="text-sm sm:text-base/7 font-poppins text-gray-600">
                      Un créateur de fragrances – sélectionnant les meilleures
                      senteurs.
                    </li>
                    <li className="text-sm sm:text-base/7 font-poppins text-gray-600">
                      Un spécialiste des matières premières – garantissant
                      l’excellence de chaque parfum.
                    </li>
                    <li className="text-sm sm:text-base/7 font-poppins text-gray-600">
                      Un professionnel de la distribution – veillant à la
                      qualité de notre service et à votre satisfaction.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col-reverse">
              <div className="md:w-1/2 w-full md:p-4 md:mt-6 mt-4 space-y-6">
                <p className="text-sm sm:text-xl font-bold font-poppins text-gray-600">
                  "Le réflexe de choisir un parfum autrement."
                </p>
                <div className="space-y-4">
                  <p className="text-sm sm:text-base/7 font-poppins text-gray-600">
                    Notre boutique se veut être une référence, une véritable
                    envie. Elle doit inspirer le réflexe de choisir un parfum
                    unique. Le parfum n’est pas dans le classique, mais dans
                    l’originalité, le caractère et l’envie de se démarquer. Nos
                    sélections sont modernes, élégantes et raffinées.
                  </p>
                  <p className="text-sm sm:text-base/7 font-poppins text-gray-600">
                    Nous nous adressons à une clientèle moderne et dynamique, à
                    celle qui souhaite se sentir spéciale, différente, en
                    choisissant des parfums qui l’accompagnent tout au long de
                    sa journée.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 w-full">
                <Image
                  src="/about/img_about3.webp"
                  alt="Sylvie"
                  width={800}
                  height={500}
                />
              </div>
            </div>
          </div>
          {/* Vidéo YouTube */}
          <div className="w-full max-w-4xl aspect-video px-4 sm:px-0">
            <iframe
              className="w-full h-full rounded-lg sm:rounded-xl"
              src="https://www.youtube.com/embed/Hu20-7vY5Zs"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Index;
