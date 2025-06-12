// src/components/admin/StatsCard.jsx
const StatsCard = ({ title, value, bgColor = "bg-Swap-beige" }) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow text-center`}>
      <h3 className="text-4xl font-bold text-gray-800 mb-2">{value}</h3>
      <p className="text-gray-700 font-medium">{title}</p>
    </div>
  );
};

export default StatsCard;
