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
    description: getFromCode(daily.weathercode[dayNumber]),
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

////////////////////
// GET FOLLOWING DAY NAMES
export const getFollowingDay = (day, locale) => {
  const date = new Date();
  date.setDate(date.getDate() + day); // set the following day
  return date.toLocaleDateString(locale, { weekday: 'long' }); // return the name of it
};

////////////////////
// UPDATE DAY NAMES
export const updateDayNames = state => {
  state.dayNames.zero = getFollowingDay(0, state.locale); // current day
  state.dayNames.one = getFollowingDay(1, state.locale);
  state.dayNames.two = getFollowingDay(2, state.locale);
  state.dayNames.three = getFollowingDay(3, state.locale);
  state.dayNames.four = getFollowingDay(4, state.locale);
  state.dayNames.five = getFollowingDay(5, state.locale);
  state.dayNames.six = getFollowingDay(6, state.locale);
};

////////////////////
// GET WEATHER DESCRIPTION AND ICON FROM WEATHER CODE
export const getFromCode = (code, desc = true, day = true) => {
  // icon files starts with "day_" or "night_"
  function dayOrNight() {
    return day ? 'day' : 'night';
  }

  // ['description', 'svg file name (day_ or night_ or simple file name)']
  const codes = {
    0: [`Clear sky`, `${dayOrNight()}_clear`],
    1: [`Mainly clear`, `${dayOrNight()}_partial_cloud`],
    2: [`Partly cloudy`, `${dayOrNight()}_partial_cloud`],
    3: [`Overcast`, `overcast`],
    45: [`Fog`, `fog`],
    48: [`Rime`, `angry_clouds`],
    51: [`Light drizzle`, `${dayOrNight()}_rain`],
    53: [`Moderate drizzle`, `${dayOrNight()}_rain`],
    55: [`Dense drizzle`, `${dayOrNight()}_rain`],
    56: [`Freezing drizzle`, `${dayOrNight()}_sleet`],
    57: [`Freezing drizzle`, `${dayOrNight()}_sleet`],
    61: [`Slight rain`, `rain`],
    63: [`Moderate rain`, `rain`],
    65: [`Heavy rain`, `rain_thunder`],
    66: [`Freezing rain`, `sleet`],
    67: [`Freezing rain`, `sleet`],
    71: [`Slight snow`, `${dayOrNight()}_snow`],
    73: [`Moderate snow`, `snow`],
    75: [`Heavy snow`, `snow`],
    77: [`Snow grains`, `${dayOrNight()}_snow`],
    80: [`Slight shower`, `rain`],
    81: [`Moderate shower`, `rain`],
    82: [`Violent shower`, `rain_thunder`],
    85: [`Snow shower`, `snow`],
    86: [`Snow shower`, `snow`],
    95: [`Thunderstorm`, `thunder`],
    96: [`Thunderstorm`, `thunder`],
    99: [`Thunderstorm`, `thunder`],
  };
  //// IF desc == true, return the description
  // if it is false, return the icon file name
  if (desc) return codes[code][0];
  if (!desc) return codes[code][1];
};
