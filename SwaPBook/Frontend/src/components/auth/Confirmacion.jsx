// src/components/auth/Confirmacion.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fondoSwap from '../../img/fondoSwap.webp';

const Confirmacion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const status = urlParams.get('status');
  
    // Validación adicional para evitar el error de React
    if (!token || !status) {
      setError('Token o estado de verificación no encontrados');
      setLoading(false);
      return;
    }
  
    if (status === 'success' && token) {
      localStorage.setItem('token', token);
      setSuccess(true);
      // Elimina el setTimeout para que no redirija automáticamente
    } else {
      setError(urlParams.get('error') || 'Error en la verificación');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-Swap-beige" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Verificando tu cuenta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h1 className="text-2xl font-bold text-center mb-4">Error de Verificación</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/registro"
            className="inline-block py-2 px-6 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto"
          >
            Volver al Registro
          </Link>
        </div>
      </div>
    );
  }

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
            {success ? 'Tu cuenta ha sido verificada correctamente. Redirigiendo...' : 'Verificación completada.'}
          </p>
          <Link
              to="/Perfil"
              className="inline-block py-2 px-6 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto"
              onClick={() => localStorage.removeItem('token')}>
              Ir al Perfil
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmacion;
