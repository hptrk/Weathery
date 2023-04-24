//---------- The controller handles user input and updates the model and/or view accordingly ----------//

import * as model from './model.js';
import cardsView from './views/cardsView.js';
import todayView from './views/todayView.js';
import tomorrowView from './views/tomorrowView.js';
import chartView from './views/chartView.js';
import locationView from './views/locationView.js';
import searchView from './views/searchView.js';
import cityView from './views/cityView.js';
import favoriteView from './views/favoriteView.js';
import { control } from 'leaflet';

const controlStarterState = async function () {
  try {
    // 0) Load current location
    await model.loadLocation();

    // 0) Load weather based on current location
    await model.loadWeather();

    // 0) Load the data for real time clock
    model.loadTime();

    // 0) Prevent default behaviour on submit + handle clicks
    searchView.addBasicConfig();

    // 1) Render the location
    locationView.render(model.state.location);

    // 2) Render the weather
    cardsView.render(model.state);

    // 3) Render the clock
    cardsView.updateClock(model.state);

    // 4) Render the small cards
    cardsView.renderCards(model.state);

    // 5) Fade the DOM in
    cardsView.loadFadeIn();

    // 6) Render chart (for 7 days)
    chartView.renderChart(model.state);
  } catch (err) {
    console.log(err);
  }
};

const controlNextDays = async function () {
  try {
    // 0) Fade out previous content
    await cardsView.loadFadeOut();

    // 1) Render the small cards
    cardsView.renderCards(model.state);

    // 2) Fade the DOM in
    cardsView.loadFadeIn();
  } catch (err) {
    console.log(err);
  }
};

const controlToday = async function () {
  try {
    // 0) Fade out previous content
    await cardsView.loadFadeOut();

    // 1) Render the cards
    todayView.renderCards(model.state);

    // 2) Fade the DOM in
    cardsView.loadFadeIn();
  } catch (err) {
    console.log(err);
  }
};

const controlTomorrow = async function () {
  try {
    // 0) Fade out previous content
    await cardsView.loadFadeOut();

    // 1) Render the cards
    tomorrowView.renderCards(model.state);

    // 2) Fade the DOM in
    cardsView.loadFadeIn();
  } catch (err) {
    console.log(err);
  }
};

const controlSearchResults = async function () {
  // 0) Load search results from query
  await model.loadSearchResults(searchView.getValue());

  // 1) Generate search results
  searchView.generateResults(model.state.search.results, model.state.favorites);
};

const controlLoadCity = async function (searchview = true) {
  // Latitude, Longitude of clicked city
  const { lat, lon } =
    model.state.search.results[
      searchview ? cityView.indexOfClicked() : favoriteView.indexOfClicked()
    ];
  // 0) Load weather of clicked city
  await model.loadWeather(lat, lon);

  // 1) Render the location
  locationView.render(model.state.location);

  // 2) Render the weather
  cardsView.render(model.state);

  // 3) Render the clock
  cardsView.updateClock(model.state);

  // 4) Render the small cards
  cardsView.renderCards(model.state);

  // 5) Fade the DOM in
  cardsView.loadFadeIn();

  // 6) Render chart (for 7 days)
  chartView.renderChart(model.state);
};

const controlManageFavorite = function () {
  // 0) Load city to favorite object
  // 0) Remove city from favorite object
  model.manageFavorites(model.state.search.results[cityView.indexOfClicked()]);
};
const controlManageFavoriteList = function () {
  // 0) Remove city from favorite object
  model.manageFavorites(model.state.favorites[favoriteView.indexOfClicked()]);

  // 1) Refresh the view when removing a city
  favoriteView.refreshOnClick();
};

const controlLoadFavorite = function () {
  // 1) Render favorite cities
  favoriteView.generateFavorites(model.state.favorites);
};

const controlManagePins = function () {
  // 0) Add/remove pinned city
  model.managePinned(model.state.favorites[favoriteView.indexOfClicked()]);
};

const init = function () {
  controlStarterState(); // Window load
  cardsView.addHandlerRender(controlNextDays); // 'Next 7 days' button click
  todayView.addHandlerRender(controlToday); // 'Today' button click
  tomorrowView.addHandlerRender(controlTomorrow); // 'Tomorrow' button click
  searchView.addHandlerRender(controlSearchResults); // Search input
  cityView.addHandlerRender(controlLoadCity); // Click on a city in the search results
  cityView.addHandlerLike(controlManageFavorite); // Click on a like button (search bar)
  favoriteView.addHandlerLike(controlManageFavoriteList); // Click on a like button (favorites list)
  favoriteView.addHandlerRender(controlLoadFavorite); // Click on the menu (favorites) icon
  favoriteView.addHandlerLoad(controlLoadCity); // Click on a city in the favorites list
  favoriteView.addHandlerPin(controlManagePins); // Click on the pin icon
};
init();
