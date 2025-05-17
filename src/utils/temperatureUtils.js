export const generateRandomTemp = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

export const checkStatus = (temp, min, max) => {
  if (temp < min - 0.5 || temp > max + 0.5) return 'critical';
  if (temp < min || temp > max) return 'warning';
  return 'normal';
};

export const generateHistory = (sensor, hours = 24) => {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date(now - i * 3600 * 1000);
    const temp = generateRandomTemp(
      sensor.minTemp - 1, 
      sensor.maxTemp + 1
    );
    return {
      time,
      temp,
      status: checkStatus(temp, sensor.minTemp, sensor.maxTemp)
    };
  }).reverse();
};