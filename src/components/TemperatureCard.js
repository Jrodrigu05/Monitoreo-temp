import TemperatureGauge from './TemperatureGauge';

const TemperatureCard = ({ location, currentTemp, minTemp, maxTemp, status }) => {
  const statusColor = {
    ok: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{location}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[status]}`}>
          {status.toUpperCase()}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">Min: {minTemp}°C</span>
          <span className="text-2xl font-bold">{currentTemp}°C</span>
          <span className="text-sm text-gray-500">Max: {maxTemp}°C</span>
        </div>
        <TemperatureGauge currentTemp={currentTemp} minTemp={minTemp} maxTemp={maxTemp} />
      </div>
    </div>
  );
};

export default TemperatureCard;