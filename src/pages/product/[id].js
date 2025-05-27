import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoAdd } from "react-icons/io5";
import { GoDash } from "react-icons/go";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { BsDashLg } from "react-icons/bs";
import Header from "@/components/user/Header";
import Banner from "@/components/user/Banner";
import { Alert } from "@mui/material";
import Footer from "@/components/user/Footer";
import { TbArrowBack } from "react-icons/tb";
import { LiaShoppingBagSolid } from "react-icons/lia";
import Loader from "@/components/user/loaders/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Info, MapPin, Truck } from "lucide-react";

const tarifsLivraison = [
  {
    zone: "Zone A",
    quartier: "Cité Keur Gorgui, Mermoz, Sacré Coeur",
    tarif: "2000 CFA",
  },
  { zone: "Zone B", quartier: "Point E, Medina, Colobane", tarif: "1500 CFA" },
  {
    zone: "Zone C",
    quartier: "Ouest Foire, Nord Foire, Yoff",
    tarif: "2500 CFA",
  },
];

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(false);
  const [livraison, setLivraison] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [activeTab, setActiveTab] = useState("description");
  const [screenWidth, setScreenWidth] = useState(0);
  // Utilisation de useEffect pour s'assurer que l'accès à 'window' se fait uniquement côté client
  useEffect(() => {
    // Vérifier si l'objet window est disponible
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth); // Mettre à jour la largeur de l'écran
    }
  }, []); // Cette logique s'exécute uniquement au montage (côté client)

  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const cartMenuRef = useRef(null);
  const cartButtonRef = useRef(null);

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      setNotification({
        message: "La quantité maximale est atteinte.",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setNotification({
        message: "La quantité minimale est atteinte.",
        type: "error",
      });
      setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 5000);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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

  const getZoneBadgeVariant = (zone) => {
    switch (zone) {
      case "Zone A":
        return "default";
      case "Zone B":
        return "secondary";
      case "Zone C":
        return "outline";
      default:
        return "default";
    }
  };

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setProduct(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
          setIsLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
      }
    };

    fetchProducts();
  }, []);

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

  // Ajouter un écouteur d'événements pour les clics en dehors du panier
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];

      // Vérifie si la quantité totale demandée dépasse le stock
      const newQuantity = updatedCart[existingProductIndex].quantity + quantity;
      if (newQuantity <= product.stock) {
        updatedCart[existingProductIndex].quantity = newQuantity; // Met à jour la quantité
      } else {
        setNotification({
          message: "La quantité demandée dépasse le stock disponible.",
          type: "info",
        });

        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 5000);
        return;
      }

      setCart(updatedCart);
    } else {
      // Vérifie si la quantité demandée est disponible
      if (quantity <= product.stock) {
        setCart([...cart, { ...product, quantity }]);
      } else {
        setNotification({
          message: "La quantité demandée dépasse le stock disponible.",
          type: "error",
        });

        setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 5000);
        return;
      }
    }

    setNotification({
      message: `${quantity} x ${product.name} ont été ajoutés au panier.`,
      type: "success",
    });

    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
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

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  if (!product) {
    if (isLoading) {
      return <Loader />;
    } else {
      return (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold text-gray-700">
            Produit non trouvé
          </h1>
        </div>
      );
    }
  }

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

  const handleImageChange = (index) => {
    setFade(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setFade(false);
    }, 300);
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
        addToCart={addToCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
      />
      <main className="relative px-2 sm:px-4">
        {notification.message && (
          <div className="fixed bottom-16 md:bottom-auto md:top-36 inset-x-0 md:inset-x-auto md:right-0 px-4 z-50 flex justify-center md:justify-end pointer-events-none">
            <Alert
              severity={notification.type}
              className="shadow-lg rounded pointer-events-auto w-full max-w-xs sm:max-w-sm transition-all duration-300 ease-in-out"
              onClose={() => setNotification({ message: "", type: "" })}
            >
              {notification.message}
            </Alert>
          </div>
        )}

        {/* Section principale */}
        <div className="flex flex-col lg:flex-row lg:space-x-16 justify-center my-4 lg:my-10">
          {/* Section images */}
          <div className="flex flex-col-reverse lg:flex-row lg:space-x-6">
            {/* Miniatures */}
            {product.other_image && (
              <div className="flex flex-row lg:justify-start justify-center space-x-4 mt-4 lg:flex-col lg:space-y-4 lg:space-x-0">
                {[product.image, product.other_image].map((img, index) => (
                  <div
                    key={index}
                    className={`border bg-bgColor shadow-xl cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 ${
                      currentImageIndex === index
                        ? "opacity-100 ring-2 ring-amber-500"
                        : "opacity-80"
                    }`}
                    onClick={() => handleImageChange(index)}
                  >
                    <Image
                      src={img}
                      alt={`Miniature ${index}`}
                      width={80}
                      height={100}
                      className="h-20 sm:h-24 w-20 sm:w-24 object-contain"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Image principale */}
            <div
              className={`flex justify-center transition-opacity duration-500 ${
                fade ? "opacity-0" : "opacity-100"
              }`}
            >
              <Image
                src={
                  currentImageIndex === 0
                    ? product.image
                    : product.other_image || product.image
                }
                alt={`Image du produit`}
                width={400}
                height={500}
                onLoadingComplete={handleImageLoad}
                className={`border bg-bgColor shadow-lg h-[300px] sm:h-[400px] lg:h-[450px] object-contain ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          </div>

          {/* Section détails produit */}
          <div className="flex py-4 lg:py-6 px-4 lg:px-0 md:mt-0 mt-4">
            <div className="font-poppins space-y-5 w-full">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700">
                  {product.name}
                </h3>
                <p className="text-xl sm:text-2xl font-poppins font-semibold">
                  {new Intl.NumberFormat("fr-FR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    style: "currency",
                    currency: "CFA",
                  }).format(product.price)}
                </p>
              </div>
              <div className="space-y-5">
                <div className="flex space-x-2">
                  <span className="underline">Contenance : </span>
                  <span className="font-semibold text-gray-600">
                    {product.volume} ML
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm">Quantité :</label>
                    <div className="flex space-x-4">
                      <div className="flex border border-gray-300 items-center p-2">
                        <button
                          onClick={handleDecreaseQuantity}
                          className="px-3 py-1"
                          aria-label="Diminuer la quantité"
                        >
                          <BsDashLg className="h-5 w-5" />
                        </button>
                        <span className="font-bold text-lg px-4 sm:px-6">
                          {quantity}
                        </span>
                        <button
                          onClick={handleIncreaseQuantity}
                          className="px-3 py-1"
                          aria-label="Augmenter la quantité"
                        >
                          <IoAdd className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gray-900 font-poppins w-full md:w-auto md:static fixed left-0 right-0 bottom-0 md:z-0 z-10 hover:bg-amber-500 text-white py-3 px-4 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>AJOUTER AU PANIER</span>
                      <IoCartOutline className="w-5 h-5" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets description et livraison */}
        <div className="relative px-2 sm:px-4">
          <div className="flex justify-center">
            <div className="flex space-x-2 sm:space-x-6 w-full max-w-md">
              <button
                onClick={() => handleTabClick("description")}
                className={`font-poppins border py-2 px-3 sm:py-3 sm:px-4 flex-1 text-sm sm:text-base transition-colors duration-300 ${
                  activeTab === "description"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900 border-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => handleTabClick("livraison")}
                className={`font-poppins border py-2 px-3 sm:py-3 sm:px-4 flex-1 text-sm sm:text-base transition-colors duration-300 ${
                  activeTab === "livraison"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900 border-gray-400 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Livraison
              </button>
            </div>
          </div>
          <div className="border-t border-gray-400 w-full my-4"></div>

          {/* Contenu de l'onglet actif */}
          <div className="px-2 sm:px-4">
            {activeTab === "description" && (
              <div className="w-full mx-auto mt-2">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-100 px-6 py-4 border-b border-gray-200/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Description du produit
                          </h3>
                          <p className="text-sm text-gray-600">
                            Découvrez tous les détails
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="prose prose-gray max-w-none">
                        <div className="relative">
                          {/* Decorative element */}
                          <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-30"></div>

                          <div className="pl-6">
                            <p className="text-gray-700 leading-relaxed text-base font-normal whitespace-pre-line">
                              {product?.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer info */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Info className="h-4 w-4" />
                          <span>
                            Les informations peuvent varier selon les stocks
                            disponibles
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {activeTab === "livraison" && (
              <div className="w-full mx-auto px-4">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Truck className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Grille tarifaire de livraison
                      </CardTitle>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Découvrez nos tarifs de livraison selon votre zone
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100">
                            <TableHead className="font-semibold text-gray-700 py-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Zone de livraison
                              </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4">
                              Zone
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 text-right">
                              Tarif
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tarifsLivraison.map((tarif, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100"
                            >
                              <TableCell className="font-medium py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  {tarif.quartier}
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant={getZoneBadgeVariant(tarif.zone)}
                                  className="font-medium"
                                >
                                  {tarif.zone}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4 text-right">
                                <span className="font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                                  {tarif.tarif}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">
                            Informations importantes
                          </h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>
                              • Livraison gratuite pour les commandes
                              supérieures à 25 000 FCFA
                            </li>
                            <li>
                              • Délai de livraison : 30-60 minutes selon la zone
                            </li>
                            <li>• Paiement à la livraison</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Section produits recommandés */}
        <div className="py-10 overflow-hidden mb-8">
          <h3 className="flex justify-center text-xl sm:text-2xl font-medium font-poppins text-gray-700 mb-6">
            VOUS AIMEREZ AUSSI
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-4">
            {products
              .slice(0, 4)
              .filter((p) => p.id !== product.id)
              .map((product) => (
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
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
