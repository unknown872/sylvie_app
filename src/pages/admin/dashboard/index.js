import Layout from "@/components/admin/layout/layout";
import React, { useState, useEffect } from "react";
import { FaMoneyBills } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi2";
import {
  HiMiniArrowTrendingUp,
  HiMiniArrowTrendingDown,
} from "react-icons/hi2";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Loader from "@/components/user/loaders/Loader";
//import { useRouter } from "next/router";

export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalOutOfStockProducts, setTotalOutOfStockProducts] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  //const router = useRouter();

  const fetchTotalSales = async () => {
    try {
      const response = await fetch("/api/totals/totalSales", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des ventes totales");
      }
      const data = await response.json();
      setTotalSales(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des ventes totales:",
        error
      );
    }
  };

  const fetchTotalPendingOrders = async () => {
    try {
      const response = await fetch("/api/totals/totalPendingOrders", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des commandes en attente"
        );
      }
      const data = await response.json();
      setTotalPendingOrders(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des commandes en attente:",
        error
      );
    }
  };

  const fetchTotalOutOfStockProducts = async () => {
    try {
      const response = await fetch("/api/totals/totalOutOfStockProducts", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des produits en rupture de stock"
        );
      }
      const data = await response.json();
      setTotalOutOfStockProducts(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des produits en rupture de stock:",
        error
      );
    }
  };

  const fetchTotalClients = async () => {
    try {
      const response = await fetch("/api/totals/totalClients", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des clients");
      }
      const data = await response.json();
      setTotalClients(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  // Récupérer les commandes avec le statut "En attente"
  const fetchOrders = () => {
    fetch("/api/orders?statut=En attente")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des commandes:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchTotalSales(),
        fetchTotalPendingOrders(),
        fetchTotalOutOfStockProducts(),
        fetchTotalClients(),
        fetchOrders(),
      ]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  const items = [
    {
      id: 1,
      title: "Vente Totale",
      total: totalSales,
      icon: <FaMoneyBills size={30} />,
      bgColor: "bg-gradient-to-r from-green-400 to-green-600",
      textColor: "text-white",
      trend: "up",
      iconBg: "bg-green-300/30",
    },
    {
      id: 2,
      title: "Commandes en attentes",
      total: totalPendingOrders,
      icon: <BsCart4 size={30} />,
      bgColor: "bg-gradient-to-r from-blue-400 to-blue-600",
      textColor: "text-white",
      trend: "up",
      iconBg: "bg-blue-300/30",
    },
    {
      id: 3,
      title: "Produits en rupture",
      total: totalOutOfStockProducts,
      icon: <IoStatsChart size={30} />,
      bgColor: "bg-gradient-to-r from-red-400 to-red-600",
      textColor: "text-white",
      trend: "down",
      iconBg: "bg-red-300/30",
    },
    {
      id: 4,
      title: "Clients",
      total: totalClients.totalClients || 0,
      icon: <HiUserGroup size={30} />,
      bgColor: "bg-gradient-to-r from-purple-400 to-purple-600",
      textColor: "text-white",
      trend: "up",
      iconBg: "bg-purple-300/30",
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (status === "loading" || isLoading) {
    return (
      <Layout>
        <Loader/>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-1 md:p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-950">
            Tableau de Bord
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`${item.bgColor} rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden`}
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                ></div>
                <div
                  className="absolute -left-10 -top-10 w-32 h-32 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                ></div>
              </div>

              <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`${item.iconBg} p-3 rounded-lg`}>
                    <span className={`${item.textColor}`}>{item.icon}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    {item.trend === "up" ? (
                      <div className="bg-green-100 rounded-full p-1 text-green-500">
                        <HiMiniArrowTrendingUp className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="bg-red-100 rounded-full p-1 text-red-500">
                        <HiMiniArrowTrendingDown className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className={`${item.textColor} text-2xl font-bold`}>
                    {item.title === "Vente Totale"
                      ? item?.total.toLocaleString() + " FCFA"
                      : item.total}
                  </span>
                  <h3
                    className={`${item.textColor} opacity-90 font-medium text-sm mt-1`}
                  >
                    {item.title} 
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-800">
              Commandes récentes
            </h3>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 py-2 px-4 rounded-full transition-all duration-500 font-medium"
            >
              Voir toutes les commandes
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              Aucune commande trouvée.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commande
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700 whitespace-nowrap">
                        #{order.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium whitespace-nowrap">
                        {order.firstName} {order.lastName}
                      </td>
                      <td className="py-3 px-4 text-sm whitespace-nowrap">
                        <span className="text-gray-700 py-1.5 font-semibold px-3 rounded-full bg-blue-50 text-xs">
                          {order.products.length}{" "}
                          {order.products.length > 1 ? "articles" : "article"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {formatPrice(order.totalPrice - order.deliveryPrice)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm whitespace-nowrap">
                        <span className="bg-amber-100 text-amber-800 py-1 px-3 rounded-full text-xs font-medium">
                          {order.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
