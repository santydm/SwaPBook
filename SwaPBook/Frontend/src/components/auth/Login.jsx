import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fondoSwap from '../../img/fondoSwap.webp';
import axios from 'axios';
import Footer from '../ui/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [correoInstitucional, setCorreoInstitucional] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const esCorreoInstitucionalValido = (correo) => {
    const regex = /^[^@]+@[^@]+\.(edu)(\.[a-z]+)?$/i;
    return regex.test(correo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const nuevosErrores = {};
    if (!correoInstitucional) {
      nuevosErrores.correoInstitucional = 'El correo es requerido';
    } else if (!esCorreoInstitucionalValido(correoInstitucional)) {
      nuevosErrores.correoInstitucional = 'Correo institucional inválido (debe tener dominio .edu)';
    }
    if (!contrasenia) {
      nuevosErrores.contrasenia = 'La contraseña es requerida';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/login', {
        correoInstitucional,
        contrasenia
      }, { timeout: 10000 }); // 10 segundos de timeout

      if (!response.data.access_token) {
        throw new Error('El servidor no devolvió un token válido');
      }

      localStorage.setItem('token', response.data.access_token);
      navigate('/catalogo');
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage = 'Tiempo de espera agotado. El servidor no responde.';
        } else if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Credenciales incorrectas';
          } else if (error.response.data?.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.request) {
          errorMessage = 'No se recibió respuesta del servidor';
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Fondo dividido */}
      <div className="absolute inset-0 flex z-0">
        <div className="hidden md:block w-[35%] bg-white"></div>
        <div 
          className="flex-grow"
          style={{
            backgroundImage: `url(${fondoSwap})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="hidden md:block absolute left-[35%] top-0 w-[65%] h-full bg-black bg-opacity-80"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-grow flex items-center p-4">
          <div className="w-full flex flex-col md:flex-row">
            {/* Formulario de login */}
            <div className="w-full md:w-[35%] flex justify-center p-8">
              <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-center mb-8">Iniciar Sesión</h1>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <div className="relative">
                      <input
                        type={mostrarContrasenia ? "text" : "password"}
                        className={`w-full px-3 py-2 border ${
                          errors.contrasenia ? 'border-red-500' : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="••••••••"
                        value={contrasenia}
                        onChange={(e) => setContrasenia(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                        tabIndex={-1}
                      >
                        {mostrarContrasenia ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.contrasenia && (
                      <p className="mt-1 text-sm text-red-600">{errors.contrasenia}</p>
                    )}
                  </div>
                  <div className="column justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-600">¿No tienes cuenta? </span>
                      <Link to="/registro" className="text-blue-600 hover:text-blue-500 font-medium">Regístrate aquí</Link>
                    </div>
                    <Link to="/recuperacion-clave" className="text-blue-600 hover:text-blue-500 font-medium">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block mr-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Marca y eslogan */}
            <div className="hidden md:flex w-[65%] items-center justify-center">
              <div className="max-w-xs ml-16">
                <h2 className="text-7xl font-extrabold text-white transition-all duration-300 hover:text-8xl hover:translate-x-[-150px]">SwaPBook</h2>
                <div className="grid grid-cols-1 gap-1 mt-2 font-bold text-white text-3xl">
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in">Reutiliza</div>
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in">Intercambia</div>
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in">Conoce</div>
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in">Libros</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Login;
