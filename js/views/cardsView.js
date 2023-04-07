import View from './View.js';
import { runEverySec, getSVGLink, getArrowSVGCode } from '../helpers';

class CardsView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _errorMessage = 'We could not load the weather for you. Please try again!';
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
    window.addEventListener('load', handler);
    this._nextDaysButton.addEventListener('click', handler);
  }

  _addListener() {
    // CLICK ON NEXT 7 DAYS
    this._nextDaysButton.addEventListener('click', () => {
      this._nextDaysButton.classList.toggle('forecast__active-item');
      this._tomorrowButton.classList.remove('forecast__active-item');
      this._todayButton.classList.remove('forecast__active-item');
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

          <figure class="forecast__container-card">
          <div class="forecast__container-card_front">

            <div class="forecast__container-card--header">
              <span>${this._data.dayNames.one.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${getSVGLink(this._data.weather.days.one.icon)}"
                alt="${this._data.weather.days.one.description}"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.weather.days.one.maxTemp}&#176;</span>
                <span>${this._data.weather.days.one.minTemp}&#176;</span>
              </div>
            </div>

          </div>

          <div class="forecast__container-card_back">

            <div class="forecast__container-card--header">
             <span>${this._data.dayNames.one.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              ${getArrowSVGCode(this._data.weather.days.one.wind_direction)}
              <div class="numbers">
               <span>${this._data.weather.days.one.windspeed}</span>
               <span class="windspeedUnit">km/h</span>
              </div>
            </div>
          </div>

        </figure>

        <figure class="forecast__container-card">
        <div class="forecast__container-card_front">

          <div class="forecast__container-card--header">
            <span>${this._data.dayNames.two.slice(0, 3)}</span>
          </div>

          <div class="forecast__container-card--main">
            <img
              src="${getSVGLink(this._data.weather.days.two.icon)}"
              alt="${this._data.weather.days.two.description}"
              class="icon-weather"
            />
            <div class="numbers">
              <span>${this._data.weather.days.two.maxTemp}&#176;</span>
              <span>${this._data.weather.days.two.minTemp}&#176;</span>
            </div>
          </div>

        </div>

        <div class="forecast__container-card_back">

          <div class="forecast__container-card--header">
           <span>${this._data.dayNames.two.slice(0, 3)}</span>
          </div>

          <div class="forecast__container-card--main">
          ${getArrowSVGCode(this._data.weather.days.two.wind_direction)}
            <div class="numbers">
             <span>${this._data.weather.days.two.windspeed}</span>
             <span class="windspeedUnit">km/h</span>
            </div>
          </div>
        </div>

      </figure>

        <figure class="forecast__container-card">
        <div class="forecast__container-card_front">

          <div class="forecast__container-card--header">
            <span>${this._data.dayNames.three.slice(0, 3)}</span>
          </div>

          <div class="forecast__container-card--main">
            <img
              src="${getSVGLink(this._data.weather.days.three.icon)}"
              alt="${this._data.weather.days.three.description}"
              class="icon-weather"
            />
            <div class="numbers">
              <span>${this._data.weather.days.three.maxTemp}&#176;</span>
              <span>${this._data.weather.days.three.minTemp}&#176;</span>
            </div>
          </div>

        </div>

        <div class="forecast__container-card_back">

          <div class="forecast__container-card--header">
           <span>${this._data.dayNames.three.slice(0, 3)}</span>
          </div>

          <div class="forecast__container-card--main">
          ${getArrowSVGCode(this._data.weather.days.three.wind_direction)}
            <div class="numbers">
             <span>${this._data.weather.days.three.windspeed}</span>
             <span class="windspeedUnit">km/h</span>
            </div>
          </div>
        </div>

       </figure>

        <figure class="forecast__container-card">
        <div class="forecast__container-card_front">

          <div class="forecast__container-card--header">
            <span>${this._data.dayNames.four.slice(0, 3)}</span>
          </div>

          <div class="forecast__container-card--main">
            <img
              src="${getSVGLink(this._data.weather.days.four.icon)}"
              alt="${this._data.weather.days.four.description}"
              class="icon-weather"
            />
            <div class="numbers">
              <span>${this._data.weather.days.four.maxTemp}&#176;</span>
              <span>${this._data.weather.days.four.minTemp}&#176;</span>
            </div>
          </div>

        </div>

        <div class="forecast__container-card_back">

          <div class="forecast__container-card--header">
           <span>${this._data.dayNames.four.slice(0, 3)}</span>
          </div>

          <div class="forecast__container-card--main">
          ${getArrowSVGCode(this._data.weather.days.four.wind_direction)}
            <div class="numbers">
             <span>${this._data.weather.days.four.windspeed}</span>
             <span class="windspeedUnit">km/h</span>
            </div>
          </div>
        </div>

      </figure>

      <figure class="forecast__container-card">
      <div class="forecast__container-card_front">

        <div class="forecast__container-card--header">
          <span>${this._data.dayNames.five.slice(0, 3)}</span>
        </div>

        <div class="forecast__container-card--main">
          <img
            src="${getSVGLink(this._data.weather.days.five.icon)}"
            alt="${this._data.weather.days.five.description}"
            class="icon-weather"
          />
          <div class="numbers">
            <span>${this._data.weather.days.five.maxTemp}&#176;</span>
            <span>${this._data.weather.days.five.minTemp}&#176;</span>
          </div>
        </div>

      </div>

      <div class="forecast__container-card_back">

        <div class="forecast__container-card--header">
         <span>${this._data.dayNames.five.slice(0, 3)}</span>
        </div>

        <div class="forecast__container-card--main">
        ${getArrowSVGCode(this._data.weather.days.five.wind_direction)}
          <div class="numbers">
           <span>${this._data.weather.days.five.windspeed}</span>
           <span class="windspeedUnit">km/h</span>
          </div>
        </div>
      </div>

    </figure>

    <figure class="forecast__container-card">
    <div class="forecast__container-card_front">

      <div class="forecast__container-card--header">
        <span>${this._data.dayNames.six.slice(0, 3)}</span>
      </div>

      <div class="forecast__container-card--main">
        <img
          src="${getSVGLink(this._data.weather.days.six.icon)}"
          alt="${this._data.weather.days.six.description}"
          class="icon-weather"
        />
        <div class="numbers">
          <span>${this._data.weather.days.six.maxTemp}&#176;</span>
          <span>${this._data.weather.days.six.minTemp}&#176;</span>
        </div>
      </div>

    </div>

    <div class="forecast__container-card_back">

      <div class="forecast__container-card--header">
       <span>${this._data.dayNames.six.slice(0, 3)}</span>
      </div>

      <div class="forecast__container-card--main">
      ${getArrowSVGCode(this._data.weather.days.six.wind_direction)}
        <div class="numbers">
         <span>${this._data.weather.days.six.windspeed}</span>
         <span class="windspeedUnit">km/h</span>
        </div>
      </div>
    </div>

  </figure>
    `;
  }
}
export default new CardsView();
