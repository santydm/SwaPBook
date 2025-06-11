import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBook, FiUsers, FiStar, FiMapPin, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import Footer from '../../components/ui/Footer';
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


  return (
    <div className="min-h-screen bg-Swap-cream">
      {/* Header/Navbar */}
      <header className="bg-Swap-vinotinto shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiBook className="text-2xl text-white" />
            <span className="text-2xl font-bold text-white">SwapBook</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#como-funciona" className="text-white hover:text-Swap-cream">¿Cómo funciona?</a>
            <a href="#beneficios" className="text-white hover:text-Swap-cream">Beneficios</a>
            <a href="#matorral" className="text-white hover:text-Swap-cream">El Matorral</a>
          </nav>
          <div className="flex gap-3">
            {loading ? null : usuario ? (
              <>
                <Link
                  to="/catalogo"
                  className="px-4 py-2 border-2 border-[#722F37]  bg-Swap-vinotinto text-white rounded-md hover:bg-Swap-cream text-Swap-beige hover:text-Swap-vinotinto transition-colors"
                >
                  Ir al catálogo
                </Link>
                <Link
                  to="/perfil"
                  className="px-4 py-2 text-white border border-[#722F37] rounded-md hover:bg-Swap-cream hover:text-Swap-vinotinto transition-colors"
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
                  className="px-8 py-4 border-2 border-[#722F37] text-white bg-Swap-vinotinto rounded-md hover:bg-Swap-cream  hover:text-Swap-vinotinto text-lg font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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
      <section className="py-32 bg-Swap-cream">
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
      <section id="beneficios" className="py-20 bg-Swap-cream">
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


      <section className="py-20 bg-Swap-cream">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-Swap-vinotinto mb-4">¿Listo para comenzar?</h2>
          <p className="text-black text-lg mb-8">Únete a nuestra comunidad de estudiantes que intercambian conocimiento</p>
          {loading ? null : usuario ? (
            <Link to="/catalogo" className="inline-flex items-center gap-2 px-8 py-4 px-4 py-2 border-2 border-[#722F37]  bg-Swap-vinotinto text-white rounded-md hover:bg-Swap-cream transition-colors text-Swap-beige hover:text-Swap-vinotinto text-lg font-semibold rounded-lg transition-colors">
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
      <Footer />
    </div>
  );
};

export default Home;
