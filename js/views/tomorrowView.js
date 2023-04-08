import { mark } from 'regenerator-runtime';
import View from './View.js';
import {
  runEverySec,
  getSVGLink,
  hoursString,
  getArrowSVGCode,
} from '../helpers.js';

class TomorrowView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _buttons = document.querySelectorAll('.forecast__header-menu--item');
  _todayButton = this._buttons[0];
  _tomorrowButton = this._buttons[1];
  _nextDaysButton = this._buttons[2];
  _switcher = document.getElementById('forecastSwitcher');
  _checkbox = document.querySelector('.forecast__header-switcher--checkbox');

  constructor() {
    super();
    this._addListener();
  }

  addHandlerRender(handler) {
    this._tomorrowButton.addEventListener('click', handler);
  }

  _addListener() {
    // CLICK ON NEXT 7 DAYS
    this._tomorrowButton.addEventListener('click', () => {
      this._tomorrowButton.classList.toggle('forecast__active-item');
      this._todayButton.classList.remove('forecast__active-item');
      this._nextDaysButton.classList.remove('forecast__active-item');
      this._resetSwitcher(); // back to forecast state
    });

    // CLICK ON SWITCHER (forecast - wind)
    this._switcher.addEventListener('change', () => {
      const cards = document.querySelectorAll('.forecast__container-card');
      cards.forEach((c, i) => {
        setTimeout(() => {
          if (i === 0) return; // SKIP first card (active)
          c.classList.toggle('is-flipped');
        }, i * 100); // 100MS delay for each card (animation)
      });
    });
  }

  _resetSwitcher() {
    this._checkbox.checked = false; // reset the switcher back to the forecast state
  }

  _generateCards() {
    const smallCards = document.querySelectorAll('.forecast__container-card');
    smallCards.forEach((card, i) => i !== 0 && card.remove()); // remove cards (skip the first big card)

    // this is how many cards should be displayed
    const cardNumber = this._data.weather.days.one.icons.length;
    // this function will create 1 card (should run at least 6 times)
    const card = i => {
      const date = new Date();
      date.setTime(date.getTime() + (i + 1) * 60 * 60 * 1000); // set the hour mark of the card

      return `
  <figure class="forecast__container-card">
          <div class="forecast__container-card_front">

            <div class="forecast__container-card--header">
              <span>${hoursString[i]}</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${getSVGLink(this._data.weather.days.one.icons[i])}"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.weather.days.one.temperature[i]}&#176;</span>
                <span></span>
              </div>
            </div>

          </div>

          <div class="forecast__container-card_back">

            <div class="forecast__container-card--header">
             <span>${hoursString[i]}</span>
            </div>

            <div class="forecast__container-card--main">
              ${getArrowSVGCode(
                this._data.weather.days.one.wind_direction_hourly[i]
              )}
              <div class="numbers">
               <span>${this._data.weather.days.one.windspeed_hourly[i]}</span>
               <span class="windspeedUnit">km/h</span>
              </div>
            </div>
          </div>

        </figure>`;
    };
    // this forEach runs the card() function 'cardNumber' times
    Array.from({ length: cardNumber }).forEach(
      (_, i) => this._parentElement.insertAdjacentHTML('beforeend', card(i)) // add the card to the DOM
    );
  }

  _loadFadeIn() {
    const cards = document.querySelectorAll('.forecast__container-card--main');
    cards.forEach((c, i) => {
      if (i === 0) return;
      this._fadeIn(c);
    });
  }

  _fadeIn(element) {
    element.classList.toggle('fade-in');
  }
}
export default new TomorrowView();
