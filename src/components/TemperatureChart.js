import { useState, useRef, useEffect } from 'react';
import { linearRegression } from '../utils/regressionUtils';

const TemperatureChart = ({ history, minTemp, maxTemp }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [regression, setRegression] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (history.length > 1) {
      const X = history.map((_, i) => i);
      const Y = history.map(item => item.temp);
      const result = linearRegression(X, Y);
      setRegression(result);
    } else {
      setRegression(null);
    }
  }, [history]);

  if (!history.length || dimensions.width === 0) {
    return <div className="h-48 bg-gray-50 rounded-lg" />;
  }

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = dimensions.width - margin.left - margin.right;
  const innerHeight = dimensions.height - margin.top - margin.bottom;

  const temps = history.map(item => item.temp);
  const minDataTemp = Math.min(...temps);
  const maxDataTemp = Math.max(...temps);
  
  const yMin = Math.min(minTemp - 2, minDataTemp - 1);
  const yMax = Math.max(maxTemp + 2, maxDataTemp + 1);

  const xScale = (index) => margin.left + (index / (history.length - 1)) * innerWidth;
  const yScale = (temp) => margin.top + innerHeight - ((temp - yMin) / (yMax - yMin)) * innerHeight;

  const handleMouseMove = (e) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const xPos = e.clientX - svgRect.left;
    
    const index = Math.round(((xPos - margin.left) / innerWidth) * (history.length - 1));
    if (index >= 0 && index < history.length) {
      const dataPoint = history[index];
      setTooltip({
        x: xPos,
        y: yScale(dataPoint.temp),
        time: dataPoint.time.toLocaleTimeString(),
        temp: dataPoint.temp,
        status: dataPoint.status
      });
    }
  };

  const statusColor = (status) => {
    switch(status) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="relative h-48 w-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        className="rounded-lg"
      >
        {/* Ejes */}
        <line
          x1={margin.left}
          y1={margin.top + innerHeight}
          x2={margin.left + innerWidth}
          y2={margin.top + innerHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + innerHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
        
        {/* Límites de temperatura */}
        <line
          x1={margin.left}
          y1={yScale(minTemp)}
          x2={margin.left + innerWidth}
          y2={yScale(minTemp)}
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        <line
          x1={margin.left}
          y1={yScale(maxTemp)}
          x2={margin.left + innerWidth}
          y2={yScale(maxTemp)}
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        
        {/* Línea de regresión */}
        {regression && (
          <line
            x1={margin.left}
            y1={yScale(regression.m * 0 + regression.b)}
            x2={margin.left + innerWidth}
            y2={yScale(regression.m * (history.length - 1) + regression.b)}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
        )}
        
        {/* Datos */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          points={history.map((item, i) => `${xScale(i)},${yScale(item.temp)}`).join(' ')}
        />
        
        {history.map((item, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(item.temp)}
            r="3"
            fill={statusColor(item.status)}
            stroke="white"
            strokeWidth="1"
          />
        ))}
        
        {/* Tooltip */}
        {tooltip && (
          <g>
            <line
              x1={tooltip.x}
              y1={margin.top}
              x2={tooltip.x}
              y2={margin.top + innerHeight}
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <circle
              cx={tooltip.x}
              cy={tooltip.y}
              r="5"
              fill={statusColor(tooltip.status)}
              stroke="white"
              strokeWidth="2"
            />
            <rect
              x={tooltip.x + 10}
              y={tooltip.y - 25}
              width="140"
              height="60"
              rx="4"
              fill="white"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={tooltip.x + 15}
              y={tooltip.y - 10}
              fill="#374151"
              fontSize="10"
            >
              {tooltip.time}
            </text>
            <text
              x={tooltip.x + 15}
              y={tooltip.y + 5}
              fill="#374151"
              fontSize="10"
              fontWeight="bold"
            >
              Temp: {tooltip.temp}°C ({tooltip.status})
            </text>
            {regression && (
              <text
                x={tooltip.x + 15}
                y={tooltip.y + 20}
                fill="#3b82f6"
                fontSize="10"
              >
                Tendencia: y = {regression.m.toFixed(2)}x + {regression.b.toFixed(2)}
              </text>
            )}
          </g>
        )}
        
        {/* Leyenda de regresión */}
        {regression && (
          <text
            x={margin.left + 10}
            y={margin.top + 15}
            fill="#3b82f6"
            fontSize="10"
          >
            R² = {regression.r2.toFixed(2)}
          </text>
        )}
      </svg>
    </div>
  );
};

export default TemperatureChart;

// DONE