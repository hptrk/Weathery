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
import { N, NE, E, SE, S, SW, W, NW } from '../icons/directionSVGS';
import { icon } from 'leaflet';

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
export const getHour = () => {
  return new Date().getHours();
};

////////////////////
// get data from TODAY/TOMORROW to display on cards
const getTodayTomorrow = (data, dayNumber, precprob = false) => {
  const hour = getHour(); // current hour
  const mapArrayRounded = array => {
    // DRY code helper
    return array.map(i => round(i));
  };

  // ---TOMORROW---
  if (dayNumber === 1) return mapArrayRounded(data.slice(24, 48)); // 00:00-23:00

  // ---TODAY---
  const skipNum = precprob ? 0 : 1; // if we need the precipitation probability, the current data is needed for chart
  // (need to return at least 6 values becaues there are 6 cards)
  //
  // IF time < 18, it will return values for all of the remaining hours
  if (dayNumber === 0 && hour < 18)
    return mapArrayRounded(data.slice(hour + skipNum, 24));
  // IF time >= 18, it will return 6 values including hours from tomorrow
  else if (dayNumber === 0 && hour >= 18) {
    return mapArrayRounded(data.slice(hour + skipNum, hour + 1 + 6));
  }
};

// this array is for the third parameter of the isDayTime() function
// prettier-ignore
export const hoursString = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00',
];

////////////////////
// GET DAILY WEATHER OBJECT
export const getDaily = function (data, dayNumber) {
  const { daily, hourly } = data;

  // temperature and weather code needed only from the day ZERO(current), and day ONE(tomorrow)
  let temp = null;
  let wcode = null;
  let icons = null;
  let windspeed_hourly = null;
  let wind_direction_hourly = null;
  let precipitation_probability_hourly = null;

  if (dayNumber === 0) {
    temp = getTodayTomorrow(hourly.temperature_2m, 0);
    wcode = getTodayTomorrow(hourly.weathercode, 0);
    icons = wcode.map((code, index) =>
      getFromCode(
        code,
        false,
        isDayTime(
          daily.sunrise[0],
          daily.sunset[0],
          hoursString[getHour() + 1 + index]
        )
      )
    );
    windspeed_hourly = getTodayTomorrow(hourly.windspeed_10m, 0);
    wind_direction_hourly = getTodayTomorrow(hourly.winddirection_10m, 0).map(
      i => degreeToDirection(i)
    );
    precipitation_probability_hourly = getTodayTomorrow(
      hourly.precipitation_probability,
      0,
      true
    );
  }
  if (dayNumber === 1) {
    temp = getTodayTomorrow(hourly.temperature_2m, 1);
    wcode = getTodayTomorrow(hourly.weathercode, 1);
    icons = wcode.map((code, index) =>
      getFromCode(
        code,
        false,
        isDayTime(daily.sunrise[1], daily.sunset[1], hoursString[index])
      )
    );
    windspeed_hourly = getTodayTomorrow(hourly.windspeed_10m, 1);
    wind_direction_hourly = getTodayTomorrow(hourly.winddirection_10m, 1).map(
      i => degreeToDirection(i)
    );
    precipitation_probability_hourly = getTodayTomorrow(
      hourly.precipitation_probability,
      1,
      true
    );
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
    icons: icons,
    windspeed_hourly: windspeed_hourly,
    wind_direction_hourly: wind_direction_hourly,
    windspeed: round(daily.windspeed_10m_max[dayNumber]),
    wind_direction: degreeToDirection(
      daily.winddirection_10m_dominant[dayNumber]
    ),
    precipitation_probability_max:
      daily.precipitation_probability_max[dayNumber],
    precipitation_probability_hourly: precipitation_probability_hourly,
  };
};

////////////////////
// GET HOURLY WEATHER OBJECT FOR CURRENT TEMP
export const getHourlyCurrent = function (data, dayNumber) {
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
export const isDayTime = (sunrise, sunset, now = '0') => {
  const dateNow = new Date();
  // if the function is called with a static now value, it should count with that value. e.g: '19:00'
  // if "now" stays 0, then work with the current hour
  const hourNow = now === '0' ? dateNow.getHours() : checkZero(now.slice(0, 2));
  const minNow =
    now === '0' ? dateNow.getMinutes() : checkZero(now.slice(3, 5));

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

////////////////////
// CONVERTS DEGREES TO DIRECTIONS (for the wind direction)
const degreeToDirection = deg => {
  // data is not a fractioned number, so the function can work with .5 values
  if (deg > 337.5 || deg < 22.5) return 'N';
  if (deg > 22.5 && deg < 67.5) return 'NE';
  if (deg > 67.5 && deg < 112.5) return 'E';
  if (deg > 112.5 && deg < 157.5) return 'SE';
  if (deg > 157.5 && deg < 202.5) return 'S';
  if (deg > 202.5 && deg < 247.5) return 'SW';
  if (deg > 247.5 && deg < 292.5) return 'W';
  if (deg > 292.5 && deg < 337.5) return 'NW';
};

export const getArrowSVGCode = direction => {
  if (direction === 'N') return N;
  if (direction === 'NE') return NE;
  if (direction === 'E') return E;
  if (direction === 'SE') return SE;
  if (direction === 'S') return S;
  if (direction === 'SW') return SW;
  if (direction === 'W') return W;
  if (direction === 'NW') return NW;
};
