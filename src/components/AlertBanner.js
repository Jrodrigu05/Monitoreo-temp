import { useState, useEffect } from 'react';

const AlertBanner = ({ alerts }) => {
  const [visibleAlerts, setVisibleAlerts] = useState(alerts);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (alerts.length > visibleAlerts.length) {
      // Nueva alerta añadida
      setVisibleAlerts(alerts);
      setIsExiting(false);
    } else if (alerts.length < visibleAlerts.length && !isExiting) {
      // Iniciar animación de salida
      setIsExiting(true);
      const timer = setTimeout(() => {
        setVisibleAlerts(alerts);
        setIsExiting(false);
      }, 1000); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [alerts, visibleAlerts, isExiting]);

  if (!visibleAlerts.length) return null;

  return (
    <div className={`bg-red-600 text-white p-4 mb-6 rounded-lg transition-all duration-1000 ${
      isExiting ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'
    }`}>
      <h3 className="font-bold text-lg mb-2">¡Alertas Activas!</h3>
      <ul className="list-disc list-inside">
        {visibleAlerts.map((alert, index) => (
          <li key={index}>
            {alert.sensor}: {alert.message} (Temp: {alert.temp}°C)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertBanner;