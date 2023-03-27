import * as model from './model.js';
import cardsView from './views/cardsView.js';

const controlWeather = async function () {
  try {
    // 1) Load current location
    await model.loadLocation();

    // 2) Load weather based on current location
    await model.loadWeather();

    // 3) Render the weather to the DOM
    cardsView.render(model.state.weather);

    // 4) Load the data for real time clock
    model.loadTime();

    // 5) Render the clock to the DOM
    cardsView.updateClock(model.state);
  } catch (err) {
    console.log(err);
  }
};
const init = function () {
  cardsView.addHandlerRender(controlWeather);
};
init();
