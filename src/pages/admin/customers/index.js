import React, { useEffect, useState } from "react";
import Layout from "@/components/admin/layout/layout";
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Search,
  RefreshCw,
  UserPlus,
} from "lucide-react";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10); // Nombre de clients par page

  // Fonction pour récupérer les données depuis l'API
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/totals/totalClients");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des clients");
      }
      const data = await response.json();
      setClients(data.clients);
      setTotalClients(data.totalClients);
      setLoading(false);
    } catch (err) {
      console.error("Erreur :", err);
      setError("Une erreur est survenue lors de la récupération des données.");
      setLoading(false);
    }
  };

  // Filtrer les clients en fonction du terme de recherche
  const filteredClients = clients.filter(
    (client) =>
      client.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
  );

  // Calculer les clients à afficher pour la page actuelle
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <Layout>
      <div className="bg-white min-h-screen lg:p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* En-tête avec statistiques */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-amber-500 p-3 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-200 mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl text-gray-800 font-semibold tracking-wide">
                  Liste des Clients
                </h1>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-lg shadow-md flex items-center hover:bg-gray-50 transition-colors duration-300">
              <Users className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-gray-700 font-medium">Total:</span>
              <span className="ml-2 text-xl sm:text-2xl font-bold text-amber-500">
                {totalClients}
              </span>
            </div>
          </div>

          {/* Barre d'outils */}
          <div className="bg-white shadow-xl overflow-hidden">
            <div className="bg-gray-50 px-4  py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border-2 border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm placeholder-gray-400 transition-all duration-200"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Contenu */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 text-center py-16 px-6 rounded-lg">
                <div className="text-lg font-medium mb-2">Erreur</div>
                <div>{error}</div>
              </div>
            ) : currentClients.length === 0 ? (
              <div className="text-gray-500 text-center py-16">
                {searchTerm
                  ? "Aucun client correspondant à votre recherche."
                  : "Aucun client trouvé."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Tableau pour grands écrans */}
                <table className="hidden sm:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Adresse
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentClients.map((client, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-all duration-200"
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold">
                              {client.firstName?.charAt(0)}
                              {client.lastName?.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm sm:text-base font-medium text-gray-900">
                                {client.firstName} {client.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm sm:text-base text-gray-900">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {client.phone || "Non renseigné"}
                            </div>
                            <div className="flex items-center text-sm sm:text-base text-gray-900">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {client.email || "Non renseigné"}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center text-sm sm:text-base text-gray-900">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            {client.address || "Non renseignée"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Liste pour petits écrans */}
                <div className="block sm:hidden">
                  {currentClients.map((client, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 p-4 hover:bg-blue-50 transition-colors duration-300"
                    >
                      <div className="flex items-center mb-2">
                        <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-blue-500 font-bold">
                          {client.firstName?.charAt(0)}
                          {client.lastName?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.firstName} {client.lastName}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1 text-sm text-gray-700">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2" />
                          {client.phone || "Non renseigné"}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {client.email || "Non renseigné"}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          {client.address || "Non renseignée"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredClients.length > 0 && (
              <div className="bg-white px-4 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de{" "}
                <span className="font-medium">{indexOfFirstClient + 1}</span> à{" "}
                <span className="font-medium">{Math.min(indexOfLastClient, filteredClients.length)}</span>{" "}
                sur <span className="font-medium">{filteredClients.length}</span> clients
              </div>
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
                <button className="px-4 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-700 transition-all duration-200">
                  {currentPage}
                </button>
                <button
                  className={`px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 ${indexOfLastClient >= filteredClients.length ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={indexOfLastClient >= filteredClients.length}
                >
                  Suivant
                </button>
              </div>
           </div>
           
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
