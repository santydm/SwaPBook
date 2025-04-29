import { useState } from 'react';

const PublicarLibro = ({ isOpen, onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!titulo) nuevosErrores.titulo = 'El título es requerido';
    if (!autor) nuevosErrores.autor = 'El autor es requerido';
    if (!descripcion) nuevosErrores.descripcion = 'La descripción es requerida';
    if (!categoria) nuevosErrores.categoria = 'La categoría es requerida';
    if (!imagen) nuevosErrores.imagen = 'La portada es requerida';

    setErrors(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setIsLoading(true);
    // Aquí iría la lógica para enviar el libro al backend
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Publicar libro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border ${errors.titulo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Título del libro"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>}
          </div>
          {/* Autor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border ${errors.autor ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Autor del libro"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
            {errors.autor && <p className="mt-1 text-sm text-red-600">{errors.autor}</p>}
          </div>
          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              className={`w-full px-3 py-2 border ${errors.descripcion ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Describe brevemente el libro"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
          </div>
          {/* Categoría/Género */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría/Género</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border ${errors.categoria ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Ej: Ficción, Ciencia, Académico..."
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
            {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
          </div>
          {/* Foto de portada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto de portada</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-Swap-beige file:text-white hover:file:bg-[#a67c52]"
              onChange={handleImageChange}
            />
            {imagenPreview && (
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="mt-2 h-32 w-auto rounded-md object-cover border"
              />
            )}
            {errors.imagen && <p className="mt-1 text-sm text-red-600">{errors.imagen}</p>}
          </div>
          {/* Botón */}
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-Swap-beige text-white font-medium rounded-md hover:bg-[#a67c52] focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Publicando...' : 'Publicar libro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicarLibro;
