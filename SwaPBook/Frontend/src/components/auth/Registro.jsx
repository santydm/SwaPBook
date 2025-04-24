// src/componentes/autenticacion/Registro.jsx
import { Link } from 'react-router-dom';

const Registro = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Registro</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
              Correo institucional
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="correo@institucion.edu"
            />
          </div>

          <div>
            <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmar-contraseña" className="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmar-contraseña"
              name="confirmar-contraseña"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div className="text-center">
            <Link to="/iniciar-sesion" className="text-sm text-blue-600 hover:text-blue-500">
              ¿Ya tienes cuenta? Click aquí
            </Link>
          </div>

          <button
            type="button" // Cambiado a type="button" para evitar envío
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Registrarse
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold">SwaPBook</h2>
        <p className="text-gray-600">Reutiliza Intercambia Conoce Libros</p>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-500">
          <div>
            <p className="font-medium">Contratantes</p>
            <p>Privacidad</p>
          </div>
          <div>
            <p className="font-medium">Políticas</p>
            <p>Términos y condiciones</p>
          </div>
          <div>
            <p className="font-medium">Quiénes somos</p>
            <p>Libertas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;