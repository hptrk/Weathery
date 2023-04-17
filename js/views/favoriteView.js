//---------- This view is responsible for rendering the "favorite cities" (top left menu icon) ----------//

import View from './View.js';
import { like, liked, pin, pinned } from '../../icons/likeSVG.js';
import { sleep } from '../helpers.js';

class FavoriteView extends View {
  _parentElement = document.querySelector('.navigation__favorites');
  _menuButton = document.querySelectorAll('.navigation__icon-box')[0]; // [0]-menu, [1]-info
  _isClicked = false;

  addHandlerRender(handler) {
    this._menuButton.addEventListener('click', handler);
  }

  async generateFavorites(data) {
    // if it is already on screen, remove it
    if (this._isClicked) {
      this._removeBoxes();
      await sleep(0.4); // wait for animation
      this._removeInnerHTML();

      this._isClicked = false;
      return;
    }

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

    // add HEIGHT for animation
    this._parentElement.style.height = favoritesNumber * 6 + 'rem'; //*6 because 1 box is 6rem
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow

    this._isClicked = true;
  }
}
export default new FavoriteView();
