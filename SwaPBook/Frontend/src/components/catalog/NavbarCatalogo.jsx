import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const NavbarCatalogo = ({
  estudiante,
  onPerfilClick,
  searchText,
  onSearch,
  categorias,
  categoriaSeleccionada,
  onCategoriaChange
}) => {
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [textoBusquedaCategoria, setTextoBusquedaCategoria] = useState("");

  const handleCategoriaClick = (nombre) => {
    onCategoriaChange(nombre);
    setMostrarDropdown(false);
    setTextoBusquedaCategoria("");
  };

  return (
    <nav className="w-full bg-[#722F37] px-6 py-3 flex items-center justify-between shadow">
      <a href="/" className="flex items-center gap-2">
        <span className="text-3xl shadow-md font-extrabold text-white ">SwaPBook</span>
      </a>
      {/* SearchBar y filtro */}
      <form
        className="flex flex-1 max-w-xl mx-8 gap-2 relative"
        onSubmit={e => { e.preventDefault(); }}
      >
        <input
          type="text"
          placeholder="Buscar libro, autor o categoría..."
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none"
          value={searchText}
          onChange={e => onSearch(e.target.value)}
        />
        <button
          type="button"
          className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md ml-2 hover:bg-gray-100"
          onClick={() => setMostrarDropdown(!mostrarDropdown)}
        >
          {categoriaSeleccionada || "Categoría"}
          <FiChevronDown className="ml-1" />
        </button>
        {mostrarDropdown && (
          <div className="absolute top-12 right-0 w-64 bg-white border rounded shadow-lg z-50">
            <input
              type="text"
              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
              placeholder="Buscar categoría..."
              value={textoBusquedaCategoria}
              onChange={e => setTextoBusquedaCategoria(e.target.value)}
            />
            <ul className="max-h-48 overflow-y-auto">
              {categorias
                .filter(cat =>
                  cat.nombre.toLowerCase().includes(textoBusquedaCategoria.toLowerCase())
                )
                .map(cat => (
                  <li
                    key={cat.idCategoria}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategoriaClick(cat.nombre)}
                  >
                    {cat.nombre}
                  </li>
                ))}
            </ul>
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100"
              onClick={() => handleCategoriaClick("")}
            >
              Limpiar filtro
            </button>
          </div>
        )}
      </form>
      <button
        onClick={onPerfilClick}
        className="ml-4 focus:outline-none"
        aria-label="Abrir perfil"
      >
        <img
          src={
            estudiante?.fotoPerfil
              ? `http://localhost:8000${estudiante.fotoPerfil}?t=${Date.now()}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(estudiante?.nombre || "Usuario")}&background=722F37&color=fff&size=150`
          }
          alt="Foto de perfil"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
        />
      </button>
    </nav>
  );
};

export default NavbarCatalogo;
