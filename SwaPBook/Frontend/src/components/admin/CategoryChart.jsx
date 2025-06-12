// src/components/admin/CategoryChart.jsx
const CategoryChart = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.cantidad), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Libros registrados por categoría</h3>
      
      <div className="flex items-end justify-between h-64 bg-gray-50 p-4 rounded">
        {data.map((item, index) => {
          const height = (item.cantidad / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div className="text-sm text-gray-600">{item.cantidad}</div>
              <div 
                className="bg-Swap-vinotinto rounded-t w-16 transition-all duration-500"
                style={{ height: `${height}%` }}
              ></div>
              <div className="text-sm text-gray-700 text-center px-1">
                {item.categoria}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;
