import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import {
  AJAX,
  getDaily,
  getHourly,
  round,
  runEverySec,
  leadingZero,
  updateDayNames,
  getFromCode,
  isDayTime,
} from './helpers';

// current state object
export const state = {
  currentTime: '',
  dayNames: {}, // zero: current day, one: tomorrow, etc..
  location: {}, // latitude: x, longitude: y
  weather: {},
  savedCities: [],
  search: {
    query: '',
    results: [],
  },
  locale: 'en-US', // will be automatic later
};

// creates a weather object based on open-meteo API
const createWeatherObject = function (data) {
  // API has some data about the current weather
  const { current_weather: current } = data;
  return {
    // CURRENT DAY
    current: {
      temperature: round(current.temperature),
      windSpeed: round(current.windspeed),
      weathercode: current.weathercode,
      description: getFromCode(current.weathercode),
      icon: getFromCode(
        current.weathercode,
        false,
        isDayTime(getDaily(data, 0).sunrise, getDaily(data, 0).sunset)
      ),
      relativeHumidity: getHourly(data, 0).relativeHumidity, // current day = 0
      apparentTemp: getHourly(data, 0).apparentTemp,
      sunrise: getDaily(data, 0).sunrise,
      sunset: getDaily(data, 0).sunset,
    },
    // NEXT 6 DAYS FROM THE CURRENT DAY
    days: {
      zero: getDaily(data, 0),
      one: getDaily(data, 1),
      two: getDaily(data, 2),
      three: getDaily(data, 3),
      four: getDaily(data, 4),
      five: getDaily(data, 5),
      six: getDaily(data, 6),
    },
  };
};

// load current position + weather
export const loadLocation = async () => {
  if (!navigator.geolocation)
    return console.error('💥 Geolocation is not supported by your browser 💥');

  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  state.location.latitude = pos.coords.latitude;
  state.location.longitude = pos.coords.longitude;
};

// loading the data from open-meteo API
export const loadWeather = async function (
  lat = state.location.latitude,
  long = state.location.longitude
) {
  try {
    const data = await AJAX(API_URL(lat, long));

    state.weather = createWeatherObject(data);
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

export const loadTime = function () {
  // load day names on page load
  updateDayNames(state);

  function getTime() {
    const now = new Date(); // full date
    // Add leading zero to single-digit numbers
    let hours = leadingZero(now.getHours());
    let minutes = leadingZero(now.getMinutes());
    let seconds = leadingZero(now.getSeconds());

    // Update the time
    state.currentTime = `${hours}:${minutes}:${seconds}`;

    // If it is midnight, update the day names
    if (state.currentTime === `00:00:00`) updateDayNames(state);
  }

  // Need to call the function first for instant time information
  getTime();
  // The time will update every second
  runEverySec(getTime);
};
