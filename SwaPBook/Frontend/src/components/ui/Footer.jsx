// src/components/ui/Footer.jsx
const Footer = () => (
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
  );
  
  export default Footer;
  