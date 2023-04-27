//---------- This view is responsible for rendering 'Pinned cities' section ----------//

import View from './View.js';
import { getSVGLink } from '../helpers.js';

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
  }
}
export default new PinnedView();
