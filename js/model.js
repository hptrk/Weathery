import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { AJAX, getDaily, getHourly } from './helpers';

export const state = {
  weather: {},
  savedCities: [],
  search: {
    query: '',
    results: [],
  },
};

const createWeatherObject = function (data) {
  // API has some data about the current weather
  const currentWeather = data.current_weather;
  return {
    current: {
      temperature: currentWeather.temperature,
      windSpeed: currentWeather.windspeed,
      weathercode: currentWeather.weathercode,
      relativeHumidity: getHourly(data, 0).relativeHumidity,
      apparentTemp: getHourly(data, 0).apparentTemp,
    },
    days: {
      one: getDaily(data, 1),
      two: getDaily(data, 2),
      three: getDaily(data, 3),
      four: getDaily(data, 4),
      five: getDaily(data, 5),
      six: getDaily(data, 6),
    },
  };
};

export const loadWeather = async function (lat, long) {
  try {
    const data = await AJAX(API_URL(lat, long));
    console.log(data);
    state.weather = createWeatherObject(data);
    console.log({ state });
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};
loadWeather('47.55', '21.62'); // TEST
