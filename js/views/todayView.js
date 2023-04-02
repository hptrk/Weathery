import { mark } from 'regenerator-runtime';
import View from './View.js';
import { runEverySec, getSVGLink } from '../helpers.js';

class TodayView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _todayButton = document.querySelectorAll('.forecast__header-menu--item')[0];

  addHandlerRender(handler) {
    this._todayButton.addEventListener('click', handler);
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

  _generateCard() {
    const hour = new Date().getHours();
    return `<figure class="forecast__container-card">

    <div class="forecast__container-card--header">
      <span>${hour}:00</span>
    </div>

    <div class="forecast__container-card--main">
      <img
      src="${getSVGLink(this._data.weather.days.zero.icons[0])}"
        class="icon-weather"
      />
      <div class="numbers">
        <span>${this._data.weather.days.zero.temperature[0]}&#176;</span>
        <span></span>
      </div>
    </div>
  </figure>`;
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
          ${this._generateCard()}
    `;
    return markup;
  }
}
export default new TodayView();
