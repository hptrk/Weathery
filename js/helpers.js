import { TIMEOUT_SEC } from './config';

////////////////////
// rejecting timeout needed for promise race
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

////////////////////
// ROUND VALUE
export const round = value => {
  return Math.round(value);
};

////////////////////
// AJAX CALL
export const AJAX = async function (url) {
  //GET
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //if the request is taking too long, it will throw an error
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.reason} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

////////////////////
// GET CURRENT HOUR (for API array)
const getHour = () => {
  return new Date().getHours();
};

////////////////////
// GET DAILY WEATHER OBJECT
export const getDaily = function (data, dayNumber) {
  const { daily } = data;

  return {
    weathercode: daily.weathercode[dayNumber],
    minTemp: round(daily.temperature_2m_min[dayNumber]),
    maxTemp: round(daily.temperature_2m_max[dayNumber]),
    sunrise: daily.sunrise[dayNumber],
    sunset: daily.sunset[dayNumber],
  };
};

////////////////////
// GET HOURLY WEATHER OBJECT
export const getHourly = function (data, dayNumber) {
  const { hourly } = data;
  const prevDays = 24 * dayNumber; // if we need data for the second day, it will count in the previous 2 days (48 h)

  return {
    apparentTemp: round(hourly.apparent_temperature[prevDays + getHour()]),
    relativeHumidity: hourly.relativehumidity_2m[prevDays + getHour()],
    // example: if its 20:22, it will return the element with the index of 20 from the array
  };
};

////////////////////
// GET HOURLY WEATHER OBJECT
export const runEverySec = f => {
  setInterval(() => {
    f();
  }, 1000);
};

////////////////////
// PUT LEADING ZERO INTO SINGLE DIGIT NUMBERS
export const leadingZero = number => {
  return `${number}`.padStart(2, '0');
};
