import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";
import Layout from "@/components/admin/layout/layout";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const router = useRouter();

  // États pour les filtres
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, [currentPage, pageSize, search]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      // Construction de l'URL avec les paramètres
      const params = new URLSearchParams({
        page: currentPage,
        pageSize,
        ...(search && { search }),
      });

      const response = await fetch(`/api/accounts?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setAdmins(data.admins);
        setTotalPages(data.totalPages);
        setTotalAdmins(data.totalAdmin);
      } else {
        console.error("Erreur lors de la récupération des administrateurs");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    fetchAdmins();
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const viewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setViewModalOpen(true);
  };

  // Ajout de dates fictives pour la démo
  const enrichedAdmins = admins.map((admin) => ({
    ...admin,
    createdAt:
      admin.createdAt ||
      new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    role: admin.role || (Math.random() > 0.5 ? "Super Admin" : "Admin"),
    status: admin.status || (Math.random() > 0.3 ? "Actif" : "Inactif"),
  }));

  const handleDelete = async (id) => {
    // Affiche une confirmation SweetAlert2
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/accounts/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Mise à jour locale après suppression
          setAdmins((prevAdmins) =>
            prevAdmins.filter((admin) => admin.id !== id)
          );
          //Affichage de la notification
          setNotification({
            message: "Catégorie supprimée avec succès!",
            type: "success",
          });
          // Réinitialiser la notification après un délai
          setTimeout(() => {
            setNotification({ message: "", type: "" });
          }, 3000);

          fetchAdmins();
        } else {
          console.error(
            "Erreur lors de la suppression :",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    }
  };

  // Fonction pour déterminer si l'écran est petit (mobile)
  const getIsMobile = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  };
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(getIsMobile());
    
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen p-2">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Gestion des administrateurs
            </h1>

            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
              {/* Barre de recherche */}
              <div className="relative w-full md:w-1/2">
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    placeholder="Rechercher par email..."
                    className="w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-lg transition duration-200"
                  >
                    <Search size={18} />
                  </button>
                </form>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-between md:justify-end w-full md:w-auto">
                <button
                  onClick={fetchAdmins}
                  className="flex items-center gap-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200 text-sm sm:text-base"
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Actualiser</span>
                </button>
                <button
                  onClick={() => router.push("/admin/accounts/create")}
                  className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition duration-200 text-sm sm:text-base"
                >
                  <IoAdd className="h-5 w-5" />
                  <span className="hidden sm:inline">Ajouter</span>
                </button>
              </div>
            </div>

            {/* Tableau des administrateurs - version mobile */}
            <div className="block md:hidden">
              {loading ? (
                <div className="text-center py-4">Chargement...</div>
              ) : enrichedAdmins.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Aucun administrateur trouvé
                </div>
              ) : (
                <div className="space-y-4">
                  {enrichedAdmins.map((admin, index) => (
                    <div 
                      key={admin.id || index} 
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="mb-2">
                        <span className="font-medium">Email:</span> {admin.email}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Rôle:</span> administrateur
                      </div>
                      <div className="mb-3">
                        <span className="font-medium">Date:</span> {new Date(admin.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2 pt-2 border-t">
                        <button
                          onClick={() => viewAdmin(admin)}
                          className="bg-slate-800 text-white py-2 px-3 rounded-md hover:bg-black flex-1"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
                          className="border border-black px-3 py-2 rounded-md hover:bg-slate-200 flex-1"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tableau des administrateurs - version desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 sm:px-6 py-4 text-center text-gray-500"
                      >
                        Chargement...
                      </td>
                    </tr>
                  ) : enrichedAdmins.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 sm:px-6 py-4 text-center text-gray-500"
                      >
                        Aucun administrateur trouvé
                      </td>
                    </tr>
                  ) : (
                    enrichedAdmins.map((admin, index) => (
                      <tr key={admin.id || index} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.email}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            administrateur
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewAdmin(admin)}
                              className="bg-slate-800 text-white py-2 px-3 hover:bg-black rounded-md"
                              title="Voir"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDelete(admin.id)}
                              className="border border-black px-3 py-2 hover:bg-slate-200 rounded-md"
                              title="Supprimer"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                Affichage de{" "}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                à{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalAdmins)}
                </span>{" "}
                sur <span className="font-medium">{totalAdmins}</span>{" "}
                administrateurs
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-2">
                <select
                  className="border rounded-md px-2 py-1 text-sm w-full sm:w-auto"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5 par page</option>
                  <option value="10">10 par page</option>
                  <option value="25">25 par page</option>
                  <option value="50">50 par page</option>
                </select>

                <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2 w-full sm:w-auto">
                  {/* Version simplifiée pour les écrans très petits */}
                  <div className="flex items-center sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-1 border rounded-md ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <span className="px-2 py-1">
                      {currentPage} / {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-1 border rounded-md ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Version complète pour les écrans plus grands */}
                  <div className="hidden sm:flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 border rounded-md text-xs ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Premier
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-1 border rounded-md ${
                        currentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {/* Numéros de page */}
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      // Logique pour afficher les pages autour de la page courante
                      let pageToShow;
                      if (totalPages <= 3) {
                        pageToShow = i + 1;
                      } else if (currentPage === 1) {
                        pageToShow = i + 1;
                      } else if (currentPage === totalPages) {
                        pageToShow = totalPages - 2 + i;
                      } else {
                        pageToShow = currentPage - 1 + i;
                      }

                      if (pageToShow > 0 && pageToShow <= totalPages) {
                        return (
                          <button
                            key={pageToShow}
                            onClick={() => handlePageChange(pageToShow)}
                            className={`w-7 h-7 flex items-center justify-center rounded-md text-sm ${
                              currentPage === pageToShow
                                ? "bg-blue-600 text-white"
                                : "border hover:bg-gray-100"
                            }`}
                          >
                            {pageToShow}
                          </button>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-1 border rounded-md ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-2 py-1 border rounded-md text-xs ${
                        currentPage === totalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Dernier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de détail - Responsive */}
        {viewModalOpen && selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Détails de l'administrateur
                </h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="mb-6 flex justify-center">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {selectedAdmin.email.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium break-all">{selectedAdmin.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rôle</p>
                    <p className="font-medium">administrateur</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de création</p>
                    <p className="font-medium">
                      {new Date(selectedAdmin.createdAt).toLocaleDateString()}{" "}
                      {new Date(selectedAdmin.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}