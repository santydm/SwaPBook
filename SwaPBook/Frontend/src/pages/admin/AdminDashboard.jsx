import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalLibros: 0,
    librosPorCategoria: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [librosRes, categoriasRes] = await Promise.all([
          axios.get('http://localhost:8000/admin/estadisticas/total-libros', { headers }),
          axios.get('http://localhost:8000/admin/estadisticas/libros-por-categoria', { headers })
        ]);
        
        setStats({
          totalLibros: librosRes.data.total_libros,
          librosPorCategoria: categoriasRes.data
        });
      } catch (err) {
        setError("No se pudo cargar la información de estadísticas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: stats.librosPorCategoria.map(item => item.categoria),
    datasets: [{
      label: 'Libros por categoría',
      data: stats.librosPorCategoria.map(item => item.cantidad),
      backgroundColor: '#C9B084'
    }]
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[#722F37]">Estadísticas generales</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="text-[#722F37] text-lg">Cargando estadísticas...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Total de libros registrados</h3>
              <p className="text-4xl font-bold text-[#722F37]">{stats.totalLibros}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Libros por categoría</h3>
            {stats.librosPorCategoria.length === 0 ? (
              <p className="text-gray-500">No hay datos para mostrar.</p>
            ) : (
              <div className="h-96">
                <Bar 
                  data={chartData}
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: { beginAtZero: true }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
