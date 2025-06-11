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
import ReactApexChart from "react-apexcharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const AdminEstadisticas = () => {
  const [heatmapSeries, setHeatmapSeries] = useState([]);
  const [heatmapOptions, setHeatmapOptions] = useState({});
  const [ofertaDemanda, setOfertaDemanda] = useState([]);
  const [topLibros, setTopLibros] = useState([]);
  const [stats, setStats] = useState({
    totalLibros: 0,
    intercambiosTotales: 0,
    usuariosActivos: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colorPrimario = "#722F37";
  const colorSecundario = "#C9B084";
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const franjasHorarias = [
    '08:00-10:00', '10:00-12:00', '12:00-14:00',
    '14:00-16:00', '16:00-18:00', '18:00-20:00',
    '20:00-22:00', 'Otro'
  ];

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

        // Procesar datos para el heatmap
        const maxValue = Math.max(...heatmapRes.data.map(item => item.cantidad));
        const seriesData = franjasHorarias.map(franja => ({
          name: franja,
          data: diasSemana.map(dia => {
            const registro = heatmapRes.data.find(item => 
              item.dia === dia && item.franja === franja
            );
            return registro ? registro.cantidad : 0;
          })
        }));

        setHeatmapOptions({
          chart: {
            type: 'heatmap',
            toolbar: { show: true }
          },
          dataLabels: { enabled: false },
          colors: [colorPrimario],
          xaxis: {
            categories: diasSemana,
            labels: { style: { colors: colorPrimario, fontWeight: 600 } }
          },
          plotOptions: {
            heatmap: {
              colorScale: {
                ranges: [
                  { from: 0, to: maxValue * 0.3, color: '#F3E9E9', name: 'Bajo' },
                  { from: maxValue * 0.3, to: maxValue * 0.6, color: colorSecundario, name: 'Medio' },
                  { from: maxValue * 0.6, to: maxValue, color: colorPrimario, name: 'Alto' }
                ]
              }
            }
          },
          tooltip: {
            y: {
              formatter: (val) => `${val} intercambios`
            }
          }
        });

        setHeatmapSeries(seriesData);
        setOfertaDemanda(ofertaRes.data);
        setTopLibros(topRes.data);
        setStats({
          totalLibros: librosRes.data.total_libros,
          intercambiosTotales: intercambiosRes.data.total_creados,
          usuariosActivos: 0 // Si tienes endpoint, actualízalo aquí
        });
        setLoading(false);

      } catch (err) {
        setError(`Error al cargar datos: ${err.message}`);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#722F37]">
          <FiBarChart2 className="inline mr-3" />
          Panel Estadístico
        </h1>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#722F37]">Libros Registrados</h3>
              <FiBookOpen className="text-2xl text-[#C9B084]" />
            </div>
            <p className="text-3xl font-bold text-[#722F37] mt-4">{stats.totalLibros}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#722F37]">Intercambios Totales</h3>
              <FiTrendingUp className="text-2xl text-[#C9B084]" />
            </div>
            <p className="text-3xl font-bold text-[#722F37] mt-4">{stats.intercambiosTotales}</p>
          </div>
        </div>

        {/* Sección de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Heatmap de horarios con ApexCharts */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-[#722F37]/10">
            <h3 className="text-xl font-semibold text-[#722F37] mb-6 flex items-center gap-2">
              <FiClock className="text-[#C9B084]" />
              Horarios de Intercambios
            </h3>
            <ReactApexChart
              options={heatmapOptions}
              series={heatmapSeries}
              type="heatmap"
              height={350}
            />
          </div>

          {/* Gráfico de Oferta vs Demanda */}
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
