// MisLibros.jsx
import PanelPerfil from "../../components/estudiante/PanelPerfil";
import CardLibro from "../../components/estudiante/CardLibro";

const libros = [
  {
    id: 1,
    usuarioNombre: "Julian Rodriguez",
    usuarioFoto: "",
    fechaPublicacion: "2025-04-30",
    fotoLibro: "https://covers.openlibrary.org/b/id/6979861-L.jpg",
    autor: "J.R.R. Tolkien",
    estado: "Disponible",
  },
];

const MisLibros = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
        {/* Panel lateral */}
        <PanelPerfil handleLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }} />

        {/* Sección de mis libros centrada */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h1 className="text-2xl font-bold text-[#722F37] mb-6 text-center">Mis libros</h1>
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center w-full">
              {libros.map((libro) => (
                <CardLibro
                  key={libro.id}
                  usuarioNombre={libro.usuarioNombre}
                  usuarioFoto={libro.usuarioFoto}
                  fechaPublicacion={libro.fechaPublicacion}
                  fotoLibro={libro.fotoLibro}
                  autor={libro.autor}
                  estado={libro.estado}
                  onVerDetalles={() => {/* lógica para ver detalles */}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisLibros;
