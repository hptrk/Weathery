export const API_URL = function (lat, long) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=relativehumidity_2m,apparent_temperature&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=auto`;
};
export const TIMEOUT_SEC = 10; // Reject a promise after X seconds
