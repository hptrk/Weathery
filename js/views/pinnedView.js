//---------- This view is responsible for rendering 'Pinned cities' section ----------//

import View from './View.js';
import { getSVGLink } from '../helpers.js';
import { pin } from '../../icons/likeSVG.js';

class PinnedView extends View {
  _parentElement = document.querySelector('.other__container');

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

    // if there is space for pinned city
    if (data.length < 3) {
      // always 3 cards are shown
      Array.from({ length: 3 - data.length }).forEach(_ =>
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
}
export default new PinnedView();
