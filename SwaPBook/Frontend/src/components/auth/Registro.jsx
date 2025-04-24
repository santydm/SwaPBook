// src/componentes/autenticacion/Registro.jsx
import { Link } from 'react-router-dom';
import fondoSwap from '../../img/fondoSwap.webp';

const Registro = () => {
  return (
    <div className="min-h-screen relative">
      {/* Fondo dividido */}
      <div className="absolute inset-0 flex z-0">
        {/* Espacio blanco del 35% - solo fondo */}
        <div className="hidden md:block w-[35%] bg-white"></div>
        
        {/* Sección con imagen de fondo */}
        <div 
          className="flex-grow"
          style={{ 
            backgroundImage: `url(${fondoSwap})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Capa semitransparente para mejor legibilidad */}
<div className="hidden md:block absolute left-[35%] top-0 w-[65%] h-full bg-black bg-opacity-80"></div>
        </div>
      </div>

      {/* Contenido principal (sobrepuesto al fondo) */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-grow flex items-center p-4">
          <div className="w-full flex flex-col md:flex-row">
            {/* Formulario de registro (en el 35% izquierdo) */}
            <div className="w-full md:w-[35%] flex justify-center p-8">
              <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-center mb-8">Registro</h1>
                
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo institucional</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="correo@institucion.edu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">¿Ya tienes cuenta? </span>
                    <Link to="/iniciar-sesion" className="text-blue-600 hover:text-blue-500 font-medium">
                      Click aquí
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-Swap-vinotinto focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Registrarse
                  </button>
                </form>
              </div>
            </div>

            {/* Marca y eslogan al lado derecho (en el 65% restante) */}
            <div className="hidden md:flex w-[65%] items-center justify-center">
              <div className="max-w-xs ml-16">
                <h2 className="text-7xl font-extrabold text-white">SwaPBook</h2>
                <div className="grid grid-cols-1 gap-1 mt-2 font-bold text-white text-3xl">
                  <div>Reutiliza</div>
                  <div>Intercambia</div>
                  <div>Conoce</div>
                  <div>Libros</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-[#722F37] py-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-4 text-center text-white text-sm">
              <div className="space-y-1">
                <p className="font-medium">Contratantes</p>
                <p>Privacidad</p>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">Políticas</p>
                <p>Términos y condiciones</p>
              </div>
              
              <div className="space-y-1">
                <p className="font-medium">Quiénes somos</p>
                <p>Libertas</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Registro;