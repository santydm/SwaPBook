import { Link } from "react-router-dom";
import { FiBook } from "react-icons/fi";

const Footer = () => (
  <footer className="bg-[#722F37] text-white py-4">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FiBook className="text-2xl" />
            <span className="text-xl font-bold">SwaPBook</span>
          </div>
          <p className="text-gray-300">
            La plataforma de intercambio de libros que conecta estudiantes universitarios.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Enlaces</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/about" className="hover:text-white">Acerca de</Link>
            </li>
            <li>
              <Link to="/catalogo" className="hover:text-white">Catálogo</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">Contacto</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Soporte</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link to="/help" className="hover:text-white">Ayuda</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white">Términos</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white">Privacidad</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">El Matorral</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Cra. 19 # 36-55</li>
            <li>Teusaquillo, Bogotá</li>
            <li>Lun-Sáb: 10AM-8PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-4 pt-2 text-center text-gray-300">
        <p>&copy; 2025 SwaPBook. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
