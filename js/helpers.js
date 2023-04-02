import { TIMEOUT_SEC } from './config';

//------ ICON IMPORTS ------//
import day_clear from '../icons/day_clear.svg';
import night_clear from '../icons/night_clear.svg';
import day_partial_cloud from '../icons/day_partial_cloud.svg';
import night_partial_cloud from '../icons/night_partial_cloud.svg';
import overcast from '../icons/overcast.svg';
import fog from '../icons/fog.svg';
import angry_clouds from '../icons/angry_clouds.svg';
import day_rain from '../icons/day_rain.svg';
import night_rain from '../icons/night_rain.svg';
import day_sleet from '../icons/day_sleet.svg';
import night_sleet from '../icons/night_sleet.svg';
import rain from '../icons/rain.svg';
import rain_thunder from '../icons/rain_thunder.svg';
import sleet from '../icons/sleet.svg';
import day_snow from '../icons/day_snow.svg';
import night_snow from '../icons/night_snow.svg';
import snow from '../icons/snow.svg';
import thunder from '../icons/thunder.svg';

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
// get data from TODAY/TOMORROW to display on cards
const getTodayTomorrow = (data, dayNumber) => {
  const hour = getHour(); // current hour
  const mapArrayRounded = array => {
    // DRY code helper
    return array.map(i => round(i));
  };

  // TOMORROW
  if (dayNumber === 1) return mapArrayRounded(data.slice(24, 48)); // 00:00-23:00

  // TODAY
  // (need to return at least 6 values becaues there are 6 cards)
  //
  // IF time < 18, it will return values for all of the remaining hours
  if (dayNumber === 0 && hour < 18)
    return mapArrayRounded(data.slice(hour + 1, 23));
  // IF time >= 18, it will return 6 values including hours from tomorrow
  else if (dayNumber === 0 && hour >= 18) {
    return mapArrayRounded(data.slice(hour + 1, hour + 1 + 6));
  }
};

////////////////////
// GET DAILY WEATHER OBJECT
export const getDaily = function (data, dayNumber) {
  const { daily, hourly } = data;

  // temperature and weather code needed only from the day ZERO(current), and day ONE(tomorrow)
  let temp = null;
  let wcode = null;

  if (dayNumber === 0) {
    temp = getTodayTomorrow(hourly.temperature_2m, 0);
    wcode = getTodayTomorrow(hourly.weathercode, 0);
  }
  if (dayNumber === 1) {
    temp = getTodayTomorrow(hourly.temperature_2m, 1);
    wcode = getTodayTomorrow(hourly.weathercode, 1);
  }

  return {
    weathercode: daily.weathercode[dayNumber],
    description: getFromCode(daily.weathercode[dayNumber]),
    icon: getFromCode(
      daily.weathercode[dayNumber],
      false,
      isDayTime(daily.sunrise[dayNumber], daily.sunset[dayNumber])
    ),
    minTemp: round(daily.temperature_2m_min[dayNumber]),
    maxTemp: round(daily.temperature_2m_max[dayNumber]),
    sunrise: daily.sunrise[dayNumber],
    sunset: daily.sunset[dayNumber],
    temperature: temp,
    weathercodes: wcode,
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

////////////////////
// GET THE URL OF THE SVG ELEMENT
// 'iconfilename': link
export const getSVGLink = iconName => {
  const svglinks = {
    day_clear: day_clear,
    night_clear: night_clear,
    day_partial_cloud: day_partial_cloud,
    night_partial_cloud: night_partial_cloud,
    overcast: overcast,
    fog: fog,
    angry_clouds: angry_clouds,
    day_rain: day_rain,
    night_rain: night_rain,
    day_sleet: day_sleet,
    night_sleet: night_sleet,
    rain: rain,
    rain_thunder: rain_thunder,
    sleet: sleet,
    day_snow: day_snow,
    night_snow: night_snow,
    snow: snow,
    thunder: thunder,
  };
  return svglinks[iconName];
};

////////////////////
// DECIDE IF THE HELPER FUNCTION HAS TO RETURN DAY OR NIGHT ICONS
export const isDayTime = (sunrise, sunset) => {
  const dateNow = new Date();
  const hourNow = dateNow.getHours();
  const minNow = dateNow.getMinutes();

  // if the time starts with '0' (06:07), then only use the second char
  function checkZero(s) {
    return s[0] === '0' ? +s[1] : +s;
  }

  const sunriseHour = checkZero(sunrise.slice(11, 13));
  const sunriseMin = checkZero(sunrise.slice(14, 16));
  const sunsetHour = checkZero(sunset.slice(11, 13));
  const sunsetMin = checkZero(sunset.slice(14, 16));
  // return true if it is sunrise or sunset hour, and the minutes are before/after
  if (
    (hourNow === sunriseHour && sunriseMin <= minNow) ||
    (hourNow === sunsetHour && sunsetMin > minNow)
  )
    return true;
  // return true if the hour is between the sunrise and the sunset
  if (hourNow > sunriseHour && hourNow < sunsetHour) return true;
  // if nothing is returned, then it is night time (return false)
  return false;
};
