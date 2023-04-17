//---------- This view is responsible for rendering the "favorite cities" (top left menu icon) ----------//

import View from './View.js';
import { like, liked, pin, pinned } from '../../icons/likeSVG.js';

class FavoriteView extends View {
  _parentElement = document.querySelector('.navigation__favorites');
  _menuButton = document.querySelectorAll('.navigation__icon-box')[0]; // [0]-menu, [1]-info

  addHandlerRender(handler) {
    this._menuButton.addEventListener('click', handler);
  }

  generateFavorites(data) {
    const favoritesNumber = data.length; // this is how many favorite city should be displayed

    const result = i =>
      `
    <div class="navigation__favorites-box">
              <div class="navigation__favorites-box--location">
                <span class="navigation__favorites-box--city">${data[i].city}</span>
                <span class="navigation__favorites-box--country">${data[i].country}</span>
              </div>
              <div class="navigation__favorites-box--icons">
                ${pin}
                ${like}
              </div>
      </div>`;

    // this forEach runs the result() function 'favoritesNumber' times
    Array.from({ length: favoritesNumber }).forEach((_, i) => {
      this._parentElement.innerHTML += result(i);
    });
  }
}
export default new FavoriteView();
