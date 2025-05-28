import React, { useState, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai";
import Logo from "@/assets/logo/Logo.png";
import Logos from "@/assets/logo/reine_logo.jpeg";
import Link from "next/link";
import { IoMdArrowDown, IoMdArrowDropdown, IoMdArrowDropup, IoMdClose } from "react-icons/io";
import Third from "@/assets/bottle-parfum.png";
import { IoAdd, IoArrowDown } from "react-icons/io5";
import { BsDashLg } from "react-icons/bs";
import { TfiTrash } from "react-icons/tfi";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdCloseCircle } from 'react-icons/io';
import { MdDeleteOutline } from 'react-icons/md';
import { GoDash } from 'react-icons/go';
import { useRouter } from "next/router";
import matushka from "../../../public/matushka.webp";
import { motion } from "framer-motion";

export default function Header({ products, addToCart, totalPrice, clearCart, removeFromCart, cart, increaseQuantity, decreaseQuantity, handleClickOutside, openCart, handleOpenCart, cartButtonRef, cartMenuRef }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredCollection, setHoveredCollection] = useState(false);
    const [hoveredShop, setHoveredShop] = useState(false);
    const [collections, setCollections] = useState([]);
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [collectionMenuOpen, setCollectionMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const collectionRef = useRef(null);
    const shopRef = useRef(null);
    const menuRef = useRef(null);

    const totalCart = cart.reduce((total, item) => total + item.price * item.quantity, 0)

    const handleCollectionMenuClick = () => {
        setCollectionMenuOpen(!collectionMenuOpen);
    };

    // Utiliser useRef pour la fermeture du menu
    const handleMenuOutside = (event) => {
        if (collectionRef.current && !collectionRef.current.contains(event.target)) {
            setHoveredCollection(false);
        }

        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    const handleCollectionEnter = () => setHoveredCollection(true);
    const handleCollectionLeave = () => setHoveredCollection(false);

    const handleShopEnter = () => setHoveredShop(true);
    const handleShopLeave = () => setHoveredShop(false);

    // Enlever le produit du panier si le stock est en dessous de 1
    const handleRemoveFromCart = (product) => {
        if (product.stock > 1) {
            removeFromCart(product);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        handleClickOutside;

        // Ajouter l'écouteur d'événements sur le document
        document.addEventListener('click', handleClickOutside);

        // Nettoyage de l'écouteur lors du démontage du composant
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Faire appel a l'API pour obtenir la liste des collections
    const getCollections = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/collections");
            const data = await response.json();
            setCollections(data.collections);
            return data;
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCollections();
    }, []);

    const isActive = (href) => {
        return router.pathname === href;
    }

    return (
        <nav className="bg-white h-24 px-4 sm:px-6 text-white flex justify-between items-center sticky top-0 z-50 shadow-sm">
            {/* Bouton du menu mobile */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? (
                        <AiOutlineClose className="h-6 w-6 text-black" />
                    ) : (
                        <AiOutlineMenu className="h-6 w-6 text-black" />
                    )}
                </button>
            </div>

            {/* Logo */}
            <Link href="/">
                <div className="text-black text-2xl font-semibold cursor-pointer">
                    <Image
                        src={Logos}
                        width={90}
                        height={90}
                        alt="Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                </div>
            </Link>

            {/* Menu principal */}
            <ul
                className="hidden md:flex md:space-y-0 md:space-x-6 space-y-6 font-poppins text-gray-800 absolute md:static top-24 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 z-40 md:z-auto"
            >
                <li className="relative group flex sm:flex-col cursor-pointer justify-center items-center">
                    <a href="/" passHref>
                        <span
                            className={`group-hover:text-black group-hover:font-semibold ${isActive("/") ? "text-black font-semibold" : ""}`}
                        >
                            ACCUEIL
                        </span>
                    </a>
                    <span className={`absolute -bottom-2 left-0 w-0 transition-all duration-500 h-1 bg-gray-700 ${isActive("/") ? "w-full" : "group-hover:w-full"}`}></span>
                </li>
                <li className="relative group flex sm:flex-col cursor-pointer justify-center items-center">
                    <Link href="/shop" passHref>
                        <span
                            className={`group-hover:text-black group-hover:font-semibold ${isActive("/shop") ? "text-black font-semibold" : ""}`}
                        >
                            BOUTIQUE
                        </span>
                    </Link>
                    <span className={`absolute -bottom-2 left-0 w-0 transition-all duration-500 h-1 bg-gray-700 ${isActive("/shop") ? "w-full" : "group-hover:w-full"}`}></span>
                </li>
                <li
                    className="relative group flex sm:flex-col cursor-pointer justify-center items-center"
                    ref={collectionRef}
                    onMouseEnter={handleCollectionEnter}
                    onMouseLeave={handleCollectionLeave}
                >
                    <a href="#" className="group-hover:text-black group-hover:font-semibold">
                        COLLECTION
                    </a>
                    <span className={`absolute -bottom-2 left-0 w-0 transition-all h-1 duration-500 bg-gray-700 ${isActive("/shop/grand-boubou") || isActive("/shop/deux-pieces") ? "w-full" : "group-hover:w-full"}`}></span>
                    {/* Sous-menu */}
                    {hoveredCollection && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.9 }} // L'élément commence en haut (y: -50)
                            animate={{ opacity: 1, y: 0, scale: 1 }} // L'élément se déplace à sa position d'origine (y: 0)
                            exit={{ opacity: 0, y: -50, scale: 0.9 }} // Lorsque l'élément quitte, il se déplace vers le haut
                            transition={{
                                duration: 0.7, // Durée de l'animation
                                ease: [0.25, 0.8, 0.25, 1], // Courbe de Bézier pour une transition douce
                            }}
                            className="flex shadow shadow-gray-200 border border-gray-200 absolute left-0 cursor-auto mt-[16.8rem] space-y-2 space-x-3 bg-white text-gray-800 w-80 p-4 font-light font-poppins text-sm"
                        >
                            <ul className="py-6">
                                {collections.map((collection) => (
                                    <li key={collection.name}>
                                        <Link
                                            href={`/shop/${collection.name}`}
                                            className={`${isActive({ pathname: `/shop/${collection.name}` }) && "text-amber-400"} block hover:translate-x-1 duration-500 hover:text-amber-400 px-2 py-1 rounded`}
                                        >
                                            Parfum {collection.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="">
                                <Image src={matushka} width={150} height={150} alt="Matushka" />
                            </div>
                        </motion.div>
                    )}
                </li>
                <li className="relative group flex sm:flex-col cursor-pointer justify-center items-center">
                    <Link href="/about" passHref>
                        <span
                            className={`group-hover:text-black group-hover:font-semibold ${isActive("/about") ? "text-black font-semibold" : ""}`}
                        >
                            À PROPOS
                        </span>
                    </Link>
                    <span className={`absolute -bottom-2 left-0 w-0 transition-all duration-500 h-1 bg-gray-700 ${isActive("/about") ? "w-full" : "group-hover:w-full"}`}></span>
                </li>
                <li className="relative group flex sm:flex-col cursor-pointer justify-center items-center">
                    <Link href="/contact" passHref>
                        <span
                            className={`group-hover:text-black group-hover:font-semibold ${isActive("/contact") ? "text-black font-semibold" : ""}`}
                        >
                            CONTACT
                        </span>
                    </Link>
                    <span className={`absolute -bottom-2 left-0 w-0 transition-all duration-500 h-1 bg-gray-700 ${isActive("/contact") ? "w-full" : "group-hover:w-full"}`}></span>
                </li>
            </ul>

            {isMobile && isMenuOpen && (
                <>
                    {/* Overlay (clique en dehors pour fermer) */}
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsMenuOpen(false)}
                    ></motion.div>

                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-110%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                            mass: 1,
                        }}

                        className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-white to-gray-50 shadow-xl z-50 border-r border-gray-100"
                    >
                        <div className="py-8 px-6">
                            {/* Logo ou titre de l'application */}
                            <div className="mb-10 flex items-center justify-center">
                                <Image src={Logos} width={150} height={150} alt="Logo" />
                            </div>
                            <nav>
                                <ul className="flex flex-col space-y-5 font-poppins">
                                    <li className="group">
                                        <Link href="/" passHref>
                                            <div className={`flex items-center p-3 rounded-lg group-hover:bg-gray-100 transition-all duration-300 ease-in-out ${isActive("/") ? "bg-gray-100 shadow-sm" : ""}`}>
                                                <span className="mr-3 text-gray-500 group-hover:text-gray-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                    </svg>
                                                </span>
                                                <span className={`text-sm tracking-wider ${isActive("/") ? "font-semibold text-gray-900" : "text-gray-600 group-hover:text-gray-800"}`}>
                                                    ACCUEIL
                                                </span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="group">
                                        <Link href="/shop" passHref>
                                            <div className={`flex items-center p-3 rounded-lg group-hover:bg-gray-100 transition-all duration-300 ease-in-out ${isActive("/shop") ? "bg-gray-100 shadow-sm" : ""}`}>
                                                <span className="mr-3 text-gray-500 group-hover:text-gray-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                    </svg>
                                                </span>
                                                <span className={`text-sm tracking-wider ${isActive("/shop") ? "font-semibold text-gray-900" : "text-gray-600 group-hover:text-gray-800"}`}>
                                                    BOUTIQUE
                                                </span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="group">
                                        <div
                                            onClick={handleCollectionMenuClick}
                                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer group-hover:bg-gray-100 transition-all duration-300 ease-in-out ${isActive("/shop/grand-boubou") || isActive("/shop/deux-pieces") ? "bg-gray-100 shadow-sm" : ""}`}
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-3 text-gray-500 group-hover:text-gray-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span className={`text-sm tracking-wider ${(isActive("/shop/grand-boubou") || isActive("/shop/deux-pieces")) ? "font-semibold text-gray-900" : "text-gray-600 group-hover:text-gray-800"}`}>
                                                    COLLECTION
                                                </span>
                                            </div>
                                            <span className="text-gray-600">
                                                {collectionMenuOpen ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                        </div>

                                        {collectionMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="ml-10 mt-1"
                                            >
                                                <ul className="border-l border-gray-200 pl-3 py-2 space-y-3">
                                                    {isLoading ? (
                                                        // Affiche des skeletons pendant le chargement
                                                        Array.from({ length: 4 }).map((_, index) => (
                                                            <li key={index}>
                                                                <div className="text-sm text-gray-300 bg-gray-200 rounded w-32 h-4 block py-1 animate-pulse" />
                                                            </li>
                                                        ))
                                                    ) : collections && collections.length > 0 ? (
                                                        // Affiche les collections si elles existent
                                                        collections.map((collection) => (
                                                            <li key={collection.name} className="transition-all">
                                                                <Link href={`/shop/${collection.name}`} passHref>
                                                                    <span
                                                                        className={`text-sm text-gray-600 hover:text-gray-900 hover:font-medium block py-1 transition-all duration-200 ${isActive(`/shop/${collection.name}`) ? "text-gray-900 font-medium" : ""
                                                                            }`}
                                                                    >
                                                                        {collection.name}
                                                                    </span>
                                                                </Link>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        // Affiche un message s'il n'y a pas de données
                                                        <li>
                                                            <span className="text-sm text-gray-400 italic">Aucune collection disponible</span>
                                                        </li>
                                                    )}
                                                </ul>

                                            </motion.div>
                                        )}
                                    </li>

                                    <li className="group">
                                        <Link href="/about" passHref>
                                            <div className={`flex items-center p-3 rounded-lg group-hover:bg-gray-100 transition-all duration-300 ease-in-out ${isActive("/about") ? "bg-gray-100 shadow-sm" : ""}`}>
                                                <span className="mr-3 text-gray-500 group-hover:text-gray-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                                <span className={`text-sm tracking-wider ${isActive("/about") ? "font-semibold text-gray-900" : "text-gray-600 group-hover:text-gray-800"}`}>
                                                    À PROPOS
                                                </span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="group">
                                        <Link href="/contact" passHref>
                                            <div className={`flex items-center p-3 rounded-lg group-hover:bg-gray-100 transition-all duration-300 ease-in-out ${isActive("/contact") ? "bg-gray-100 shadow-sm" : ""}`}>
                                                <span className="mr-3 text-gray-500 group-hover:text-gray-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                </span>
                                                <span className={`text-sm tracking-wider ${isActive("/contact") ? "font-semibold text-gray-900" : "text-gray-600 group-hover:text-gray-800"}`}>
                                                    CONTACT
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {/* Section de pied de page - facultative */}
                        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-100">
                            <div className="flex items-center space-x-4 text-gray-500">
                                <a href="#" className="hover:text-gray-800 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-gray-800 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="hover:text-gray-800 transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}


            {/* Icônes utilisateur et panier */}
            <div className="flex space-x-3 items-center text-gray-800">
                <button className="relative" ref={cartButtonRef} onClick={handleOpenCart}>
                    <LiaShoppingBagSolid className="h-6 w-6 hover:text-black hover:h-7 hover:w-7" />
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    )}
                </button>
            </div>

            {/* Panier */}
            {openCart && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    ref={cartMenuRef}
                    className={`fixed top-0 font-poppins right-0 h-full w-full sm:w-96 bg-white backdrop-blur-sm transform transition-transform duration-500 ease-in-out ${openCart ? "translate-x-0" : "translate-x-full"
                        } z-60 shadow-xl overflow-y-auto`}
                >
                    {/* En-tête du panier */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold font-poppins text-gray-800">Votre Panier</h2>
                        <IoMdClose
                            className="w-6 h-6 text-gray-500 cursor-pointer hover:text-amber-400 transition-colors duration-200"
                            onClick={handleOpenCart}
                        />
                    </div>

                    {/* Contenu du panier */}
                    <div className="flex flex-col divide-y divide-gray-200 p-4">
                        {cart.length === 0 ? (
                            <div className="py-6 text-center text-gray-500">Votre panier est vide.</div>
                        ) : (
                            cart.map((item, index) => {
                                if (item.stock <= 0) {
                                    removeFromCart(item.id);
                                    return null;
                                }

                                return (
                                    <div className="flex py-4 items-center" key={index}>
                                        {/* Image du produit */}
                                        <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={80}
                                                height={80}
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Détails du produit */}
                                        <div className="ml-4 flex-1">
                                            <span
                                                onClick={() => router.push(`/product/${item.id}`)}
                                                className="block text-sm font-semibold text-gray-800 hover:text-amber-400 cursor-pointer transition-colors duration-200"
                                            >
                                                {item.name}
                                            </span>
                                            <div className="flex items-center justify-between mt-2">
                                                {/* Quantité */}
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        className={`p-1 rounded-sm ${item.quantity > 1
                                                            ? "bg-amber-400 hover:bg-amber-500"
                                                            : "bg-gray-300 cursor-not-allowed"
                                                            } text-white transition-colors duration-200`}
                                                    >
                                                        <GoDash className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-semibold text-sm text-black">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => increaseQuantity(item.id)}
                                                        disabled={item.quantity >= item.stock}
                                                        className={`p-1 rounded-sm ${item.quantity < item.stock
                                                            ? "bg-amber-400 hover:bg-amber-500"
                                                            : "bg-gray-300 cursor-not-allowed"
                                                            } text-white transition-colors duration-200`}
                                                    >
                                                        <IoAdd className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Prix */}
                                                <p className="font-semibold text-gray-800">
                                                    {new Intl.NumberFormat("fr-FR", {
                                                        maximumFractionDigits: 0,
                                                        minimumFractionDigits: 0,
                                                        style: "currency",
                                                        currency: "CFA",
                                                    }).format(item.price)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bouton de suppression */}
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="ml-4 p-2 text-gray-500 hover:text-amber-400 transition-colors duration-200"
                                        >
                                            <TfiTrash className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Total et boutons */}
                    {cart.length > 0 && (
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                            <div className="flex justify-between mb-4">
                                <p className="font-semibold text-gray-600">Sous-total :</p>
                                <span className="font-semibold text-gray-800">
                                    {new Intl.NumberFormat("fr-FR", {
                                        maximumFractionDigits: 0,
                                        minimumFractionDigits: 0,
                                        style: "currency",
                                        currency: "CFA",
                                    }).format(totalCart)}
                                </span>
                            </div>
                            <button onClick={() => router.push('/cart')} className="w-full uppercase bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
                                PROCÉDER AU PAIEMENT
                            </button>
                            <button
                                onClick={() => router.push('/cart')}
                                className="w-full uppercase bg-black hover:bg-gray-900 text-white font-semibold py-3 rounded-lg mt-2 transition-colors duration-200"
                            >
                                voir le panier
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </nav>
    );
}