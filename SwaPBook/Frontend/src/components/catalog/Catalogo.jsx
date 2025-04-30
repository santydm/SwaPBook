import { useState } from "react";
import NavbarCatalogo from "./NavbarCatalogo";
import SidebarCatalogo from "./SidebarCatalogo";
import PublicarLibro from "./PublicarLibro";
import Footer from "../ui/Footer";
import FloatingButton from "../ui/FloatingButton";

// Usuario de ejemplo (puedes reemplazar por datos reales)
const usuarioDemo = {
    nombre: "Julian D. Rodriguez",
    fotoPerfil: "", // URL real o placeholder
  };

  
const librosEjemplo = [
  {
    titulo: "El Hobbit",
    autor: "J.R.R. Tolkien",
    descripcion: "Una aventura épica en la Tierra Media.",
    categoria: "Fantasía",
    portada: "https://covers.openlibrary.org/b/id/6979861-L.jpg"
  },
  {
    titulo: "1984",
    autor: "George Orwell",
    descripcion: "Distopía clásica sobre vigilancia y control.",
    categoria: "Ciencia Ficción",
    portada: "https://covers.openlibrary.org/b/id/7222246-L.jpg"
  },
  {
    titulo: "Dune",
    autor: "Frank Herbert",
    descripcion: "La saga de ciencia ficción más influyente.",
    categoria: "Ciencia Ficción",
    portada: "https://covers.openlibrary.org/b/id/8101356-L.jpg"
  }
];

const Catalogo = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarCatalogo usuario={usuarioDemo} onPerfilClick={() => setShowSidebar(true)} />

      {showSidebar && (
        <SidebarCatalogo
          usuario={usuarioDemo}
          onClose={() => setShowSidebar(false)}
          // Ya NO pases onCrearLibro aquí
        />
      )}

      {showModal && (
        <PublicarLibro isOpen={showModal} onClose={() => setShowModal(false)} />
      )}

      {/* Contenido principal */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 text-[#722F37]">Catálogo de Libros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {librosEjemplo.map((libro, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
              <img
                src={libro.portada}
                alt={libro.titulo}
                className="h-40 w-full object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-[#722F37]">{libro.titulo}</h3>
              <p className="text-gray-600">{libro.autor}</p>
              <p className="text-sm text-gray-500 mt-2">{libro.descripcion}</p>
              <span className="mt-2 inline-block bg-Swap-beige text-white text-xs px-2 py-1 rounded">
                {libro.categoria}
              </span>
              <button className="mt-4 w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-[#a67c52] transition-colors">
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Botón flotante "+Crear libro" */}
      <FloatingButton 
        onClick={() => setShowModal(true)} 
        isVisible={!showModal} 
        label="Crear libro" 
      />

      <Footer />
    </div>
  );
};

export default Catalogo;
