// src/componentes/autenticacion/Registro.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import fondoSwap from '../../img/fondoSwap.webp';
import axios from 'axios';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [correoInstitucional, setCorreoInstitucional] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [mostrarConfirmarContrasenia, setMostrarConfirmarContrasenia] = useState(false);
  const [requisitosContrasenia, setRequisitosContrasenia] = useState({
    longitud: false,
    mayuscula: false,
    numero: false,
    especial: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const nuevosErrores = {};

    // Validaciones
    if (!nombre) nuevosErrores.nombre = 'El nombre es requerido';
    if (!correoInstitucional) {
      nuevosErrores.correoInstitucional = 'El correo es requerido';
    } else if (!esCorreoInstitucionalValido(correoInstitucional)) {
      nuevosErrores.correoInstitucional = 'Correo institucional inválido (debe tener dominio .edu)';
    }
    if (!contrasenia) {
      nuevosErrores.contrasenia = 'La contraseña es requerida';
    } else if (!validarContrasenia(contrasenia)) {
      nuevosErrores.contrasenia = 'La contraseña no cumple los requisitos';
    }
    if (contrasenia !== confirmarContrasenia) {
      nuevosErrores.confirmarContrasenia = 'Las contraseñas no coinciden';
    }

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const nuevoEstudiante = {
        nombre,
        correoInstitucional,
        contrasenia
      };
    
      await axios.post('http://127.0.0.1:8000/estudiantes/registro', nuevoEstudiante);
      setRegistroExitoso(true);
    } catch (error) {
      console.error('Error al crear el estudiante:', error.response?.data || error.message);
      setErrors({
        submit: error.response?.data?.message || 'Error al registrar. Inténtalo nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const esCorreoInstitucionalValido = (correo) => {
    const regex = /^[^@]+@[^@]+\.(edu)(\.[a-z]+)?$/i;
    return regex.test(correo);
  };

  const validarContrasenia = (password) => {
    const nuevosRequisitos = {
      longitud: password.length >= 8 && password.length <= 20,
      mayuscula: /[A-Z]/.test(password),
      numero: /[0-9]/.test(password),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setRequisitosContrasenia(nuevosRequisitos);
    return Object.values(nuevosRequisitos).every(Boolean);
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
            {/* Formulario de registro */}
            <div className="w-full md:w-[35%] flex justify-center p-8">
              <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-center mb-8">Registro</h1>

                {registroExitoso ? (
                  <div className="text-center">
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                      <p className="font-medium">¡Correo de verificación enviado!</p>
                      <p className="text-sm mt-1">Por favor revisa tu bandeja de entrada (incluyendo la carpeta de spam).</p>
                      <p className="text-sm mt-2">Esperando confirmación...</p>
                    </div>
                    <Link
                      to="/iniciar-sesion"
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Volver al inicio
                    </Link>
                  </div>
                ) : (
                  <>
                    {errors.submit && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {errors.submit}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                          type="text"
                          className={`w-full px-3 py-2 border ${
                            errors.nombre ? 'border-red-500' : 'border-gray-300'
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          placeholder="Ingresa tu nombre completo"
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                        />
                        {errors.nombre && (
                          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                        )}
                      </div>

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
                            onChange={(e) => {
                              setContrasenia(e.target.value);
                              validarContrasenia(e.target.value);
                            }}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setMostrarContrasenia(!mostrarContrasenia)}
                          >
                            {mostrarContrasenia ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                        <div className="mt-2 text-xs text-gray-600">
                          <p className={requisitosContrasenia.longitud ? 'text-green-500' : 'text-gray-500'}>
                            {requisitosContrasenia.longitud ? '✓' : '•'} Entre 8 y 20 caracteres
                          </p>
                          <p className={requisitosContrasenia.mayuscula ? 'text-green-500' : 'text-gray-500'}>
                            {requisitosContrasenia.mayuscula ? '✓' : '•'} Al menos una mayúscula
                          </p>
                          <p className={requisitosContrasenia.numero ? 'text-green-500' : 'text-gray-500'}>
                            {requisitosContrasenia.numero ? '✓' : '•'} Al menos un número
                          </p>
                          <p className={requisitosContrasenia.especial ? 'text-green-500' : 'text-gray-500'}>
                            {requisitosContrasenia.especial ? '✓' : '•'} Al menos un carácter especial (!@#$%^&*)
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                        <div className="relative">
                          <input
                            type={mostrarConfirmarContrasenia ? "text" : "password"}
                            className={`w-full px-3 py-2 border ${
                              errors.confirmarContrasenia ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="••••••••"
                            value={confirmarContrasenia}
                            onChange={(e) => setConfirmarContrasenia(e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setMostrarConfirmarContrasenia(!mostrarConfirmarContrasenia)}
                          >
                            {mostrarConfirmarContrasenia ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {errors.confirmarContrasenia && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmarContrasenia}</p>
                        )}
                      </div>

                      <div className="text-center text-sm">
                        <span className="text-gray-600">¿Ya tienes cuenta? </span>
                        <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                          Click aquí
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Marca y eslogan al lado derecho */}
            <div className="hidden md:flex w-[65%] items-center justify-center">
              <div className="max-w-xs ml-16">
                <h2 className="text-7xl font-extrabold text-white transition-all duration-300 hover:text-8xl hover:translate-x-[-150px]">SwaPBook</h2>
                <div className="grid grid-cols-1 gap-1 mt-2 font-bold text-white text-3xl">
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in">Reutiliza</div>
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in">Intercambia</div>
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in"> Conoce</div>
                  <div className="text-white text-3xl hover:text-4xl transition-all duration-200 ease-in">Libros</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-[#722F37] py-2">
          <div className="max-w-6xl mx-auto px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              
              {/* Columna Nosotros */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold border-b border-white/20 pb-2">Nosotros</h3>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="hover:text-gray-300 transition-colors">Formulario de contacto</a>
                  </li>
                  <li>
                    <a href="mailto:contacto@swapbook.edu" className="hover:text-gray-300 transition-colors">Correo Swapbook</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-300 transition-colors">Preguntas frecuentes</a>
                  </li>
                </ul>
              </div>

              {/* Columna Páginas Legales */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold border-b border-white/20 pb-2">Páginas legales</h3>
                <ul className="space-y-1">
                  <li>
                    <a href="#" className="hover:text-gray-300 transition-colors">Términos y condiciones</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-gray-300 transition-colors">Política de privacidad</a>
                  </li>
                </ul>
              </div>

              {/* Columna Información del Matorral */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold border-b border-white/20 pb-2">Información del Matorral</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://www.matorral.com.co" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Visita nuestro sitio web
                    </a>
                  </li>
                  <li className="text-sm text-white/80">
                    Plataforma desarrollada en colaboración con El Matorral
                  </li>
                </ul>
              </div>
            </div>

            {/* Derechos de autor */}
            <div className="mt-8 pt-2 border-t border-white/20 text-center text-white/70 text-sm">
              © {new Date().getFullYear()} SwaPBook.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Registro;