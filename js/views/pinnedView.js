//---------- This view is responsible for rendering 'Pinned cities' section ----------//

import View from './View.js';
import { getSVGLink } from '../helpers.js';
import { pin } from '../../icons/likeSVG.js';

class PinnedView extends View {
  _parentElement = document.querySelector('.other__container');
  _event;

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', e => {
      e.target.classList.contains('pinHere') && handler();
    });
  }

  addHandlerLoad(handler) {
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      e.target.closest('.other__container-card') && handler(false, true);
    });
  }

  _cardWhenEmpty(length) {
    // if there is space for pinned city
    if (length < 3) {
      // always 3 cards are shown
      Array.from({ length: 3 - length }).forEach(_ =>
        this._parentElement.insertAdjacentHTML(
          'beforeend',
          `
          <figure class="other__container-card"> 
          <span class="emptyText pinEmpty">${pin}<span class="emptySearch pinHere">Pin cities &rarr;</span></span>
      </figure>
        `
        )
      );
    }
  }

  generatePinnedCities(data) {
    const card = i => {
      return `
    <figure class="other__container-card">
        <div class="other__container-card--texts">
           <span>${data[i].country}</span>
           <span>${data[i].city}</span>
           <span>${data[i].description}</span>
         </div>

        <div class="other__container-card--weather">
          <span class="numbers">${data[i].temperature}&#176;</span>
          <img src="${getSVGLink(data[i].icon)}" class="icon-weather" />
        </div>
    </figure>
    `;
    };
    Array.from({ length: data.length }).forEach((_, i) =>
      this._parentElement.insertAdjacentHTML('beforeend', card(i))
    ); // add the pinned city to the DOM

    this._cardWhenEmpty(data.length);
  }
}
export default new PinnedView();
