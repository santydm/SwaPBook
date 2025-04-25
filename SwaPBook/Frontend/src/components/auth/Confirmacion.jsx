// src/components/auth/Confirmacion.jsx
import { Link } from 'react-router-dom';
import fondoSwap from '../../img/fondoSwap.webp';
import { useEffect } from 'react';
import axios from 'axios';

const Confirmacion = () => {
  // Aquí podrías extraer un token de la URL si es necesario
  // const { token } = useParams(); // Si usas parámetros en la ruta

  useEffect(() => {
    // Llamar al endpoint de confirmación cuando el componente se monta
    const confirmarCuenta = async () => {
      try {
        // Ejemplo con token en URL (ajusta según tu implementación backend)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token) {
          await axios.get(`http://127.0.0.1:8000/estudiantes/cuenta-activada?token=${token}`);
        }
      } catch (error) {
        console.error('Error al confirmar cuenta:', error);
      }
    };

    confirmarCuenta();
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Fondo completo */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full"
          style={{ 
            backgroundImage: `url(${fondoSwap})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="w-full h-full bg-black bg-opacity-80"></div>
        </div>
      </div>

      {/* Contenido principal - Mensaje de confirmación */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="text-3xl font-bold text-center mb-4">¡Confirmación Exitosa!</h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión.
          </p>
          <Link
            to="/iniciar-sesion"
            className="inline-block py-2 px-6 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ir al Inicio de Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmacion;