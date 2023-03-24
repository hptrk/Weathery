import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
//////////
// AJAX CALL
export const AJAX = async function (url) {
  //GET
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

//////////
// GET DAILY WEATHER OBJECT
export const getDaily = function (data, dayNumber) {
  const { daily } = data;

  return {
    weathercode: daily.weathercode[dayNumber],
    minTemp: daily.temperature_2m_min[dayNumber],
    maxTemp: daily.temperature_2m_max[dayNumber],
    sunrise: daily.sunrise[dayNumber],
    sunset: daily.sunset[dayNumber],
  };
};

//////////
// GET HOURLY WEATHER OBJECT
export const getHourly = function (data, dayNumber) {
  const { hourly } = data;

  return {
    apparentTemp: hourly.apparent_temperature[dayNumber],
    relativeHumidity: hourly.relativehumidity_2m[dayNumber],
  };
};
