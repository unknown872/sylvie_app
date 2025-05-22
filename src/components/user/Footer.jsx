import React from 'react';
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from 'react-icons/fa';

const menus = [
    {
        title: 'Accueil',
        link: "/"
    },
    {
        title: 'Boutique',
        link: "/shop"
    },
    {
        title: 'À Propos',
        link: "/about"
    },
    {
        title: 'Contact',
        link: "/contact"
    },
];

const assistances = [
    {
        title: 'Suivi commande',
        link: "#"
    },
    {
        title: 'FAQ',
        link: "#"
    },
    {
        title: 'Politique de confidentialité',
        link: "#"
    },
    {
        title: 'Conditions générales de vente',
        link: "#"
    },
];

const collections = [
    {
        title: 'Parfum senteur',
        link: "#"
    },
    {
        title: 'Parfum oriental',
        link: "#"
    }
];

export default function Footer() {
    return (
        <footer className="border-t">
            {/* Grille responsive pour les sections du footer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:mx-10 mx-2 py-10">
                {/* Section 1 : Les senteurs de sylvie */}
                <div className="px-4 sm:px-10">
                    <nav className="flex flex-col space-y-4 text-gray-500 font-poppins">
                        <p className="uppercase font-semibold">Les senteurs de sylvie</p>
                        {menus.map((menu, index) => (
                            <div key={index}>
                                <a href={menu.link} className="text-gray-800 relative group">
                                    <span>{menu.title}</span>
                                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-full transition-all h-0.5 duration-200 bg-gray-700 max-w-full"></span>
                                </a>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Section 2 : Assistance */}
                <div className="px-4 sm:px-10">
                    <nav className="flex flex-col space-y-4 text-gray-500 font-poppins">
                        <p className="uppercase font-semibold">Assistance</p>
                        {assistances.map((assistance, index) => (
                            <div key={index}>
                                <a href={assistance.link} className="text-gray-800 relative group">
                                    <span>{assistance.title}</span>
                                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-full transition-all h-0.5 duration-200 bg-gray-700 max-w-full"></span>
                                </a>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Section 3 : Collections */}
                <div className="px-4 sm:px-10">
                    <nav className="flex flex-col space-y-4 text-gray-500 font-poppins">
                        <p className="uppercase font-semibold">Collections</p>
                        {collections.map((collection, index) => (
                            <div key={index}>
                                <a href={collection.link} className="text-gray-800 relative group">
                                    <span>{collection.title}</span>
                                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-full transition-all h-0.5 duration-200 bg-gray-700 max-w-full"></span>
                                </a>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Section 4 : Suivez-nous */}
                <div className="px-4 sm:px-10">
                    <div className="text-gray-500 space-y-4">
                        <p className="uppercase font-semibold">Suivez-nous</p>
                        <p className="text-base">Pour ne plus rater nos nouveautés et promos!</p>
                        <div className="flex space-x-6 text-gray-700">
                            <a href="#" className="hover:text-black transition-colors duration-200"><FaFacebookF className="w-6 h-6" /></a>
                            <a href="#" className="hover:text-black transition-colors duration-200"><FaInstagram className="w-6 h-6" /></a>
                            <a href="#" className="hover:text-black transition-colors duration-200"><FaTiktok className="w-6 h-6" /></a>
                            <a href="#" className="hover:text-black transition-colors duration-200"><FaXTwitter className="w-6 h-6" /></a>
                            <a href="#" className="hover:text-black transition-colors duration-200"><FaWhatsapp className="w-6 h-6" /></a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section de copyright */}
            <div className="border-t flex justify-center items-center h-20 text-gray-500 text-sm sm:text-base">
                ©2025 LES SENTEURS DE SYLVIE - Tous droits réservés
            </div>
        </footer>
    );
}