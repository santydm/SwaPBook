import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavbarCatalogo from "./NavbarCatalogo";
import SidebarCatalogo from "./SidebarCatalogo";
import PublicarLibro from "./PublicarLibro";
import Footer from "../ui/Footer";
import axios from "axios";
import LibroDetalleModal from "../estudiante/LibroDetalleModal";
import CardLibro from "../estudiante/CardLibro";

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

  // Cargar categorías
  useEffect(() => {
    axios.get("http://localhost:8000/categorias")
      .then(res => setCategorias(res.data))
      .catch(() => setCategorias([]));
  }, []);

  // Cargar libros
  useEffect(() => {
    const fetchLibros = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let url;
        let response;

        if (categoriaSeleccionada) {
          response = await axios.get(
            `http://127.0.0.1:8000/libros/catalogo/filtrar-por-categoria?categoria=${encodeURIComponent(categoriaSeleccionada)}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
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
  }, [estudiante, searchText, categoriaSeleccionada]);

  const handleSolicitarIntercambio = () => {
    setLibroSeleccionado(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const librosFiltrados = libros.filter(libro => libro.estado !== "Intercambio");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarCatalogo
        estudiante={estudiante}
        onPerfilClick={() => setShowSidebar(true)}
        searchText={searchText}
        onSearch={(text) => {
          setSearchText(text);
          setCategoriaSeleccionada("");
        }}
        categorias={categorias}
        categoriaSeleccionada={categoriaSeleccionada}
        onCategoriaChange={(cat) => {
          setCategoriaSeleccionada(cat);
          setSearchText("");
        }}
      />

      {/* Sidebar y modales (mantener igual) */}
      {estudiante && showSidebar && (
        <SidebarCatalogo
          estudiante={estudiante}
          onCrearLibro={() => setShowModal(true)}
          onClose={() => setShowSidebar(false)}
          handleLogout={handleLogout}
        />
      )}

      {estudiante && showModal && (
        <PublicarLibro isOpen={showModal} onClose={() => setShowModal(false)} />
      )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
            {librosFiltrados.map((libro) => (
              <CardLibro
                key={libro.idLibro}
                usuarioNombre={libro.estudiante?.nombre || "Usuario"}
                usuarioFoto={libro.estudiante?.fotoPerfil}
                fechaPublicacion={new Date(libro.fechaRegistro).toLocaleDateString()}
                fotoLibro={`http://localhost:8000${libro.foto}`}
                titulo={libro.titulo}
                autor={libro.autor}
                descripcion={libro.descripcion}
                categoria={libro.categoria?.nombre || "Sin categoría"}
                estado={libro.estado}
                onVerDetalles={() => setLibroSeleccionado(libro)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No hay libros disponibles en el catálogo.</p>
        )}
      </main>

      <LibroDetalleModal
        libro={libroSeleccionado ? {
          ...libroSeleccionado,
          fotoLibro: `http://localhost:8000${libroSeleccionado.foto}`,
          categoria: libroSeleccionado.categoria?.nombre,
          fechaPublicacion: new Date(libroSeleccionado.fechaRegistro).toLocaleDateString(),
          usuarioNombre: libroSeleccionado.estudiante?.nombre
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
