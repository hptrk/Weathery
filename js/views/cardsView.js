import View from './View.js';

//------ ICON IMPORTS ------//
import day_clear from '../../icons/day_clear.svg';
import night_clear from '../../icons/night_clear.svg';
import day_partial_cloud from '../../icons/day_partial_cloud.svg';
import night_partial_cloud from '../../icons/night_partial_cloud.svg';
import overcast from '../../icons/overcast.svg';
import fog from '../../icons/fog.svg';
import angry_clouds from '../../icons/angry_clouds.svg';
import day_rain from '../../icons/day_rain.svg';
import night_rain from '../../icons/night_rain.svg';
import day_sleet from '../../icons/day_sleet.svg';
import night_sleet from '../../icons/night_sleet.svg';
import rain from '../../icons/rain.svg';
import rain_thunder from '../../icons/rain_thunder.svg';
import sleet from '../../icons/sleet.svg';
import day_snow from '../../icons/day_snow.svg';
import night_snow from '../../icons/night_snow.svg';
import snow from '../../icons/snow.svg';
import thunder from '../../icons/thunder.svg';

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

            <div class="forecast__container-card--header">
              <span>${this._data.dayNames.one.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${day_partial_cloud}"
                alt="Partial cloudy"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.weather.days.one.maxTemp}&#176;</span>
                <span>${this._data.weather.days.one.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>${this._data.dayNames.two.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              <img src="${day_rain}" alt="Rainy" class="icon-weather" />
              <div class="numbers">
                <span>${this._data.weather.days.two.maxTemp}&#176;</span>
                <span>${this._data.weather.days.two.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>${this._data.dayNames.three.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${rain_thunder}"
                alt="Thunder"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.weather.days.three.maxTemp}&#176;</span>
                <span>${this._data.weather.days.three.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>${this._data.dayNames.four.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${rain_thunder}"
                alt="Thunder"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.weather.days.four.maxTemp}&#176;</span>
                <span>${this._data.weather.days.four.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>${this._data.dayNames.five.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              <img
                src="${day_partial_cloud}"
                alt="Partial cloudy"
                class="icon-weather"
              />
              <div class="numbers">
                <span>${this._data.weather.days.five.maxTemp}&#176;</span>
                <span>${this._data.weather.days.five.minTemp}&#176;</span>
              </div>
            </div>
          </figure>

          <figure class="forecast__container-card">

            <div class="forecast__container-card--header">
              <span>${this._data.dayNames.six.slice(0, 3)}</span>
            </div>

            <div class="forecast__container-card--main">
              <img src="${rain}" alt="Rain" class="icon-weather" />
              <div class="numbers">
                <span>${this._data.weather.days.six.maxTemp}&#176;</span>
                <span>${this._data.weather.days.six.minTemp}&#176;</span>
              </div>
            </div>
          </figure>
    `;
  }
}
export default new CardsView();
