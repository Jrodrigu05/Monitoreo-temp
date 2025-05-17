import TemperatureChart from './TemperatureChart';

const SensorCard = ({ sensor, onConfigure }) => {
  const statusColors = {
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{sensor.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[sensor.status]}`}>
          {sensor.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500">Actual:</span>
        <span className="text-3xl font-bold">
          {sensor.currentTemp}°C
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Mínima</p>
          <p className="font-medium">{sensor.minTemp}°C</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Máxima</p>
          <p className="font-medium">{sensor.maxTemp}°C</p>
        </div>
      </div>

      <div className="h-48">
        <TemperatureChart 
          history={sensor.history} 
          minTemp={sensor.minTemp}
          maxTemp={sensor.maxTemp} 
        />
      </div>

      <button 
        onClick={onConfigure}
        className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded transition-colors"
      >
        Configurar Sensor
      </button>
    </div>
  );
};

export default SensorCard;