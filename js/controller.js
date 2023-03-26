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
    console.log(model.state.weather);
  } catch (err) {
    console.log(err);
  }
};
const init = function () {
  controlWeather();
};
init();
