import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  FiLoader, 
  FiSearch, 
  FiRepeat, 
  FiCheckCircle, 
  FiXCircle,
  FiClock,
  FiInfo
} from "react-icons/fi";

const AdminIntercambios = () => {
  const [intercambios, setIntercambios] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    realizados: 0,
    cancelados: 0,
    en_proceso: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef(null);

  const estadoStyles = {
    "En proceso": "bg-yellow-100 text-yellow-800",
    "Finalizado": "bg-green-100 text-green-800",
    "Cancelado": "bg-red-100 text-red-800"
  };

  const fetchIntercambios = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8000/admin/estadisticas/intercambios${query ? `?search=${query}` : ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIntercambios(res.data.intercambios);
      setError("");
    } catch (error) {
      setError("Error al cargar intercambios");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/admin/estadisticas/intercambios", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats({
        total: res.data.total_creados,
        realizados: res.data.total_finalizados,
        cancelados: res.data.total_cancelados,
        en_proceso: res.data.total_en_proceso
      });
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchIntercambios(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm]);

  useEffect(() => {
    fetchIntercambios();
    fetchStats();
  }, []);

  const formatFechaHora = (fecha) => {
    if (!fecha) return "No programado";
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      <h1 className="text-3xl font-bold text-[#722F37] flex items-center gap-2">
        <FiRepeat className="text-[#C9B084]" />
        Gestión de Intercambios
      </h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<FiRepeat className="text-2xl"/>}
          title="Total"
          value={stats.total}
          color="bg-[#722F37]/10"
        />
        <StatCard 
          icon={<FiClock className="text-2xl"/>}
          title="En proceso"
          value={stats.en_proceso}
          color="bg-yellow-100"
          textColor="text-yellow-800"
        />
        <StatCard 
          icon={<FiCheckCircle className="text-2xl"/>}
          title="Realizados"
          value={stats.realizados}
          color="bg-green-100"
          textColor="text-green-800"
        />
        <StatCard 
          icon={<FiXCircle className="text-2xl"/>}
          title="Cancelados"
          value={stats.cancelados}
          color="bg-red-100"
          textColor="text-red-800"
        />
      </div>

      {/* Barra de búsqueda */}
      <div className="w-full relative mt-4">
        <input
          type="text"
          placeholder="Buscar por ID, lugar o estado..."
          className="w-full pl-12 pr-4 py-3 border-2 border-[#C9B084] rounded-xl focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] text-[#5A252B]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-4 top-4 text-[#5A252B] text-xl" />
      </div>

      {/* Tabla de intercambios */}
      {error ? (
        <div className="text-center p-8 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#C9B084] max-h-[70vh]">
          <table className="min-w-full divide-y divide-[#C9B084]">
            <thead className="bg-[#f9f6f2]">
              <tr>
                <Th>ID</Th>
                <Th>Fecha/Hora</Th>
                <Th>Lugar</Th>
                <Th>Estado</Th>
                <Th>Libros</Th>
                <Th>Participantes</Th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#C9B084]/50">
              {intercambios.map((inter) => (
                <tr key={inter.idIntercambio} className="hover:bg-gray-50">
                  <Td>{inter.idIntercambio}</Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <FiClock className="text-[#C9B084]"/>
                      {formatFechaHora(inter.fechaEncuentro)}
                    </div>
                  </Td>
                  <Td>{inter.lugarEncuentro || "Sin especificar"}</Td>
                  <Td>
                    <span className={`px-2 py-1 rounded-full text-sm ${estadoStyles[inter.estado]}`}>
                      {inter.estado}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="text-[#722F37] font-medium">Ofrecido: {inter.libro_ofrecido}</span>
                      <span className="text-[#5A252B]">Solicitado: {inter.libro_solicitado}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex flex-col">
                      <span className="text-[#722F37] font-medium">Solicitante: {inter.estudiante_ofrece}</span>
                      <span className="text-[#5A252B]">Ofertante: {inter.estudiante_recibe}</span>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {intercambios.length === 0 && (
            <div className="text-center py-8 text-[#5A252B]">
              <FiInfo className="inline-block mr-2"/> No se encontraron intercambios
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componentes auxiliares
const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-sm font-semibold text-[#722F37]">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#5A252B]">
    {children}
  </td>
);

const StatCard = ({ icon, title, value, color = "bg-[#722F37]/10", textColor = "text-[#5A252B]" }) => (
  <div className={`${color} p-4 rounded-lg flex items-center gap-4`}>
    <div className={`p-2 rounded-full ${textColor}`}>{icon}</div>
    <div>
      <p className="text-sm">{title}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  </div>
);

export default AdminIntercambios;
