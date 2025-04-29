// src/components/estudiante/PanelPerfil.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PanelPerfil = ({ handleLogout, compact = false }) => {
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstudiante = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No hay sesión activa');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/estudiantes/perfil', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setEstudiante(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar datos del perfil');
        setLoading(false);
      }
    };

    fetchEstudiante();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div
      className={
        compact
          ? "w-full bg-white p-4 rounded-lg shadow-md flex flex-col"
          : "w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md flex flex-col"
      }
    >
      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden border-4 border-[#722F37]">
          <img 
            src={
              estudiante?.fotoPerfil ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(estudiante?.nombre || 'Usuario')}&background=722F37&color=fff&size=150`
            }
            alt="Foto de perfil" 
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-lg font-bold text-[#722F37] text-center">{estudiante?.nombre || "Nombre no disponible"}</h2>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link to="/perfil" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700 text-center">
              Mi perfil
            </Link>
          </li>
          <li>
            <Link to="/modificar-perfil" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700 text-center">
              Modificar perfil
            </Link>
          </li>
          <li>
            <Link to="/mis-libros" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700 text-center">
              Mis libros
            </Link>
          </li>
          <li>
            <Link to="/mis-solicitudes" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700 text-center">
              Mis solicitudes
            </Link>
          </li>
          <li>
            <Link to="/mis-intercambios" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700 text-center">
              Mis intercambios
            </Link>
          </li>
          <li>
            <Link to="/seguridad" className="block py-2 px-3 hover:bg-gray-100 rounded text-gray-700 text-center">
              Seguridad
            </Link>
          </li>
        </ul>
      </nav>

      <button 
        className="mt-8 py-2 px-4 bg-Swap-beige text-white rounded-md hover:bg-Swap-vinotinto transition-colors"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default PanelPerfil;
