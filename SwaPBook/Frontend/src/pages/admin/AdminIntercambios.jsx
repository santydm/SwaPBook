import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiLoader, FiSearch, FiRepeat, FiCheckCircle, FiXCircle } from "react-icons/fi";
import IntercambioCard from "../../components/intercambios/IntercambioCard";

const AdminIntercambios = () => {
  const [intercambios, setIntercambios] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    realizados: 0,
    cancelados: 0,
    en_proceso: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef(null);

  const estadoColor = {
    "en proceso": "bg-yellow-100 text-yellow-800",
    "finalizado": "bg-green-100 text-green-800",
    "cancelado": "bg-red-100 text-red-800",
  };

  const fetchIntercambios = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = query
        ? `http://localhost:8000/admin/estadisticas/intercambios/filtrar?search=${encodeURIComponent(query)}`
        : "http://localhost:8000/admin/estadisticas/intercambios";
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Transformar datos para compatibilidad con el componente IntercambioCard
      const formattedData = res.data.intercambios.map(inter => ({
        ...inter,
        libro_ofrecido: {
          foto: inter.libroOfrecido?.foto || "",
          titulo: inter.libroOfrecido?.titulo || "Libro no disponible"
        },
        libro_solicitado: {
          foto: inter.libroSolicitado?.foto || "",
          titulo: inter.libroSolicitado?.titulo || "Libro no disponible"
        },
        estudiante: {
          fotoPerfil: inter.solicitante?.foto_perfil || "",
          nombre: inter.solicitante?.nombre || "Anónimo"
        },
        estudiante_receptor: {
          fotoPerfil: inter.ofertante?.foto_perfil || "",
          nombre: inter.ofertante?.nombre || "Anónimo"
        }
      }));

      setIntercambios(formattedData);
      setError("");
    } catch (error) {
      setError("Error al cargar intercambios");
      console.error("Error fetching intercambios:", error);
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
      // Si el backend no devuelve total_en_proceso, se puede calcular:
      // en_proceso = total - realizados - cancelados
      setStats({
        total: res.data.total_creados,
        realizados: res.data.total_finalizados,
        cancelados: res.data.total_cancelados,
        en_proceso: res.data.total_en_proceso !== undefined
          ? res.data.total_en_proceso
          : res.data.total_creados - res.data.total_finalizados - res.data.total_cancelados
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
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
      <h1 className="text-3xl font-bold text-[#722F37]">Gestión de Intercambios</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#722F37]/10 p-4 rounded-lg flex items-center gap-4 border border-[#722F37]/20">
          <FiRepeat className="text-2xl text-[#722F37]" />
          <div>
            <p className="text-sm text-[#5A252B]">Total de intercambios</p>
            <p className="text-2xl font-bold text-[#722F37]">{stats.total}</p>
          </div>
        </div>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg flex items-center gap-4">
          <FiRepeat className="text-2xl" />
          <div>
            <p className="text-sm">En proceso</p>
            <p className="text-2xl font-bold">{stats.en_proceso}</p>
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

      {/* Listado de intercambios */}
      {error ? (
        <div className="text-center p-8 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {intercambios.map((inter) => (
            <IntercambioCard 
              key={inter.idIntercambio}
              intercambio={inter}
              classNameAdmin={estadoColor[inter.estado?.toLowerCase()]}
              onVerDetalles={() => {/* Implementar lógica de detalles */}}
            />
          ))}
          
          {intercambios.length === 0 && (
            <div className="col-span-full text-center py-8 text-[#5A252B]">
              No se encontraron intercambios con los criterios de búsqueda
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminIntercambios;
