import * as model from './model.js';
import cardsView from './views/cardsView.js';
import todayView from './views/todayView.js';
import tomorrowView from './views/tomorrowView.js';
import chartView from './views/chartView.js';
import locationView from './views/locationView.js';
import { control } from 'leaflet';

const controlLoadWeather = async function () {
  try {
    // 0) Load current location
    await model.loadLocation();

    // 0) Load weather based on current location
    await model.loadWeather();

    // 0) Load the data for real time clock
    model.loadTime();

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

const init = function () {
  controlLoadWeather(); // Window load
  cardsView.addHandlerRender(controlNextDays); // 'Next 7 days' button click
  todayView.addHandlerRender(controlToday); // 'Today' button click
  tomorrowView.addHandlerRender(controlTomorrow); // 'Tomorrow' button click
};
init();
