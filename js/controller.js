import * as model from './model.js';
import cardsView from './views/cardsView.js';
import todayView from './views/todayView.js';
import tomorrowView from './views/tomorrowView.js';
import chartView from './views/chartView.js';
import { control } from 'leaflet';

const controlLoadWeather = async function () {
  try {
    // 1) Load current location
    await model.loadLocation();

    // 2) Load weather based on current location
    await model.loadWeather();

    // 3) Load the data for real time clock
    model.loadTime();

    // 4) Render the weather
    cardsView.render(model.state);

    // 5) Render the clock
    cardsView.updateClock(model.state);

    // 6) Fade the DOM in
    cardsView._loadFadeIn();

    // 7) Render chart (for 7 days)
    chartView.renderChart(model.state);
  } catch (err) {
    console.log(err);
  }
};

const controlNextDays = async function () {
  // 0) Fade out previous content
  await cardsView._loadFadeOut();

  // 1) Render the weather for the next days
  cardsView.render(model.state);

  // 2) Render the clock
  cardsView.updateClock(model.state);

  // 3) Fade the DOM in
  cardsView._loadFadeIn();
};

const controlToday = async function () {
  // 0) Fade out previous content
  await cardsView._loadFadeOut();

  // 1) Render today's data
  todayView.render(model.state);

  // 2) Render the clock
  todayView.updateClock(model.state);

  // 3) Render the cards
  todayView.generateCards(model.state);

  // 4) Fade the DOM in
  todayView._loadFadeIn();
};

const controlTomorrow = async function () {
  // 0) Fade out previous content
  await cardsView._loadFadeOut();

  // 1) Render tomorrow's data
  tomorrowView.render(model.state);

  // 2) Render the clock
  tomorrowView.updateClock(model.state);

  // 3) Render the cards
  tomorrowView.generateCards(model.state);

  // 4) Fade the DOM in
  tomorrowView._loadFadeIn();
};

const init = function () {
  controlLoadWeather(); // Window load
  cardsView.addHandlerRender(controlNextDays); // 'Next 7 days' button click
  todayView.addHandlerRender(controlToday); // 'Today' button click
  tomorrowView.addHandlerRender(controlTomorrow); // 'Tomorrow' button click
};
init();
