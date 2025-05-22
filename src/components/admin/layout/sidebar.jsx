import React, { useEffect, useRef, useState } from 'react';
import { TbLayoutDashboard } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { RiBox3Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { PiSignOutLight } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import { GoDash } from "react-icons/go";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiAdminFill } from 'react-icons/ri';

const menus = [
    {
        id: 1,
        title: "Tableau de bord",
        icon: <TbLayoutDashboard className='lg:h-8 lg:w-6 w-8 h-10' />,
        link: "/admin/dashboard",
    },
    {
        id: 2,
        title: "Produits",
        icon: <AiFillProduct className='lg:h-8 lg:w-6 w-8 h-10' />,
        link: "#",
        submenus: [
            { id: 21, title: "Liste des produits", link: "/admin/products" },
            { id: 22, title: "Collections", link: "/admin/collections" },
            { id: 23, title: "Stock", link: "/admin/stock" },
        ],
    },
    {
        id: 3,
        title: "Commandes",
        icon: <RiBox3Fill className='lg:h-8 lg:w-6 w-8 h-10' />,
        link: "/admin/orders"
    },
    {
        id: 4,
        title: "Clients",
        icon: <HiUsers className='lg:h-8 lg:w-6 w-8 h-10' />,
        link: "/admin/customers"
    },
    {
        id: 5,
        title: "Utilisateurs",
        icon: <RiAdminFill className='lg:h-8 lg:w-6 w-8 h-10' />,
        link: "/admin/accounts"
    }
];

function Sidebar({ isOpen, onClose }) {
    const router = useRouter();
    const [openMenuId, setOpenMenuId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const sidebarRef = useRef(null);

    const isActive = (link) => router.pathname.startsWith(link);

    const handleMenuClick = (menuId) => {
        setOpenMenuId(openMenuId === menuId ? null : menuId);
    };

    const shouldOpenSubMenu = (submenus) => {
        return submenus.some((submenu) => isActive(submenu.link));
    };

    // Ferme le menu si l'utilisateur clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <aside
            id="logo-sidebar"
            className={`fixed top-0 left-0 z-50 h-screen lg:w-80 w-[280px] lg:translate-x-0 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            aria-label="Sidebar"
            ref={sidebarRef}
        >
            <motion.div 
                className="h-full overflow-y-auto px-3 pb-4 pt-20 bg-gradient-to-b from-blue-600 via-blue-400 to-amber-300 dark:bg-gray-800"
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <ul className="space-y-2 font-medium pl-4">
                    {menus.map((menu) => {
                        const submenuActive = menu.submenus && shouldOpenSubMenu(menu.submenus);
                        const parentActive = isActive(menu.link) || submenuActive;

                        return (
                            <li key={menu.id}>
                                <div
                                    onClick={() => handleMenuClick(menu.id)}
                                    className={`flex cursor-pointer justify-between items-center lg:text-base text-lg p-2 rounded-lg dark:text-white hover:bg-gray-50 hover:text-blue-700 dark:hover:bg-gray-700 group ${
                                        parentActive && "bg-white"
                                    }`}
                                >
                                    {menu.link ? (
                                        <Link href={menu.link}>
                                            <div className="flex items-center">
                                                <span className={`group-hover:text-amber-500 ${
                                                    parentActive && "text-amber-500"
                                                }`}>
                                                    {menu.icon}
                                                </span>
                                                <span className={`ml-3 font-light group-hover:font-semibold ${
                                                    parentActive && "text-blue-500 font-semibold"
                                                }`}>
                                                    {menu.title}
                                                </span>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center">
                                            <span className={`group-hover:text-amber-500 ${
                                                parentActive && "text-amber-500"
                                            }`}>
                                                {menu.icon}
                                            </span>
                                            <span className={`ml-3 font-light group-hover:font-semibold ${
                                                parentActive && "text-blue-500 font-semibold"
                                            }`}>
                                                {menu.title}
                                            </span>
                                        </div>
                                    )}
                                    {menu.submenus && (
                                        <span>
                                            {openMenuId === menu.id || submenuActive ? (
                                                <GoDash className="w-4 h-4 hover:text-blue-500" />
                                            ) : (
                                                <FaPlus className="w-3 h-3" />
                                            )}
                                        </span>
                                    )}
                                </div>
                                {menu.submenus && (openMenuId === menu.id || submenuActive) && (
                                    <ul className="mt-2 space-y-1 pl-6">
                                        {menu.submenus.map((submenu) => (
                                            <li key={submenu.id}>
                                                <Link href={submenu.link}>
                                                    <span
                                                        className={`block p-2 font-light rounded hover:text-amber-500 hover:font-semibold ${
                                                            isActive(submenu.link) && "text-amber-500 font-semibold"
                                                        }`}
                                                    >
                                                        {submenu.title}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </motion.div>
        </aside>
    );
}

export default Sidebar;