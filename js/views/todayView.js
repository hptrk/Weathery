import { mark } from 'regenerator-runtime';
import View from './View.js';
import { runEverySec, getSVGLink, getArrowSVGCode } from '../helpers.js';

class TodayView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _buttons = document.querySelectorAll('.forecast__header-menu--item');
  _todayButton = this._buttons[0];
  _tomorrowButton = this._buttons[1];
  _nextDaysButton = this._buttons[2];
  _switcher = document.getElementById('forecastSwitcher');

  constructor() {
    super();
    this._addListener();
  }

  addHandlerRender(handler) {
    this._todayButton.addEventListener('click', handler);
  }

  _addListener() {
    // CLICK ON NEXT 7 DAYS
    this._todayButton.addEventListener('click', () => {
      this._todayButton.classList.toggle('forecast__active-item');
      this._tomorrowButton.classList.remove('forecast__active-item');
      this._nextDaysButton.classList.remove('forecast__active-item');
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

  updateClock(data) {
    const cardHeaderElement = document.querySelector(
      '.forecast__container-card--header'
    );
    function updateDOM() {
      cardHeaderElement.innerHTML = ''; // clear
      cardHeaderElement.insertAdjacentHTML(
        'afterbegin',
        `<span>${
          data.dayNames.zero
        }</span><span class="numbers">${data.currentTime.slice(
          0,
          5
        )}<span class="sec">${data.currentTime.slice(6)}</span></span>`
      ); // fill
    }
    // Need to call the function first for instant DOM update
    updateDOM();
    // The DOM will update every second
    runEverySec(updateDOM);
  }

  generateCards() {
    // this is how many cards should be displayed
    const cardNumber = this._data.weather.days.zero.icons.length;
    // this function will create 1 card (should run at least 6 times)
    const card = i => {
      const date = new Date();
      date.setTime(date.getTime() + (i + 1) * 60 * 60 * 1000); // set the hour mark of the card

      return `
  <figure class="forecast__container-card">
          <div class="forecast__container-card_front">

            <div class="forecast__container-card--header">
              <span>${date.getHours()}:00</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${getSVGLink(this._data.weather.days.zero.icons[i])}"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${
                  this._data.weather.days.zero.temperature[i]
                }&#176;</span>
                <span></span>
              </div>
            </div>

          </div>

          <div class="forecast__container-card_back">

            <div class="forecast__container-card--header">
             <span>${date.getHours()}:00</span>
            </div>

            <div class="forecast__container-card--main">
              ${getArrowSVGCode(
                this._data.weather.days.zero.wind_direction_hourly[i]
              )}
              <div class="numbers">
               <span>${this._data.weather.days.zero.windspeed_hourly[i]}</span>
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

  _generateMarkup() {
    const markup = `
    <figure class="forecast__container-card forecast__active-card">

            <div class="forecast__container-card--header">
             
            </div>

            <div class="forecast__container-card--main">
              <div>
                <span class="numbers">${
                  this._data.weather.current.temperature
                }&#176;</span>
                <img
                  src="${getSVGLink(this._data.weather.current.icon)}"
                  alt="${this._data.weather.current.description}"
                  class="icon-weather--active"
                />
              </div>
              <div>
                <ul>
                  <li>
                    Real Feel:
                    <strong><span class="numbers">${
                      this._data.weather.current.apparentTemp
                    }</span>&#176;</strong>
                  </li>
                  <li>
                    Wind:
                    <strong><span class="numbers">${
                      this._data.weather.current.windSpeed
                    }</span> km/h</strong>
                  </li>
                  <li>
                    Humidity: <strong><span class="numbers">${
                      this._data.weather.current.relativeHumidity
                    }%</span></strong>
                  </li>
                </ul>
                <ul>
                  <li>
                    Sunrise:
                    <strong><span class="numbers">${this._data.weather.current.sunrise.slice(
                      -5
                    )}</span></strong>
                  </li>
                  <li>
                    Sunset:
                    <strong><span class="numbers">${this._data.weather.current.sunset.slice(
                      -5
                    )}</span></strong>
                  </li>
                </ul>
              </div>
            </div>
          </figure>
    `;
    return markup;
  }
}
export default new TodayView();
