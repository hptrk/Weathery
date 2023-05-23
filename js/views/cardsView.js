//---------- This view is responsible for rendering the "Next 7 days" cards section ----------//

import View from './View.js';
import { runEverySec, getSVGLink, getArrowSVGCode, sleep } from '../helpers';

class CardsView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _buttons = document.querySelectorAll('.forecast__header-menu--item');
  _todayButton = this._buttons[0];
  _tomorrowButton = this._buttons[1];
  _nextDaysButton = this._buttons[2];
  _switcher = document.getElementById('forecastSwitcher');
  _checkbox = document.querySelector('.forecast__header-switcher--checkbox');
  _errorMessage =
    'Something went wrong while retrieving the weather for your city. Please refresh the page and try again.';

  // ---------- DEFAULTS ---------- //

  constructor() {
    super();
    this._addListener();
  }

  _addListener() {
    // CLICK ON NEXT 7 DAYS
    this._nextDaysButton.addEventListener('click', () => {
      this._focusOnNextDays(); // put visual focus back to Next 7 Days
      this._resetSwitcher(); // back to forecast state
    });

    // CLICK ON SWITCHER (forecast - wind)
    this._switcher.addEventListener('change', () => {
      this._flipCards(); // show wind/forecast cards
    });
  }

  // ---------- HANDLER ---------- //

  addHandlerRender(handler) {
    this._nextDaysButton.addEventListener('click', handler);
  }

  // ---------- MAIN FUNCTIONS ---------- //

  _generateCards() {
    // Reset cards first (remove previous content)
    this._resetCards();

    // Render weather cards
    this._renderCards();
  }

  updateClock(data) {
    // Need to call the function first for instant DOM update
    this._updateDOM(data);
    // The DOM will update every second
    runEverySec(() => this._updateDOM(data));
  }

  loadFadeIn() {
    // works for ALL view
    const cardsHeader = document.querySelectorAll(
      '.forecast__container-card--header'
    );
    const cardsMain = document.querySelectorAll(
      '.forecast__container-card--main'
    );

    [cardsHeader, cardsMain].forEach(nodelist =>
      nodelist.forEach(c => {
        this._fadeIn(c);
      })
    );
  }

  async loadFadeOut() {
    // works for ALL view
    const cardsHeader = document.querySelectorAll(
      '.forecast__container-card--header'
    );
    const cardsMain = document.querySelectorAll(
      '.forecast__container-card--main'
    );
    [cardsHeader, cardsMain].forEach(nodelist =>
      nodelist.forEach((c, i) => {
        if (i === 0) return;
        this._fadeOut(c);
      })
    );
    await sleep(0.3);
  }

  _generateMarkup() {
    return `
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
  }

  // ---------- HELPER FUNCTIONS ---------- //

  _renderCards() {
    // Add card to the DOM
    ['one', 'two', 'three', 'four', 'five', 'six'].forEach(num =>
      this._parentElement.insertAdjacentHTML(
        'beforeend',
        this._generateCardMarkup(num)
      )
    );
  }

  _generateCardMarkup(num) {
    return `
    <figure class="forecast__container-card">
    <div class="forecast__container-card_front">

      <div class="forecast__container-card--header">
        <span>${this._data.dayNames[num].slice(0, 3)}</span>
      </div>

      <div class="forecast__container-card--main">
        <img
          src="${getSVGLink(this._data.weather.days[num].icon)}"
          alt="${this._data.weather.days[num].description}"
          class="icon-weather"
        />
        <div class="numbers">
          <span>${this._data.weather.days[num].maxTemp}&#176;</span>
          <span>${this._data.weather.days[num].minTemp}&#176;</span>
        </div>
      </div>

    </div>

    <div class="forecast__container-card_back">

      <div class="forecast__container-card--header">
       <span>${this._data.dayNames[num].slice(0, 3)}</span>
      </div>

      <div class="forecast__container-card--main">
        ${getArrowSVGCode(this._data.weather.days[num].wind_direction)}
        <div class="numbers">
         <span>${this._data.weather.days[num].windspeed}</span>
         <span class="windspeedUnit">km/h</span>
        </div>
      </div>
    </div>

  </figure>`;
  }

  _updateDOM(data) {
    const header = document.querySelector('.forecast__container-card--header'); // card's header
    // clear
    header.innerHTML = '';
    // fill
    header.insertAdjacentHTML(
      'afterbegin',
      `<span>${
        data.dayNames.zero
      }</span><span class="numbers">${data.currentTime.slice(
        0,
        5
      )}<span class="sec">${data.currentTime.slice(6)}</span></span>`
    );
  }

  _fadeIn(element) {
    element.classList.add('fade-in');
  }
  _fadeOut(element) {
    element.classList.toggle('fade-out');
  }

  _focusOnNextDays() {
    this._nextDaysButton.classList.toggle('forecast__active-item');
    this._tomorrowButton.classList.remove('forecast__active-item');
    this._todayButton.classList.remove('forecast__active-item');
  }

  _resetSwitcher() {
    this._checkbox.checked = false; // reset the switcher back to the forecast state
  }
}
export default new CardsView();
