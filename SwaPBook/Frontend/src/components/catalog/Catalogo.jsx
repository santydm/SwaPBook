import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavbarCatalogo from "./NavbarCatalogo";
import SidebarCatalogo from "./SidebarCatalogo";
import PublicarLibro from "./PublicarLibro";
import Footer from "../ui/Footer";
import axios from "axios";
import LibroDetalleModal from "../estudiante/LibroDetalleModal";

const Catalogo = () => {
  const navigate = useNavigate();
  const [estudiante, setEstudiante] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  // Cargar usuario si hay token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setEstudiante(res.data))
      .catch(() => setEstudiante(null));
    } else {
      setEstudiante(null);
    }
  }, []);
  useEffect(() => {
  axios.get("http://localhost:8000/categorias")
    .then(res => setCategorias(res.data))
    .catch(() => setCategorias([]));
}, []);


// Catalogo.jsx
useEffect(() => {
  const fetchLibros = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url;
      let response;

      if (categoriaSeleccionada) {
        // Usar el endpoint de categoría con autenticación
        response = await axios.get(
          `http://127.0.0.1:8000/libros/catalogo/filtrar-por-categoria?categoria=${encodeURIComponent(categoriaSeleccionada)}`,
          {
            headers: { 
              Authorization: `Bearer ${token}` 
            }
          }
        );
      } else {
        // Búsqueda normal
        url = estudiante?.idEstudiante 
          ? `http://127.0.0.1:8000/libros/catalogo/${estudiante.idEstudiante}?search=${encodeURIComponent(searchText)}`
          : `http://127.0.0.1:8000/libros/catalogo/0?search=${encodeURIComponent(searchText)}`;
        
        response = await axios.get(url);
      }

      setLibros(response.data);
    } catch (error) {
      console.error("Error al cargar libros:", error);
      setLibros([]);
    } finally {
      setLoading(false);
    }
  };
  fetchLibros();
}, [estudiante, searchText, categoriaSeleccionada]); // <--- Añadir categoriaSeleccionada como dependencia



  const handleSolicitarIntercambio = () => {
    alert("¡Solicitud de intercambio enviada con éxito! Te notificaremos cuando el propietario responda.");
    setLibroSeleccionado(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Filtrar libros que no estén en estado "Intercambio"
  const librosFiltrados = libros.filter(
    (libro) => libro.estado !== "Intercambio"
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarCatalogo
        estudiante={estudiante}
        onPerfilClick={() => setShowSidebar(true)}
        searchText={searchText}
        onSearch={(text) => {
          setSearchText(text);
          setCategoriaSeleccionada(""); // Limpiar categoría al buscar
        }}
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        onCategoriaChange={(cat) => {
          setCategoriaSeleccionada(cat);
          setSearchText(""); // Limpiar búsqueda al seleccionar categoría
        }}
      />
      {/* Sidebar solo si logeado */}
      {estudiante && showSidebar && (
        <SidebarCatalogo
          estudiante={estudiante}
          onCrearLibro={() => setShowModal(true)}
          onClose={() => setShowSidebar(false)}
          handleLogout={handleLogout}
        />
      )}

      {/* Modal crear libro solo si logeado */}
      {estudiante && showModal && (
        <PublicarLibro isOpen={showModal} onClose={() => setShowModal(false)} />
      )}

      {/* Si NO logeado, muestra botones en vez de sidebar/modal */}
      {!estudiante && showSidebar && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 flex flex-col items-center justify-center">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowSidebar(false)}
          >
            &times;
          </button>
          <div className="flex flex-col gap-4 mt-20">
            <Link to="/login" className="w-48 py-2 px-4 bg-Swap-beige text-white rounded-md text-center font-bold hover:bg-[#a67c52]">Iniciar sesión</Link>
            <Link to="/registro" className="w-48 py-2 px-4 bg-[#722F37] text-white rounded-md text-center font-bold hover:bg-[#a67c52]">Registrarse</Link>
          </div>
        </div>
      )}

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 text-[#722F37]">Catálogo de Libros</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
            <span className="ml-4 text-[#722F37] font-semibold">Cargando libros...</span>
          </div>
        ) : librosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {librosFiltrados.map((libro) => (
              <div key={libro.idLibro} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
                <img
                  src={`http://localhost:8000${libro.foto}`}
                  alt={libro.titulo}
                  className="h-40 w-full object-cover rounded mb-4"
                />
                <h3 className="text-xl font-semibold text-[#722F37]">{libro.titulo}</h3>
                <p className="text-gray-600">{libro.autor}</p>
                <p className="text-sm text-gray-500 mt-2">{libro.descripcion}</p>
                <span className="mt-2 inline-block bg-Swap-beige text-white text-xs px-2 py-1 rounded">
                  {libro.categoria?.nombre || "Sin categoría"}
                </span>
                <button 
                  className="mt-4 w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-[#a67c52] transition-colors"
                  onClick={() => setLibroSeleccionado(libro)}
                >
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No hay libros disponibles en el catálogo.</p>
        )}
      </main>

      {/* Modal de detalles */}
      <LibroDetalleModal
        libro={libroSeleccionado ? {
          ...libroSeleccionado,
          fotoLibro: libroSeleccionado ? `http://localhost:8000${libroSeleccionado.foto}` : "",
          categoria: libroSeleccionado?.categoria?.nombre || "Sin categoría",
          fechaPublicacion: new Date(libroSeleccionado?.fechaRegistro || Date.now()).toLocaleDateString(),
          usuarioNombre: libroSeleccionado?.estudiante?.nombre || "Usuario"
        } : null}
        isOpen={!!libroSeleccionado}
        onClose={() => setLibroSeleccionado(null)}
        esPropio={false}
        onSolicitarIntercambio={handleSolicitarIntercambio}
      />

      <Footer />
    </div>
  );
};

export default Catalogo;
