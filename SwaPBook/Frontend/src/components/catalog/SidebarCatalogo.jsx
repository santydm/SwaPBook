import PanelPerfil from "../estudiante/PanelPerfil";

const SidebarCatalogo = ({ estudiante, onClose, onCrearLibro }) => (
  <div
    className="
      fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col
      animate-slide-in-right
    "
    style={{ maxWidth: "100vw" }}
  >
    <button
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      onClick={onClose}
      aria-label="Cerrar sidebar"
    >
      &times;
    </button>
    <div className="mt-12 p-4">
      {/* Aquí pasas compact={true} */}
      <PanelPerfil estudiante={estudiante} handleLogout={() => {}} compact={true} />  
      <button
        className="mt-8 w-full py-2 px-4 bg-Swap-beige text-white rounded-md hover:bg-[#a67c52] font-semibold"
        onClick={onCrearLibro}
      >
        + Crear libro
      </button>
    </div>
  </div>
);

export default SidebarCatalogo;
