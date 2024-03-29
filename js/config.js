//---------- Storage for configuration/permanent data ----------//

export const WEATHER_API = function (lat, long) {
  // API FOR WEATHER DATAS
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,windspeed_10m_max,winddirection_10m_dominant,precipitation_probability_max&current_weather=true&timezone=auto`;
};
export const REVERSE_GEOCODE = function (lat, long) {
  // API FOR REVERSE GEOCODING
  return `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=5890a163a80f47f7850ecb63ea0bf851`;
};
export const AUTOCOMPLETE = function (text, coords) {
  // API FOR CITY NAME AUTO COMPLETE
  return `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&lang=en&limit=5&type=city&bias=proximity:${coords[1]},${coords[0]}&format=json&apiKey=5890a163a80f47f7850ecb63ea0bf851
  `;
};
export const AUTOCOMPLETEWithoutBias = function (text) {
  // API FOR CITY NAME AUTO COMPLETE WITHOUT PROXIMITY BIAS (when user does not enable )
  return `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&lang=en&limit=5&type=city&format=json&apiKey=5890a163a80f47f7850ecb63ea0bf851
  `;
};
export const TIMEOUT_SEC = 10; // Reject a promise after X seconds
