import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiLoader,
  FiBookOpen,
  FiTrendingUp,
  FiClock,
  FiBarChart2,
  FiArrowUp
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const AdminEstadisticas = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [ofertaDemanda, setOfertaDemanda] = useState([]);
  const [topLibros, setTopLibros] = useState([]);
  const [stats, setStats] = useState({
    totalLibros: 0,
    intercambiosTotales: 0,
    usuariosActivos: 0
  });
  const [loading, setLoading] = useState(true);

  // Configuración de diseño
  const colorPrimario = "#722F37";
  const colorSecundario = "#C9B084";
  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  // Transformar datos del heatmap
  const transformHeatmapData = (rawData) => {
    return rawData.map(item => ({
      day: diasSemana[item.dia],
      time: item.franja,
      value: item.cantidad
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [
          heatmapRes, 
          librosRes, 
          ofertaRes, 
          topRes,
          intercambiosRes
        ] = await Promise.all([
          axios.get("http://localhost:8000/admin/estadisticas/horarios/heatmap", { headers }),
          axios.get("http://localhost:8000/admin/estadisticas/total-libros", { headers }),
          axios.get("http://localhost:8000/admin/estadisticas/oferta-demanda", { headers }),
          axios.get("http://localhost:8000/admin/estadisticas/top-libros", { headers }),
          axios.get("http://localhost:8000/admin/estadisticas/intercambios", { headers })
        ]);

        setHeatmapData(transformHeatmapData(heatmapRes.data));
        setOfertaDemanda(ofertaRes.data);
        setTopLibros(topRes.data);
        setStats({
          totalLibros: librosRes.data.total_libros,
          intercambiosTotales: intercambiosRes.data.total_creados,
          usuariosActivos: 0 // Agregar endpoint correspondiente
        });
        
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center text-[#722F37]">
          <FiLoader className="animate-spin text-4xl mb-4" />
          <span className="text-lg">Cargando panel estadístico...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#722F37]">
            <FiBarChart2 className="inline mr-3" />
            Panel Estadístico
          </h1>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#722F37]/10 rounded-full">
                <FiBookOpen className="text-2xl text-[#722F37]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Libros publicados</p>
                <p className="text-2xl font-bold text-[#722F37]">
                  {stats.totalLibros}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C9B084]/10 rounded-full">
                <FiTrendingUp className="text-2xl text-[#722F37]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Intercambios totales</p>
                <p className="text-2xl font-bold text-[#722F37]">
                  {stats.intercambiosTotales}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#722F37]/10 rounded-full">
                <FiClock className="text-2xl text-[#722F37]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Actividad reciente</p>
                <p className="text-2xl font-bold text-[#722F37]">+24%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Heatmap de horarios */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10">
            <h3 className="text-xl font-semibold text-[#722F37] mb-6 flex items-center gap-2">
              <FiClock className="text-[#C9B084]" />
              Horarios de Intercambios
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: colorPrimario }}
                  />
                  <YAxis 
                    tick={{ fill: colorPrimario }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colorPrimario,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill={colorSecundario}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Oferta vs Demanda */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10">
            <h3 className="text-xl font-semibold text-[#722F37] mb-6 flex items-center gap-2">
              <FiArrowUp className="text-[#C9B084]" />
              Oferta vs Demanda
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ofertaDemanda}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="titulo" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12, fill: colorPrimario }}
                  />
                  <YAxis tick={{ fill: colorPrimario }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colorPrimario,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="demanda" 
                    fill={colorSecundario}
                    name="Demanda"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="oferta" 
                    fill={colorPrimario}
                    name="Oferta"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Libros */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10">
          <h3 className="text-xl font-semibold text-[#722F37] mb-6 flex items-center gap-2">
            <FiBookOpen className="text-[#C9B084]" />
            Libros Más Populares
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topLibros.map((libro, index) => (
              <div 
                key={libro.titulo}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-[#722F37]/5 to-[#C9B084]/5 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#722F37]/50">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-[#722F37]">{libro.titulo}</p>
                    <p className="text-sm text-[#722F37]/70">
                      {libro.cantidad} intercambios
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-20 h-2 bg-[#722F37]/20 rounded-full overflow-hidden"
                    title={`${libro.cantidad} intercambios`}
                  >
                    <div 
                      className="h-full bg-[#722F37] transition-all duration-500"
                      style={{ width: `${Math.min(libro.cantidad * 10, 100)}%` }}
                    />
                  </div>
                  <span className="text-[#722F37] font-medium">
                    {libro.cantidad}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEstadisticas;
