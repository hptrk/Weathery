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
import pinnedView from './views/pinnedView.js';
import mapView from './views/mapView.js';
import themeView from './views/themeView.js';
import infoView from './views/infoView.js';

const controlStarterState = async function () {
  try {
    // 0) Load current location
    await model.loadLocation();

    // 0) Load weather based on current location
    await model.loadWeather();

    // 0) Load favorite cities from localStorage
    model.loadFavorites();

    // 0) Load mini datas (icons, descriptions)
    await model.loadFavoriteCitiesData();

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

    // 7) Load default pinned cities
    model.refreshPinnedCities();

    // 8) Render pinned cities
    pinnedView.generatePinnedCities(model.state.pinned);

    // 9) Render map
    mapView.renderMap(
      model.state.favorites,
      model.state.location,
      controlLoadCity
    );

    // 10) Management of map resizing
    mapView.manageResize();
  } catch (err) {
    if (err.code === 1) {
      cityView.renderError();
      console.error(err);
      return;
    }
    cardsView.renderError();
    console.error(err);
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
    cardsView.renderError();
    console.error(err);
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
    cardsView.renderError();
    console.error(err);
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
    cardsView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 0) Load search results from query
    await model.loadSearchResults(searchView.getValue());

    // 1) Generate search results
    searchView.generateResults(
      model.state.search.results,
      model.state.favorites
    );
  } catch (err) {
    searchView.renderError();
    console.error(err);
  }
};

const controlLoadCity = async function (
  searchview = true,
  pinnedview = false,
  clickedMarkerMap = undefined
) {
  try {
    // searchview=true -> Search result clicked
    // searchview=false -> Favorite city clicked
    // searchview=false pinnedview=true -> Pinned city clicked
    // searchview=false pinnedview=false clickedMarkerMap=object -> Marker clicked on the map

    // prettier-ignore
    // Latitude, Longitude of clicked city
    const { lat, lon } = 
    searchview ? model.state.search.results[cityView.indexOfClicked('s')]
    : pinnedview ? model.state.pinned[pinnedView.indexOfClicked('p')] 
    : clickedMarkerMap ? clickedMarkerMap
    : model.state.favorites[favoriteView.indexOfClicked('f')];

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

    // 6) Reset the menu buttons back to 'Next 7 days'
    cityView.resetToNext7Days();

    // 7) Render chart (for 7 days)
    chartView.renderChart(model.state);

    // 8) Center the position of the map
    mapView.positionMapView([lat, lon]);

    // 9) Create marker with the loaded city
    mapView.createMarkers(
      [{ lat: lat, lon: lon }],
      controlLoadCity,
      model.state,
      false
    );
  } catch (err) {
    cardsView.renderError();
    console.error(err);
  }
};

const controlManageFavorite = async function () {
  try {
    // 0) Load city to favorite object
    // 0) Remove city from favorite object
    model.manageFavorites(
      model.state.search.results[cityView.indexOfClicked('s')]
    );

    // 0) Load mini datas (icons, descriptions)
    await model.loadFavoriteCitiesData();

    // 1) Refresh the markers on the map (Add/Remove)
    mapView.removeMarkers();
    mapView.createMarkers(model.state.favorites, controlLoadCity);
  } catch (err) {
    console.error(err);
  }
};

const controlManageFavoriteList = async function () {
  try {
    // 0) Remove city from favorite object
    model.manageFavorites(
      model.state.favorites[favoriteView.indexOfClicked('f')]
    );

    // 0) Load mini datas (icons, descriptions)
    await model.loadFavoriteCitiesData();

    // 1) Refresh the markers on the map (Add/Remove)
    mapView.removeMarkers();
    mapView.createMarkers(model.state.favorites, controlLoadCity);

    // 2) Refresh the view when removing a city
    favoriteView.refreshOnClick();
  } catch (err) {
    console.error(err);
  }
};

const controlLoadFavorite = function () {
  // 1) Render favorite cities
  favoriteView.generateFavorites(model.state.favorites);
};

const controlManagePins = function () {
  try {
    // 0) Add/remove pinned city
    model.managePinned(model.state.favorites[favoriteView.indexOfClicked('f')]);

    // 0) Refresh state.pinned object
    model.refreshPinnedCities();

    // 1) Toggling between pin & pinned icon
    favoriteView.togglePinIcon();

    // 2) Refresh pinned cards
    pinnedView.generatePinnedCities(model.state.pinned);
  } catch (error) {
    favoriteView.renderError(); // Pin limit reached
    console.error(error);
  }
};

const controlChangeTheme = function () {
  // 0) Remove map (for switching it)
  mapView.removeMap();

  // 1) Change the color theme of the site
  themeView.changeTheme();

  // 2) Render the custom map with the correct theme color
  mapView.renderMap(
    model.state.favorites,
    model.state.location,
    controlLoadCity,
    themeView.isLightMode()
  );
};

const controlDisplayInfoBox = function () {
  // 1) Display/remove info box
  infoView.renderInfoBox();
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
  pinnedView.addHandlerRender(controlLoadFavorite); // Click on 'Pin cities' (when empty)
  pinnedView.addHandlerLoad(controlLoadCity); // Click on a pinned city
  themeView.addHandlerChangeTheme(controlChangeTheme); // Change theme to light/dark mode
  infoView.addHandlerRender(controlDisplayInfoBox); // Click on the info icon
};
init();
