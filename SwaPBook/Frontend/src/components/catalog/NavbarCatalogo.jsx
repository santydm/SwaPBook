// src/components/catalog/NavbarCatalogo.jsx
import React from "react";

const NavbarCatalogo = ({ estudiante, onPerfilClick }) => (
  <nav className="w-full bg-[#722F37] px-6 py-3 flex items-center justify-between shadow">
    {/* Izquierda: Logo */}
    <a href="/catalogo" className="flex items-center gap-2">
      <span className="text-2xl font-extrabold text-white tracking-tight">SwaPBook</span>
    </a>
    {/* Centro: SearchBar */}
    <form
      className="flex flex-1 max-w-xl mx-8 gap-2"
      onSubmit={e => { e.preventDefault(); }}
    >
      <input
        type="text"
        placeholder="Buscar libro, autor o categoría..."
        className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
      />
    </form>
    {/* Derecha: Solo la foto de perfil */}
    <button
      onClick={onPerfilClick}
      className="ml-4 focus:outline-none"
      aria-label="Abrir perfil"
    >
      <img
        src={
          estudiante?.fotoPerfil && estudiante.fotoPerfil.trim() !== ""
            ? estudiante.fotoPerfil
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(estudiante?.nombre || 'Profile')}&background=722F37&color=fff&size=150`
        }
        alt="Foto de perfil"
        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
      />
    </button>
  </nav>
);

export default NavbarCatalogo;
