import * as model from './model.js';
import cardsView from './views/cardsView.js';
import todayView from './views/todayView.js';

const controlWeather = async function () {
  try {
    // 1) Load current location
    await model.loadLocation();

    // 2) Load weather based on current location
    await model.loadWeather();

    // 3) Load the data for real time clock
    model.loadTime();

    // 4) Render the weather to the DOM
    cardsView.render(model.state);

    // 5) Render the clock to the DOM
    cardsView.updateClock(model.state);
  } catch (err) {
    console.log(err);
  }
};

const controlToday = async function () {
  try {
    // 1) Render todays data to the DOM
    todayView.render(model.state);

    // 2) Render the clock to the DOM
    todayView.updateClock(model.state);
  } catch (err) {
    console.log(err);
  }
};
const init = function () {
  cardsView.addHandlerRender(controlWeather);
  todayView.addHandlerRender(controlToday);
};
init();
