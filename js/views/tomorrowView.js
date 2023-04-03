import { mark } from 'regenerator-runtime';
import View from './View.js';
import { runEverySec, getSVGLink, hoursString } from '../helpers.js';

class TomorrowView extends View {
  _parentElement = document.querySelector('.forecast__container');
  _tomorrowButton = document.querySelectorAll(
    '.forecast__header-menu--item'
  )[1];

  addHandlerRender(handler) {
    this._tomorrowButton.addEventListener('click', handler);
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
    const cardNumber = this._data.weather.days.one.icons.length;
    // this function will create 1 card (should run at least 6 times)
    const card = i => {
      const date = new Date();
      date.setTime(date.getTime() + (i + 1) * 60 * 60 * 1000); // set the hour mark of the card

      return `<figure class="forecast__container-card">

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
export default new TomorrowView();