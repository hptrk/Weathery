import { icon } from 'leaflet';
import View from './View.js';
import day_clear from '../../icons/day_clear.svg';
import day_partial_cloud from '../../icons/day_partial_cloud.svg';
import day_rain_thunder from '../../icons/day_rain_thunder.svg';
import day_rain from '../../icons/day_rain.svg';
import rain_thunder from '../../icons/rain_thunder.svg';
import rain from '../../icons/rain.svg';
import { runEverySec } from '../helpers';

class CardsView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _errorMessage = 'We could not load the weather for you. Please try again!';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  updateClock(data) {
    const cardHeaderElement = document.querySelector(
      '.forecast__container-card--header'
    );
    function updateDOM() {
      cardHeaderElement.innerHTML = ''; // clear
      cardHeaderElement.insertAdjacentHTML(
        'afterbegin',
        `<span>Monday</span><span class="numbers">${data.currentTime.slice(
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
    console.log(this._data);
    return `
    <figure class="forecast__container-card forecast__active-card">

            <div class="forecast__container-card--header">
             
            </div>

            <div class="forecast__container-card--main">
              <div>
                <span class="numbers">${
                  this._data.current.temperature
                }&#176;</span>
                <img
                  src="${day_rain_thunder}"
                  alt="Sunny"
                  class="icon-weather--active"
                />
              </div>
              <div>
                <ul>
                  <li>
                    Real Feel:
                    <strong><span class="numbers">${
                      this._data.current.apparentTemp
                    }</span>&#176;</strong>
                  </li>
                  <li>
                    Wind:
                    <strong><span class="numbers">${
                      this._data.current.windSpeed
                    }</span> km/h</strong>
                  </li>
                  <li>
                    Humidity: <strong><span class="numbers">${
                      this._data.current.relativeHumidity
                    }%</span></strong>
                  </li>
                </ul>
                <ul>
                  <li>
                    Sunrise:
                    <strong><span class="numbers">${this._data.current.sunrise.slice(
                      -5
                    )}</span></strong>
                  </li>
                  <li>
                    Sunset:
                    <strong><span class="numbers">${this._data.current.sunset.slice(
                      -5
                    )}</span></strong>
                  </li>
                </ul>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>Tue</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${day_partial_cloud}"
                alt="Partial cloudy"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.days.one.maxTemp}&#176;</span>
                <span>${this._data.days.one.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>Wed</span>
            </div>

            <div class="forecast__container-card--main">
              <img src="${day_rain}" alt="Rainy" class="icon-weather" />
              <div class="numbers">
                <span>${this._data.days.two.maxTemp}&#176;</span>
                <span>${this._data.days.two.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>Thu</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${rain_thunder}"
                alt="Thunder"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.days.three.maxTemp}&#176;</span>
                <span>${this._data.days.three.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>Fri</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${rain_thunder}"
                alt="Thunder"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.days.four.maxTemp}&#176;</span>
                <span>${this._data.days.four.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>Sat</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${day_partial_cloud}"
                alt="Partial cloudy"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.days.five.maxTemp}&#176;</span>
                <span>${this._data.days.five.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>Sun</span>
            </div>

            <div class="forecast__container-card--main">
              <img src="${rain}" alt="Rain" class="icon-weather" />
              <div class="numbers">
                <span>${this._data.days.six.maxTemp}&#176;</span>
                <span>${this._data.days.six.minTemp}&#176;</span>
              </div>
            </div>
          </figure>
    `;
  }
}
export default new CardsView();
