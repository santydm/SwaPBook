import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import IntercambioCard from "../../components/intercambios/IntercambioCard";
import IntercambioDetalleModal from "../../components/intercambios/IntercambioDetalleModal";
import Navbar from "../../components/ui/Navbar";

const MisIntercambios = () => {
  const navigate = useNavigate();
  const [intercambios, setIntercambios] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [intercambioSeleccionado, setIntercambioSeleccionado] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    const fetchIntercambios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const perfil = await axios.get('http://localhost:8000/estudiantes/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setEstudiante(perfil.data);
        const response = await axios.get(
          `http://localhost:8000/intercambios/mis-intercambios/${perfil.data.idEstudiante}?estado=En%20proceso`,
          { params: { estado: "En proceso" }, 
            headers: { Authorization: `Bearer ${token}` } }
        );

        setIntercambios(response.data);
      } catch (error) {
        console.error("Error fetching intercambios:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Error al cargar intercambios activos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchIntercambios();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const actualizarEstadoIntercambio = async (idIntercambio, nuevoEstado) => {
    setProcesando(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8000/intercambios/actualizar-estado/${idIntercambio}`,
        { nuevo_estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIntercambios(prev => prev.filter(i => i.idIntercambio !== idIntercambio));
      alert(`Intercambio ${nuevoEstado} correctamente!`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <>
      <Navbar usuario={estudiante} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          <PanelPerfil handleLogout={handleLogout} />

          <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
            <h1 className="text-2xl font-bold text-[#722F37] mb-6">Intercambios Activos</h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-Swap-beige border-t-transparent rounded-full"></div>
                <span className="ml-4 text-[#722F37] font-semibold">Cargando intercambios...</span>
              </div>
            ) : error ? (
              <div className="text-center p-4 text-red-600">{error}</div>
            ) : intercambios.length > 0 ? (
              <div className="w-full space-y-4">
                {intercambios.map((intercambio) => (
                  <IntercambioCard
                    key={intercambio.idIntercambio}
                    intercambio={intercambio}
                    onVerDetalles={() => setIntercambioSeleccionado(intercambio)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No tienes intercambios activos actualmente
              </p>
            )}
          </div>
        </div>

        {intercambioSeleccionado && (
          <IntercambioDetalleModal
            intercambio={intercambioSeleccionado}
            isOpen={!!intercambioSeleccionado}
            onClose={() => setIntercambioSeleccionado(null)}
            onFinalizar={(id) => actualizarEstadoIntercambio(id, "Finalizado")}
            onCancelar={(id) => actualizarEstadoIntercambio(id, "Cancelado")}
            procesando={procesando}
          />
        )}
      </div>
    </>
  );
};

export default MisIntercambios;
