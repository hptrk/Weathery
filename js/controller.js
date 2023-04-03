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

    // 4) Render the weather
    cardsView.render(model.state);

    // 5) Render the clock
    cardsView.updateClock(model.state);
  } catch (err) {
    console.log(err);
  }
};

const controlToday = async function () {
  try {
    // 1) Render todays data
    todayView.render(model.state);

    // 2) Render the clock
    todayView.updateClock(model.state);

    // 3) Render the cards
    todayView.generateCards(model.state);
    console.log(model.state);
  } catch (err) {
    console.log(err);
  }
};
const init = function () {
  cardsView.addHandlerRender(controlWeather);
  todayView.addHandlerRender(controlToday);
};
init();
