import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import CardLibro from "../../components/estudiante/CardLibro";
import LibroDetalleModal from "../../components/estudiante/LibroDetalleModal";
import Navbar from "../../components/ui/Navbar";
import PublicarLibro from "../../components/catalog/PublicarLibro"; // Ajusta la ruta si es necesario

const MisLibros = () => {
  const navigate = useNavigate();
  const [libros, setLibros] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [showModalPublicar, setShowModalPublicar] = useState(false);

  useEffect(() => {
    const fetchMisLibros = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const perfilResponse = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setEstudiante(perfilResponse.data);
        const idEstudiante = perfilResponse.data.idEstudiante;
        const librosResponse = await axios.get(`http://127.0.0.1:8000/libros/mis-libros/${idEstudiante}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setLibros(librosResponse.data);
      } catch (error) {
        console.error('Error al obtener libros:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('No se pudieron cargar tus libros. Por favor, intenta nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMisLibros();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditarLibro = (libro) => {
    // Implementar lógica para editar libro
    console.log("Editar libro:", libro);
  };

  const handleEliminarLibro = async (idLibro) => {
    if (!confirm("¿Estás seguro de eliminar este libro?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/libros/${idLibro}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setLibros(prevLibros => prevLibros.filter(libro => libro.idLibro !== idLibro));
      setLibroSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      alert("No se pudo eliminar el libro. Intenta nuevamente.");
    }
  };

  // Refrescar libros después de publicar uno nuevo
  const handleLibroPublicado = () => {
    setShowModalPublicar(false);
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  return (
    <>
      <Navbar usuario={estudiante} />
      <div className="min-h-screen flex items-center justify-center bg-Swap-cream">
        <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* Panel lateral */}
          <PanelPerfil handleLogout={handleLogout} />

          {/* Sección de libros scrollable */}
          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-6 gap-3">
              <h1 className="text-2xl font-bold text-[#722F37] text-center flex-1">
                Mis libros
              </h1>
              <button
                onClick={() => setShowModalPublicar(true)}
                className="py-2 px-5 bg-Swap-green text-white rounded-md font-semibold hover:bg-Swap-green-dark transition-colors shadow"
              >
                + Publicar libro
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
                <span className="ml-4 text-[#722F37] font-semibold">Cargando tus libros...</span>
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : libros.length > 0 ? (
              <div className="w-full">
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center max-h-[70vh] overflow-y-auto pr-2"
                  style={{ minHeight: "200px" }}
                >
                  {libros.map((libro) => (
                    <CardLibro
                      key={libro.idLibro}
                      usuarioNombre={"Tú"}
                      usuarioFoto={estudiante?.fotoPerfil || ""}
                      fechaPublicacion={new Date(libro.fechaRegistro || Date.now()).toLocaleDateString()}
                      fotoLibro={`http://localhost:8000${libro.foto}`}
                      titulo={libro.titulo || "Sin título"}
                      autor={libro.autor || "Autor desconocido"}
                      categoria={libro.categoria?.nombre || "Sin categoría"}
                      descripcion={libro.descripcion || ""}
                      estado={libro.estado || "Desconocido"}
                      esPropio={true}
                      onVerDetalles={() => setLibroSeleccionado(libro)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No tienes libros publicados. ¡Comienza creando uno desde el catálogo!
              </p>
            )}
          </div>
        </div>

        {/* Modal de publicación de libro */}
        {showModalPublicar && (
          <PublicarLibro
            isOpen={showModalPublicar}
            onClose={() => setShowModalPublicar(false)}
            onLibroPublicado={handleLibroPublicado}
          />
        )}

        {/* Modal de detalles */}
        <LibroDetalleModal
          libro={libroSeleccionado ? {
            ...libroSeleccionado,
            usuarioNombre: "Tú",
            fotoLibro: libroSeleccionado ? `http://localhost:8000${libroSeleccionado.foto}` : "",
            categoria: libroSeleccionado?.categoria?.nombre || "Sin categoría",
            fechaPublicacion: new Date(libroSeleccionado?.fechaRegistro || Date.now()).toLocaleDateString()
          } : null}
          isOpen={!!libroSeleccionado}
          onClose={() => setLibroSeleccionado(null)}
          esPropio={true}
          onEditarLibro={handleEditarLibro}
          onEliminarLibro={handleEliminarLibro}
        />
      </div>
    </>
  );
};

export default MisLibros;
