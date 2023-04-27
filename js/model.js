//---------- The model represents and manages data, as well as the rules and behaviors associated with that data ----------//

import { async } from 'regenerator-runtime';
import { WEATHER_API, REVERSE_GEOCODE, AUTOCOMPLETE } from './config';
import {
  AJAX,
  getDaily,
  getHourlyCurrent,
  round,
  runEverySec,
  leadingZero,
  updateDayNames,
  getFromCode,
  isDayTime,
  updateLocalStorage,
} from './helpers';
import { pinned } from '../icons/likeSVG';

// current state object
export const state = {
  currentTime: '',
  dayNames: {}, // zero: current day, one: tomorrow, etc..
  location: {}, // latitude: x, longitude: y, city: ..., country: ...
  weather: {},
  favorites: [], // latitude: x, longitude: y, city: ..., country: ...
  pinned: [], // max 3 city object
  search: {
    query: '', // query and results will refresh on every autocomplete
    results: [],
  },
  locale: 'en-US', // will be automatic later
};

// ---------- WORKING WITH WEATHER DATAS (forecast section) ---------- //
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
      relativeHumidity: getHourlyCurrent(data, 0).relativeHumidity, // current day = 0
      apparentTemp: getHourlyCurrent(data, 0).apparentTemp,
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

const createPinnedObject = function (data) {
  const { current_weather: current } = data;
  return {
    temperature: round(current.temperature),
    description: getFromCode(current.weathercode),
    icon: getFromCode(
      current.weathercode,
      false,
      isDayTime(getDaily(data, 0).sunrise, getDaily(data, 0).sunset)
    ),
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
  long = state.location.longitude,
  pinnedCity = false
) {
  try {
    const data = await AJAX(WEATHER_API(lat, long));

    // default state
    if (!pinnedCity) {
      state.weather = createWeatherObject(data);
      await loadCity(lat, long);
    }
    // if pinned city data needed
    if (pinnedCity) return createPinnedObject(data);
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

// ---------- REVERSE GEOCODING ---------- //
export const loadCity = async function (lat, long) {
  try {
    const { features: res } = await AJAX(REVERSE_GEOCODE(lat, long));
    const data = res[0].properties;
    console.log(data);

    state.location.city = data.city;
    state.location.country = data.country;
  } catch (err) {
    console.error(`${err} 💥`);
  }
};

// ---------- SEARCH RESULTS ---------- //

export const loadSearchResults = async function (
  text,
  closest = [state.location.latitude, state.location.longitude]
) {
  try {
    const { results } = await AJAX(AUTOCOMPLETE(text, closest));
    results.sort((a, b) => b.rank.importance - a.rank.importance); // sort results by importance
    state.search.results = results; // load into state object
  } catch (err) {
    console.error(`${err} 💥`);
  }
};

// ---------- ADD TO FAVORITES ---------- //

export const manageFavorites = function (cityArray) {
  // -- REMOVE FROM FAVORITE -- //
  let removedFromFav = false;
  // loop over the favorites to find a matching city
  state.favorites.forEach((c, i) => {
    if (c.lat === cityArray.lat && c.lon === cityArray.lon) {
      state.favorites.splice(i, 1); // remove object
      removedFromFav = true;
      updateLocalStorage('favorites', state.favorites);
      return;
    }
  });
  if (removedFromFav) return; // prevent from pushing the city object again

  // -- ADD TO FAVORITE -- //
  state.favorites.push({
    lat: cityArray.lat,
    lon: cityArray.lon,
    city: cityArray.city,
    country: cityArray.country,
  });
  updateLocalStorage('favorites', state.favorites);
};

// ---------- ADD TO PINNED CIIES ---------- //

export const managePinned = function (cityArray) {
  // counts pinned cities
  const pinnedCount = state.favorites.reduce((acc, c) => {
    if (c.isPinned) return acc + 1;
    return acc;
  }, 0);

  state.favorites.forEach(c => {
    // loop over the favorites to find the pinned city
    if (c.lat === cityArray.lat && c.lon === cityArray.lon) {
      // toggle the boolean
      // add to pinned if limit (max 3) is not reached
      if (!c.isPinned && pinnedCount < 3) {
        c.isPinned = true;
        updateLocalStorage('favorites', state.favorites);
        return;
      }

      // if limit reached, throw error
      if (!c.isPinned && pinnedCount === 3)
        throw new Error('You can have only 3 pinned cities!');
      // with this error throw, the PIN svg animation won't happen

      // else, unpin it
      c.isPinned = false;
      updateLocalStorage('favorites', state.favorites);
    }
  });
};

// ---------- LOAD FAVORITES FROM LOCAL STORAGE ---------- //
export const loadFavorites = function () {
  state.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
};

// ---------- REFRESH PINNED CITY OBJECT ---------- //
export const refreshPinnedCities = async function () {
  state.pinned = []; // clear
  state.favorites.forEach(c => {
    c.isPinned && state.pinned.push(c); // push pinned city
  });

  // fill pinned object with needed datas
  // need to use for of becaues of awaiting the asynchronous 'loadWeather' (forEach does not work)
  for (const c of state.pinned) {
    const data = await loadWeather(c.lat, c.lon, true);
    c.temperature = data.temperature;
    c.description = data.description;
    c.icon = data.icon;
  }
};
