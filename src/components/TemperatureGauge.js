const TemperatureGauge = ({ currentTemp, minTemp, maxTemp }) => {
  const percentage = ((currentTemp - minTemp) / (maxTemp - minTemp)) * 100;
  const gaugeColor = currentTemp < minTemp ? 'bg-blue-400' : 
                    currentTemp > maxTemp ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${gaugeColor} transition-all duration-500`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      ></div>
    </div>
  );
};

export default TemperatureGauge;