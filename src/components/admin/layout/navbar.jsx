import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './sidebar';
import { FaRegBell } from "react-icons/fa";
import { motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [openSideBar, setOpenSideBar] = useState(false);
    const { data: session } = useSession();

    const handleUserMenu = () => setOpenUserMenu((prev) => !prev);

    const menuRef = useRef(null); // Ref pour le menu utilisateur


    // Ferme le menu si l'utilisateur clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                onClick={() => setOpenSideBar(true)}
                                data-drawer-target="logo-sidebar"
                                data-drawer-toggle="logo-sidebar"
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:block lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center gap-3 bg-blue-50 rounded-full">
                                {/* Affichage de l'email */}
                                <div className='hidden md:block pl-2'>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {session?.user?.email}
                                    </span>
                                </div>

                                {/* Bouton de menu utilisateur */}
                                <button
                                    onClick={handleUserMenu}
                                    type="button"
                                    className="relative flex items-center justify-center w-8 h-8 text-sm bg-blue-500 text-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600"
                                    aria-expanded={openUserMenu ? "true" : "false"}
                                    aria-haspopup="true"
                                    aria-label="Open user menu"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <span className="font-semibold uppercase dark:text-white">
                                        {session?.user?.email?.charAt(0) || "?"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {openUserMenu && (
                <div className="z-50 w-[12rem] fixed top-10 right-2 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                    <div className="px-4 py-3" role="none">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                            {session?.user?.email}
                        </p>
                    </div>
                    <ul className="py-1" role="none">
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault(); // Empêcher le comportement par défaut du lien
                                    signOut(); // Déconnecter l'utilisateur
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                role="menuitem"
                            >
                                Sign out
                            </a>
                        </li>
                    </ul>
                </div>
            )}
            <Sidebar isOpen={openSideBar} onClose={() => setOpenSideBar(false)} />
        </motion.div>
    )
}
