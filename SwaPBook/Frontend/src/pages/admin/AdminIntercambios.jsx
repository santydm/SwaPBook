import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiLoader, FiSearch, FiRepeat, FiCheckCircle, FiXCircle, FiUser, FiBookOpen, FiClock } from "react-icons/fi";

const estadoColor = {
  "En proceso": "bg-yellow-100 text-yellow-800",
  "Realizado": "bg-green-100 text-green-800",
  "Cancelado": "bg-red-100 text-red-800",
};

const AdminIntercambios = () => {
  const [intercambios, setIntercambios] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    realizados: 0,
    cancelados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef(null);

  // Obtener intercambios (con filtro)
  const fetchIntercambios = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = query
        ? `http://localhost:8000/admin/intercambios/filtrar?search=${encodeURIComponent(query)}`
        : "http://localhost:8000/admin/intercambios";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIntercambios(res.data);
      setError("");
    } catch (error) {
      setError("Error al cargar intercambios");
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get("http://localhost:8000/admin/estadisticas/intercambios", { headers });
      setStats({
        total: res.data.total_creados,
        realizados: res.data.total_finalizados,
        cancelados: res.data.total_cancelados,
      });
    } catch (error) {
      // No acción, se maneja en fetchIntercambios
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchIntercambios(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line
  }, [searchTerm]);

  useEffect(() => {
    fetchIntercambios();
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-[#722F37] mb-4" />
        <span className="text-[#5A252B]">Cargando intercambios...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 max-w-lvw mx-auto p-8 flex flex-col gap-6">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold text-[#722F37]">Gestión de Intercambios</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#722F37]/10 p-4 rounded-lg flex items-center gap-4 border border-[#722F37]/20">
          <FiRepeat className="text-2xl text-[#722F37]" />
          <div>
            <p className="text-sm text-[#5A252B]">Total de intercambios</p>
            <p className="text-2xl font-bold text-[#722F37]">{stats.total}</p>
          </div>
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center gap-4">
          <FiCheckCircle className="text-2xl" />
          <div>
            <p className="text-sm">Realizados</p>
            <p className="text-2xl font-bold">{stats.realizados}</p>
          </div>
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg flex items-center gap-4">
          <FiXCircle className="text-2xl" />
          <div>
            <p className="text-sm">Cancelados</p>
            <p className="text-2xl font-bold">{stats.cancelados}</p>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="w-full relative mt-4">
        <input
          type="text"
          placeholder="Buscar por libro, usuario, estado o fecha..."
          className="w-full pl-12 pr-4 py-3 border-2 border-[#C9B084] rounded-xl focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] text-[#5A252B]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-4 top-4 text-[#5A252B] text-xl" />
      </div>

      {/* Bandeja de intercambios */}
      <div className="rounded-lg border border-[#C9B084]/30 max-h-[800px] overflow-y-auto">
        {error ? (
          <div className="text-center p-8 text-red-600">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-[#C9B084]">
            <thead className="bg-[#f9f6f2] sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Libro solicitado</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Solicitante</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Libro ofrecido</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Ofertante</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9B084] bg-white">
              {intercambios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[#5A252B]">
                    No se encontraron intercambios con los criterios de búsqueda
                  </td>
                </tr>
              ) : (
                intercambios.map((inter) => (
                  <tr key={inter.idIntercambio}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FiBookOpen className="text-[#722F37]" />
                        {inter.libroSolicitado?.titulo || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-[#722F37]" />
                        {inter.solicitante?.nombre || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FiBookOpen className="text-[#C9B084]" />
                        {inter.libroOfrecido?.titulo || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-[#C9B084]" />
                        {inter.ofertante?.nombre || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-[#722F37]" />
                        {inter.fecha ? new Date(inter.fecha).toLocaleDateString('es-ES') : "—"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        estadoColor[inter.estado] || "bg-gray-100 text-gray-800"
                      }`}>
                        {inter.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminIntercambios;
