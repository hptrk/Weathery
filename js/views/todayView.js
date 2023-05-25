//---------- This view is responsible for rendering the "Today" cards section on click ----------//

import View from './View.js';
import { getSVGLink, getArrowSVGCode } from '../helpers.js';

class TodayView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _buttons = document.querySelectorAll('.forecast__header-menu--item');
  _todayButton = this._buttons[0];
  _tomorrowButton = this._buttons[1];
  _nextDaysButton = this._buttons[2];
  _switcher = document.getElementById('forecastSwitcher');
  _checkbox = document.querySelector('.forecast__header-switcher--checkbox');
  _cardNumber;

  // ---------- DEFAULTS ---------- //

  constructor() {
    super();
    this._addListener();
  }

  _addListener() {
    // Click on today
    this._todayButton.addEventListener('click', () => {
      this._focusOnToday(); // put visual focus to Today
      this._resetSwitcher(); // back to forecast state
    });

    // Click on switcher (forecast - wind)
    this._switcher.addEventListener('change', () => {
      this._flipCards(); // show wind/forecast cards
    });
  }

  // ---------- HANDLER ---------- //

  addHandlerRender(handler) {
    this._todayButton.addEventListener('click', handler);
  }

  // ---------- MAIN FUNCTION ---------- //

  _generateCards() {
    // Reset cards first (remove previous content)
    this._resetCards();

    // Set the number of displayed cards
    this._cardNumber = this._data.weather.days.zero.icons.length;

    // Render weather cards
    this._renderCards();
  }

  // ---------- HELPER FUNCTIONS ---------- //

  _renderCards() {
    // Add card to the DOM
    Array.from({ length: this._cardNumber }).forEach((_, i) =>
      this._parentElement.insertAdjacentHTML(
        'beforeend',
        this._generateCardMarkup(i)
      )
    );
  }

  _generateCardMarkup(num) {
    // Hour mark of the card
    const date = this._getCardHour(num);

    // Precipitation probability
    const precProb = this._getPrecProb(num);

    return `
  <figure class="forecast__container-card">
          <div class="forecast__container-card_front">

            <div class="forecast__container-card--header">
              <span>${date.getHours()}:00</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${getSVGLink(this._data.weather.days.zero.icons[num])}"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${
                  this._data.weather.days.zero.temperature[num]
                }&#176;</span>
                <span>${precProb >= 10 ? precProb + '%' : ''}</span>
              </div>
            </div>

          </div>

          <div class="forecast__container-card_back">

            <div class="forecast__container-card--header">
             <span>${date.getHours()}:00</span>
            </div>

            <div class="forecast__container-card--main">
              ${getArrowSVGCode(
                this._data.weather.days.zero.wind_direction_hourly[num]
              )}
              <div class="numbers">
               <span>${
                 this._data.weather.days.zero.windspeed_hourly[num]
               }</span>
               <span class="windspeedUnit">km/h</span>
              </div>
            </div>
          </div>

        </figure>`;
  }

  _getPrecProb(num) {
    // precipitation probability rounded to fives
    return (
      Math.round(
        this._data.weather.days.zero.precipitation_probability_hourly[num] / 5
      ) * 5
    );
  }

  _focusOnToday() {
    this._todayButton.classList.toggle('forecast__active-item');
    this._tomorrowButton.classList.remove('forecast__active-item');
    this._nextDaysButton.classList.remove('forecast__active-item');
  }
}

export default new TodayView();
