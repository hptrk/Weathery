export const WEATHER_API = function (lat, long) {
  // API FOR WEATHER DATAS
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,windspeed_10m_max,winddirection_10m_dominant,precipitation_probability_max&current_weather=true&timezone=auto`;
};
export const REVERSE_GEOCODE = function (lat, long) {
  // API FOR REVERSE GEOCODING
  return `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=5890a163a80f47f7850ecb63ea0bf851`;
};
export const TIMEOUT_SEC = 10; // Reject a promise after X seconds
