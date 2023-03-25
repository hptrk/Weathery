import * as model from './model.js';

const controlWeather = async function () {
  try {
    // 1) Load weather based on current location
    model.loadLocation();
  } catch (err) {
    console.log(err);
  }
};
const init = function () {
  controlWeather();
};
init();
