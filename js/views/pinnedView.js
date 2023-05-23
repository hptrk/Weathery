//---------- This view is responsible for rendering 'Pinned cities' section ----------//

import View from './View.js';
import { getSVGLink, sleep } from '../helpers.js';
import { pin } from '../../icons/likeSVG.js';

class PinnedView extends View {
  _parentElement = document.querySelector('.pinned__container');
  _event;
  _pinnedData;

  // ---------- HANDLERS ---------- //

  addHandlerRender(handler) {
    // Clicking on 'Pin cities' (when empty)
    this._parentElement.addEventListener('click', e => {
      e.target.closest('.pinBox') && handler();
    });
  }

  addHandlerLoad(handler) {
    // Clicking on a pinned city
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      e.target.closest('.pinned__container-card') &&
        !e.target.closest('.pinBox') &&
        handler(false, true);
    });
  }

  // ---------- MAIN FUNCTION ---------- //

  async generatePinnedCities(data) {
    this._pinnedData = data;

    // Put element to default empty state for clear transition
    await this._putToDefaultState();

    // Add the pinned city to the DOM
    this._displayPinnedCity();

    this._cardWhenEmpty(data.length);
  }

  // ---------- HELPER FUNCTIONS ---------- //

  async _putToDefaultState() {
    this._parentElement.style.opacity = '0';
    await sleep(0.1); // wait for animation
    this._parentElement.innerHTML = '';
  }

  _displayPinnedCity() {
    Array.from({ length: this._pinnedData.length }).forEach((_, i) => {
      this._parentElement.insertAdjacentHTML(
        'beforeend',
        this._pinnedCardMarkup(i)
      );
      this._parentElement.style.opacity = '1';
    });
  }

  _pinnedCardMarkup(i) {
    return `
      <figure class="pinned__container-card">
          <div class="pinned__container-card--texts">
             <span>${this._pinnedData[i].country}</span>
             <span>${this._pinnedData[i].city}</span>
             <span>${this._pinnedData[i].description}</span>
           </div>
  
          <div class="pinned__container-card--weather">
            <span class="numbers">${
              this._pinnedData[i].temperature
            }&#176;</span>
            <img src="${getSVGLink(
              this._pinnedData[i].icon
            )}" class="icon-weather" />
          </div>
      </figure>
      `;
  }

  _cardWhenEmpty(length) {
    // if there is space for pinned city
    if (length < 3) {
      // always 3 cards are shown
      Array.from({ length: 3 - length }).forEach(_ => {
        this._parentElement.insertAdjacentHTML(
          'beforeend',
          `
          <figure class="pinned__container-card pinBox"> 
          <span class="emptyText pinEmpty">${pin}<span class="emptySearch pinHere">Pin cities &rarr;</span></span>
      </figure>
        `
        );
        this._parentElement.style.opacity = '1';
      });
    }
  }
}
export default new PinnedView();
