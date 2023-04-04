export const API_URL = function (lat, long) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=auto`;
};
export const TIMEOUT_SEC = 10; // Reject a promise after X seconds
