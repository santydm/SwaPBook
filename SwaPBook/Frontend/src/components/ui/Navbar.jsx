import { Link, useNavigate } from "react-router-dom";
import { FiBook, FiUser, FiHome, FiShield } from "react-icons/fi";

const Navbar = ({ usuario }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#722F37] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo y nombre */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <FiBook className="text-2xl" />
          <span className="text-2xl font-bold">SwapBook</span>
        </div>
        {/* Navegación */}
        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            to="/"
            className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <FiHome /> Inicio
          </Link>
          <Link
            to="/catalogo"
            className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
          >
            Catálogo
          </Link>
          {usuario && (
            <>
              <Link
                to="/perfil"
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              >
                <FiUser /> Perfil
              </Link>
              <Link
                to="/seguridad"
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              >
                <FiShield /> Seguridad
              </Link>
            </>
          )}
        </nav>
        {/* Usuario */}
        <div className="flex items-center gap-3">
          {usuario ? (
            <>
              <span className="hidden md:inline text-sm font-semibold">
                {usuario.nombre}
              </span>
              <img
                src={
                  usuario.fotoPerfil
                    ? `http://localhost:8000${usuario.fotoPerfil}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre || "U")}&background=722F37&color=fff&size=36`
                }
                alt="avatar"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-[#722F37] rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-Swap-beige text-white rounded-md font-semibold hover:bg-[#a67c52] transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
