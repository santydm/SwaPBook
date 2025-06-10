import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Cardlibro from "/src/components/estudiante/CardLibro.jsx";
import { FiLoader, FiSearch, FiBookOpen, FiTrendingUp } from "react-icons/fi";

const AdminLibros = () => {
  const [libros, setLibros] = useState([]);
  const [topLibros, setTopLibros] = useState([]);
  const [totalLibros, setTotalLibros] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeout = useRef(null);

  // Obtener todos los libros publicados (con filtro)
  const fetchLibros = async (query = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = query
        ? `http://localhost:8000/admin/libros/filtrar?search=${encodeURIComponent(query)}`
        : "http://localhost:8000/admin/libros";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLibros(res.data);
      setError("");
    } catch (error) {
      setError("Error al cargar libros");
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas y top libros
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [totalRes, topRes] = await Promise.all([
        axios.get("http://localhost:8000/admin/estadisticas/total-libros", { headers }),
        axios.get("http://localhost:8000/admin/estadisticas/top-libros", { headers }),
      ]);
      setTotalLibros(totalRes.data.total_libros);
      setTopLibros(topRes.data);
    } catch (error) {
      // No acción, se maneja en fetchLibros
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchLibros(searchTerm);
    }, 500);
    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line
  }, [searchTerm]);

  useEffect(() => {
    fetchLibros();
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FiLoader className="animate-spin text-4xl text-[#722F37] mb-4" />
        <span className="text-[#5A252B]">Cargando libros...</span>
      </div>
    );
  }

    return (
    <div className="bg-white rounded-xl shadow border border-gray-200 max-w-7xl mx-auto p-8 flex flex-col gap-6">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold text-[#722F37]">Gestión de Libros</h1>

      {/* Estadísticas compactas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#722F37]/10 p-4 rounded-lg flex items-center gap-4 border border-[#722F37]/20">
          <FiBookOpen className="text-2xl text-[#722F37]" />
          <div>
            <p className="text-sm text-[#5A252B]">Libros publicados</p>
            <p className="text-2xl font-bold text-[#722F37]">{totalLibros}</p>
          </div>
        </div>
        
        <div className="col-span-2 bg-[#f9f6f2] p-4 rounded-lg shadow border border-[#C9B084]/30">
          <div className="flex items-center gap-2 mb-3">
            <FiTrendingUp className="text-[#C9B084] text-xl" />
            <span className="font-semibold text-[#722F37]">Top libros más intercambiados</span>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {topLibros.length > 0 ? (
              <ol className="space-y-2">
                {topLibros.map((libro, index) => (
                  <li key={index} className="flex items-center justify-between px-3 py-2 bg-white rounded-md shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        index === 0 ? "text-amber-600" : 
                        index === 1 ? "text-gray-500" : 
                        "text-[#C9B084]"
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="text-sm text-[#5A252B]">{libro.titulo}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#722F37]">
                      {libro.cantidad} intercambios
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500 text-sm">No hay datos de tendencias</p>
            )}
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="w-full relative mt-4">
        <input
          type="text"
          placeholder="Buscar por título, autor, categoría o estudiante..."
          className="w-full pl-12 pr-4 py-3 border-2 border-[#C9B084] rounded-xl focus:ring-2 focus:ring-[#722F37] focus:border-[#722F37] text-[#5A252B]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FiSearch className="absolute left-4 top-4 text-[#5A252B] text-xl" />
      </div>

      {/* Bandeja de libros */}
      <div className="rounded-lg border border-[#C9B084] max-h-[800px] overflow-y-auto">
        {error ? (
          <div className="text-center p-8 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {libros.map((libro) => (
              <Cardlibro 
                key={libro.idLibro}
                usuarioNombre={libro.estudiante?.nombre || "Anónimo"}
                usuarioFoto={
                  libro.estudiante?.foto
                    ? libro.estudiante.foto.startsWith("http")
                      ? libro.estudiante.foto
                      : `http://localhost:8000${libro.estudiante.foto}`
                    : null
                }
                fechaPublicacion={
                  libro.fechaPublicacion
                    ? new Date(libro.fechaPublicacion).toLocaleDateString('es-ES')
                    : ""
                }
                fotoLibro={
                  libro.foto
                    ? libro.foto.startsWith("http")
                      ? libro.foto
                      : `http://localhost:8000${libro.foto}`
                    : "/images/book-placeholder.png"
                }
                titulo={libro.titulo}
                autor={libro.autor}
                categoria={libro.categoria || "Sin categoría"}
                descripcion={libro.descripcion}
                estado={libro.estado}
                onVerDetalles={() => {}}
              />
            ))}
          </div>
        )}
        
        {libros.length === 0 && !loading && (
          <div className="text-center p-8 text-[#5A252B]">
            No se encontraron libros con los criterios de búsqueda
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLibros;