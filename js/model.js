import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { AJAX, getDaily, getHourly } from './helpers';

// current state object
export const state = {
  location: { latitude: '', longitude: '' },
  weather: {},
  savedCities: [],
  search: {
    query: '',
    results: [],
  },
};

// creates a weather object based on open-meteo API
const createWeatherObject = function (data) {
  // API has some data about the current weather
  const { current_weather: current } = data;
  return {
    // CURRENT DAY
    current: {
      temperature: current.temperature,
      windSpeed: current.windspeed,
      weathercode: current.weathercode,
      //BUG!! TODO (0.LINE)
      relativeHumidity: getHourly(data, 0).relativeHumidity, // current day = 0
      apparentTemp: getHourly(data, 0).apparentTemp,
    },
    // NEXT 6 DAYS FROM THE CURRENT DAY
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

// loading the data from open-meteo API
const loadWeather = async function (lat, long) {
  try {
    const data = await AJAX(API_URL(lat, long));
    console.log(data); // TEST
    state.weather = createWeatherObject(data);
    console.log(state.weather); // TEST
  } catch (err) {
    console.error(`${err} 💥`);
    throw err;
  }
};

// load current position + weather
export const loadLocation = () => {
  // geolocation - SUCCESS
  const success = position => {
    state.location.latitude = position.coords.latitude;
    state.location.longitude = position.coords.longitude;
    loadWeather(state.location.latitude, state.location.longitude); // load weather with current position
  };
  // geolocation - ERROR
  const error = () => {
    console.error('💥 Unable to retrieve your position 💥');
  };

  if (!navigator.geolocation) {
    console.error('💥 Geolocation is not supported by your browser 💥');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
};
