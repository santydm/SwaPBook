// src/componentes/autenticacion/OlvideContrasenia.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import fondoSwap from '../../img/fondoSwap.webp';
import axios from 'axios';

const OlvideContrasenia = () => {
  const [correoInstitucional, setCorreoInstitucional] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensajeExito('');

    const nuevosErrores = {};

    if (!correoInstitucional) {
      nuevosErrores.correoInstitucional = 'El correo es requerido';
    } else if (!esCorreoInstitucionalValido(correoInstitucional)) {
      nuevosErrores.correoInstitucional = 'Correo institucional inválido (debe tener dominio .edu)';
    }

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría la llamada a tu API para recuperar contraseña
      await axios.post('http://127.0.0.1:8000/auth/recuperar-contrasenia', {
        correoInstitucional
      });
      
      setMensajeExito('¡Correo enviado! Por favor revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error al solicitar recuperación:', error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.message || 'Error al solicitar recuperación. Inténtalo nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const esCorreoInstitucionalValido = (correo) => {
    const regex = /^[^@]+@[^@]+\.(edu)(\.[a-z]+)?$/i;
    return regex.test(correo);
  };

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

      {/* Contenido principal - Formulario centrado */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-6">Recuperar Contraseña</h1>
          
          {mensajeExito ? (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
              {mensajeExito}
              <div className="mt-4">
                <Link 
                  to="/iniciar-sesion" 
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 text-center mb-6">
                Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional</label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border ${
                      errors.correoInstitucional ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="correo@institucion.edu"
                    value={correoInstitucional}
                    onChange={(e) => setCorreoInstitucional(e.target.value)}
                  />
                  {errors.correoInstitucional && (
                    <p className="mt-1 text-sm text-red-600">{errors.correoInstitucional}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                </button>
              </form>

              <div className="mt-4 text-center text-sm">
                <Link 
                  to="/Login" 
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OlvideContrasenia;