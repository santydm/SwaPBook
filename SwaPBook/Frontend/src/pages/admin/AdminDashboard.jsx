import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalLibros: 0,
    totalUsuarios: 0,
    intercambiosCreados: 0,
    librosPorCategoria: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [librosRes, categoriasRes, intercambiosRes, usuariosRes] = await Promise.all([
        axios.get('http://localhost:8000/admin/estadisticas/total-libros', { headers }),
        axios.get('http://localhost:8000/admin/estadisticas/libros-por-categoria', { headers }),
        axios.get('http://localhost:8000/admin/estadisticas/intercambios', { headers }),
        axios.get('http://localhost:8000/admin/estudiantes', { headers })
      ]);
      
      setStats({
        totalLibros: librosRes.data.total_libros,
        totalUsuarios: usuariosRes.data.length,
        intercambiosCreados: intercambiosRes.data.total_creados,
        librosPorCategoria: categoriasRes.data
      });
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Libros registrados</h3>
          <p className="text-4xl font-bold text-[#722F37]">{stats.totalLibros}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Usuarios registrados</h3>
          <p className="text-4xl font-bold text-[#722F37]">{stats.totalUsuarios}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Intercambios creados</h3>
          <p className="text-4xl font-bold text-[#722F37]">{stats.intercambiosCreados}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Libros por categoría</h3>
        <div className="h-96">
          <Bar 
            data={chartData}
            options={{ 
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
