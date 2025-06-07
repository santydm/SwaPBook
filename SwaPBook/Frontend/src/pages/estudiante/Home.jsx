import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiStar, FiMapPin, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay usuario logeado al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://127.0.0.1:8000/estudiantes/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUsuario(res.data))
      .catch(() => setUsuario(null))
      .finally(() => setLoading(false));
    } else {
      setUsuario(null);
      setLoading(false);
    }
  }, []);

  // Redirección automática si intentan ir a /login o /registro estando logeados
  // (esto se hace mejor en las rutas privadas, pero aquí mostramos la idea)

  // Renderizado condicional basado en estado de autenticación
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiBook className="text-2xl text-[#722F37]" />
            <span className="text-2xl font-bold text-[#722F37]">SwapBook</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#como-funciona" className="text-gray-600 hover:text-[#722F37]">¿Cómo funciona?</a>
            <a href="#beneficios" className="text-gray-600 hover:text-[#722F37]">Beneficios</a>
            <a href="#matorral" className="text-gray-600 hover:text-[#722F37]">El Matorral</a>
          </nav>
          <div className="flex gap-3">
            {loading ? null : usuario ? (
              <>
                <Link
                  to="/catalogo"
                  className="px-4 py-2 bg-Swap-beige text-white rounded-md hover:bg-[#a67c52] transition-colors"
                >
                  Ir al catálogo
                </Link>
                <Link
                  to="/perfil"
                  className="px-4 py-2 text-[#722F37] border border-[#722F37] rounded-md hover:bg-[#722F37] hover:text-white transition-colors"
                >
                  Mi perfil
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#722F37] border border-[#722F37] rounded-md hover:bg-[#722F37] hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="px-4 py-2 bg-Swap-beige text-white rounded-md hover:bg-[#a67c52] transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f9f6f2] to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#722F37] mb-6">
            Intercambia libros,
            <span className="text-Swap-beige"> conecta conocimiento</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plataforma que conecta estudiantes universitarios para intercambiar libros académicos.
            Ahorra dinero, ayuda al medio ambiente y amplía tu biblioteca personal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {loading ? null : usuario ? (
              <>
                <Link
                  to="/catalogo"
                  className="px-8 py-4 bg-Swap-beige text-white text-lg font-semibold rounded-lg hover:bg-[#a67c52] transition-colors flex items-center justify-center gap-2"
                >
                  Ir al catálogo <FiArrowRight />
                </Link>
                <Link
                  to="/perfil"
                  className="px-8 py-4 border-2 border-[#722F37] text-[#722F37] text-lg font-semibold rounded-lg hover:bg-[#722F37] hover:text-white transition-colors"
                >
                  Mi perfil
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/registro"
                  className="px-8 py-4 bg-Swap-beige text-white text-lg font-semibold rounded-lg hover:bg-[#a67c52] transition-colors flex items-center justify-center gap-2"
                >
                  Comenzar intercambio <FiArrowRight />
                </Link>
                <Link
                  to="/catalogo"
                  className="px-8 py-4 border-2 border-[#722F37] text-[#722F37] text-lg font-semibold rounded-lg hover:bg-[#722F37] hover:text-white transition-colors"
                >
                  Ver catálogo
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-Swap-beige mb-2">500+</div>
              <div className="text-gray-600">Libros disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-Swap-beige mb-2">200+</div>
              <div className="text-gray-600">Estudiantes activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-Swap-beige mb-2">150+</div>
              <div className="text-gray-600">Intercambios exitosos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#722F37] mb-16">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-Swap-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Regístrate</h3>
              <p className="text-gray-600">Crea tu cuenta con tu correo institucional y comienza a explorar libros disponibles.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-Swap-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Publica tus libros</h3>
              <p className="text-gray-600">Sube fotos y detalles de los libros que quieres intercambiar.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-Swap-beige rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Intercambia</h3>
              <p className="text-gray-600">Encuentra libros que necesites y propón intercambios con otros estudiantes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#722F37] mb-16">¿Por qué usar SwapBook?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FiCheckCircle className="text-Swap-beige text-xl mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ahorra dinero</h3>
                    <p className="text-gray-600">Los libros universitarios pueden costar entre $50,000 y $200,000. Con SwapBook, intercambias sin gastar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FiCheckCircle className="text-Swap-beige text-xl mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Cuida el medio ambiente</h3>
                    <p className="text-gray-600">Reduce el desperdicio dando nueva vida a libros que ya no usas.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FiCheckCircle className="text-Swap-beige text-xl mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Amplía tu biblioteca</h3>
                    <p className="text-gray-600">Accede a una mayor variedad de libros sin límites de presupuesto.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FiCheckCircle className="text-Swap-beige text-xl mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Conecta con la comunidad</h3>
                    <p className="text-gray-600">Conoce otros estudiantes y crea una red de conocimiento compartido.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="images/Intercambio.jpg" 
              alt="Estudiantes intercambiando libros" 
              className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* El Matorral Partnership */}
      <section id="matorral" className="py-20 bg-[#722F37] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Alianza con El Matorral</h2>
              <p className="text-lg mb-6">
                Nos hemos asociado con <strong>El Matorral</strong>, una de las librerías más emblemáticas de Bogotá, 
                ubicada en Teusaquillo. Este espacio único combina literatura, música y cerveza artesanal.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-Swap-beige" />
                  <span>Cra. 19 # 36-55, Teusaquillo, Bogotá</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiStar className="text-Swap-beige" />
                  <span>Ambiente acogedor con patio al aire libre</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiUsers className="text-Swap-beige" />
                  <span>Eventos literarios y clubes de lectura</span>
                </div>
              </div>
              <p className="text-gray-300">
                Los usuarios de SwapBook pueden disfrutar de descuentos especiales en El Matorral 
                y participar en eventos exclusivos de intercambio de libros.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/images/Matorral.jpg" 
                alt="El Matorral - Librería en Bogotá" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded">
                <p className="text-sm font-semibold">El Matorral</p>
                <p className="text-xs">Librería • Café • Coworking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/CTA */}
      <section className="py-16 bg-Swap-beige">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para comenzar?</h2>
          <p className="text-white text-lg mb-8">Únete a nuestra comunidad de estudiantes que intercambian conocimiento</p>
          {loading ? null : usuario ? (
            <Link to="/catalogo" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-Swap-beige text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Ir al catálogo <FiArrowRight />
            </Link>
          ) : (
            <Link to="/registro" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-Swap-beige text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Crear cuenta gratis <FiArrowRight />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#722F37] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiBook className="text-2xl" />
                <span className="text-xl font-bold">SwapBook</span>
              </div>
              <p className="text-gray-300">La plataforma de intercambio de libros que conecta estudiantes.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Enlaces</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/about" className="hover:text-white">Acerca de</Link></li>
                <li><Link to="/catalogo" className="hover:text-white">Catálogo</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/help" className="hover:text-white">Ayuda</Link></li>
                <li><Link to="/terms" className="hover:text-white">Términos</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacidad</Link></li>
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
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 SwapBook. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
