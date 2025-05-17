import { useState, useEffect } from 'react';
import { sensors as initialSensors } from './mock/sensors';
import { generateRandomTemp, checkStatus, generateHistory } from './utils/temperatureUtils';
import SensorCard from './components/SensorCard';
import AlertBanner from './components/AlertBanner';
import SensorConfigModal from './components/SensorConfigModal';

const App = () => {
  const [sensors, setSensors] = useState(() => {
    return initialSensors.map(sensor => ({
      ...sensor,
      history: generateHistory(sensor)
    }));
  });

  const [alerts, setAlerts] = useState([]);
  const [editingSensor, setEditingSensor] = useState(null);

  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts(prev => prev.slice(1));
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors => {
        const updatedSensors = prevSensors.map(sensor => {
          const newTemp = generateRandomTemp(
            sensor.minTemp - 2, 
            sensor.maxTemp + 2
          );
          
          const newStatus = checkStatus(newTemp, sensor.minTemp, sensor.maxTemp);
          
          if (newStatus !== 'normal' && sensor.status === 'normal') {
            setAlerts(prev => [...prev, {
              sensor: sensor.name,
              message: newStatus === 'warning' ? 'Temperatura fuera de rango' : '¡Temperatura crítica!',
              temp: newTemp,
              timestamp: new Date()
            }]);
          }

          return {
            ...sensor,
            currentTemp: newTemp,
            status: newStatus,
            history: [...sensor.history.slice(1), {
              time: new Date(),
              temp: newTemp,
              status: newStatus
            }]
          };
        });

        return updatedSensors;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleConfigureSensor = (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId);
    setEditingSensor(sensor);
  };

  const handleSaveSensor = (updatedSensor) => {
    setSensors(prev => prev.map(s => 
      s.id === updatedSensor.id ? updatedSensor : s
    ));
    setEditingSensor(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoreo de Temperatura</h1>
        <p className="text-gray-600">Farmacia - Control de áreas sensibles</p>
      </header>

      <AlertBanner alerts={alerts} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sensors.map(sensor => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
            onConfigure={() => handleConfigureSensor(sensor.id)}
          />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Exportar Datos</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors">
          Descargar Histórico CSV
        </button>
      </div>

      <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
        Creado por: Juan R. Santiago G. Jonathan
      </footer>

      {editingSensor && (
        <SensorConfigModal
          sensor={editingSensor}
          onClose={() => setEditingSensor(null)}
          onSave={handleSaveSensor}
        />
      )}
    </div>
  );
};

export default App;

// DONE