import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { LiaShoppingBagSolid } from 'react-icons/lia';
import { FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { IoIosHeart, IoIosHeartEmpty, IoIosClose } from 'react-icons/io';
import { Alert } from '@mui/material';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import Skeleton from './loaders/Skeleton';

export default function BestSellers({ addToCart, cart }) {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [screenWidth, setScreenWidth] = useState(0); // Initialisé à 0 ou une valeur par défaut
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true)

    // Utilisation de useEffect pour s'assurer que l'accès à 'window' se fait uniquement côté client
    useEffect(() => {
        // Vérifier si l'objet window est disponible
        if (typeof window !== "undefined") {
            setScreenWidth(window.innerWidth); // Mettre à jour la largeur de l'écran
        }
    }, []); // Cette logique s'exécute uniquement au montage (côté client)

    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();

                // Simulation d'un délai de chargement
                setTimeout(() => {
                    setProducts(data.products);
                    setIsLoading(false);
                }, 2000); // Délai réduit pour une meilleure expérience utilisateur
            } catch (error) {
                console.error('Error fetching products:', error);
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {

        const productInCart = cart.find(item => item.id === product.id);

        // Calculer la quantité totale après l'ajout
        const newQuantity = productInCart ? productInCart.quantity + 1 : 1;

        // Vérifier si la quantité dépasse le stock
        if (newQuantity > product.stock) {
            setNotification({ message: "La quantité dépasse le stock disponible.", type: "error" });
            setLoading(true);

            setTimeout(() => {
                setNotification({ message: "", type: "" });
                setLoading(false);
            }, 3000);
            return;
        }

        addToCart(product);
        setNotification({ message: "Produit ajouté au panier", type: "success" });
        setLoading(true);
        setTimeout(() => {
            setNotification({ message: "", type: "" });
            setLoading(false);
        }, 3000);
    };

    const isNewProduct = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffInDays = (now - created) / (1000 * 60 * 60 * 24); // ms to days
        return diffInDays <= 5;
    };

    return (
        <div className='py-10 relative'>
            {notification.message && (
                <div
                    className="w-80 md:w-96 rounded-lg shadow-lg z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white overflow-hidden"
                >
                    {/* Barre de chargement */}
                    {loading && (
                        <div className="w-full bg-gray-200 h-1">
                            <div
                                className="bg-amber-400 h-1 origin-left transition-transform duration-1000 ease-in-out"
                                style={{
                                    animation: "progressBar 3s ease-in-out infinite"
                                }}
                            />
                        </div>
                    )}

                    <div className={`flex items-center p-4 ${notification.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
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
                            <span className="text-sm font-medium">{notification.message}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className='flex justify-center items-center font-poppins text-2xl md:text-3xl mb-10'>
                <h2>NOS MEILLEURES VENTES</h2>
            </div>
            {isLoading ? (
                <Skeleton />
            ) : (
                <Carousel
                    responsive={responsive}
                    autoPlay={true}
                    swipeable={true}
                    draggable={true}
                    showDots={true}
                    infinite={true}
                    partialVisible={false}
                    dotListClass="custom-dot-list-style"
                    className="z-0"
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="mx-2 bg-bgColor rounded shadow-lg relative hover:shadow-xl transition duration-200 group"
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
                                        src={product.other_image || product.image}
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
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock < 1}
                                        className={`hidden md:flex justify-center items-center space-x-1 absolute bottom-16 left-1/2 transform -translate-x-1/2 translate-y-full group-hover:translate-y-0 w-full px-4 py-2 bg-black text-white opacity-0 group-hover:opacity-100 transition duration-500 ease-out ${product.stock < 1
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
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock < 1}
                                        className={`md:hidden flex justify-center items-center space-x-1 absolute bottom-16 w-full px-4 py-2 bg-black text-white ${product.stock < 1
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
                                    <p className="text-gray-700 font-thin text-center mb-2">{product?.volume}{" "}ML</p>
                                    <div className="pl-4 h-full">
                                        <h3
                                            className="font-poppins text-sm text-gray-600 cursor-pointer hover:text-amber-400"
                                            onClick={() => {
                                                router.push({
                                                    pathname: `/product/${product.id}`,
                                                });
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
                </Carousel>
            )}
            {products.length > 0 && !isLoading && (
                <div className="flex mt-6 py-6 items-center justify-center">
                    <button
                        onClick={() => router.push('/shop')}
                        className="bg-black flex items-center space-x-2 hover:bg-amber-400 text-white font-poppins py-2 px-6"
                    >
                        <span>DÉCOUVRIR</span>
                        <FaArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
}
