export const generateCSV = (sensors) => {
    // Encabezados del CSV
    let csvContent = "Fecha,Hora,Sensor,Temperatura (°C),Estado,Min Permitido,Max Permitido\n";
  
    // Datos de cada sensor
    sensors.forEach(sensor => {
      sensor.history.forEach(record => {
        const date = record.time.toLocaleDateString();
        const time = record.time.toLocaleTimeString();
        csvContent += `${date},${time},"${sensor.name}",${record.temp},${record.status},${sensor.minTemp},${sensor.maxTemp}\n`;
      });
    });
  
    return csvContent;
  };
  
  export const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };