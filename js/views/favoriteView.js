//---------- This view is responsible for rendering the "favorite cities" (top left menu icon) ----------//

import View from './View.js';
import { liked, pin, pinned } from '../../icons/likeSVG.js';
import { sleep } from '../helpers.js';

class FavoriteView extends View {
  _parentElement = document.querySelector('.navigation__favorites');
  _favoriteData;
  _menuButton = document.querySelectorAll('.navigation__icon-box')[0]; // [0]-menu, [1]-info
  _infoButton = document.querySelectorAll('.navigation__icon-box')[1];
  _checkbox = document.querySelector('.navigation__icon-checkbox');
  _inputField = document.querySelector('.navigation__searchbar-input');
  _triangle = document.querySelector('.gaphider');
  _iconsBox = document.querySelectorAll('.navigation__favorites-box--icons');
  _inputField = document.querySelector('.navigation__searchbar-input');
  _isClicked = false;
  _event;
  _errorMessage = `You've reached the maximum number of pinned cities. Please unpin a city before adding a new one.`;

  // ---------- HANDLERS ---------- //

  addHandlerRender(handler) {
    // Open favorite list on click
    this._menuButton.addEventListener('click', handler);

    // Close list on searchbar focus
    this._inputField.addEventListener('focus', () => {
      this._hideFavoriteList();
    });

    // Add shiny hover effect
    this._addHoverEffect();
  }

  addHandlerLike(handler) {
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      // if the like button was clicked, call the handler
      this._event.target.classList.contains('results-save') && handler();
    });
  }

  addHandlerLoad(handler) {
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      // if the clicked element is not the heart or pin icon, call the handler
      !this._event.target.classList.contains('pin') &&
        !this._event.target.classList.contains('pinned') &&
        !this._event.target.classList.contains('results-save') &&
        this._event.target.closest('.navigation__favorites-box') &&
        handler(false) &&
        this._hideFavoriteList();
    });
  }

  addHandlerPin(handler) {
    // Clicking on pin icon
    this._parentElement.addEventListener('click', e => {
      if (
        e.target.classList.contains('pin') ||
        e.target.classList.contains('pinned')
      ) {
        this._event = e;
        handler(); // manage pinned cities in the model
      }
    });
  }

  // ---------- MAIN FUNCTIONS ---------- //

  async generateFavorites(data) {
    this._favoriteData = data;
    // If it is shown, hide it
    if (this._checkIfClicked()) return;

    // Check if there are favorited cities
    if (this._checkIfEmpty()) return;

    // Display favorite cities
    this._displayFavorites();

    // Handle element's style and animations
    this._handleStyleAnimatons();
  }

  togglePinIcon() {
    // Replace pin icon (not possible with css, have to replace the whole svg element)
    this._replacePinIcon(
      this._event.target.classList.contains('pin') ? pinned : pin
    );
  }

  async refreshOnClick() {
    // Remove clicked from layout
    this._removeClicked();

    // Animation on click
    this._animationOnClick();
  }

  // ---------- HELPER FUNCTIONS ---------- //

  _checkIfClicked() {
    // if it is already on screen, hide it
    if (this._isClicked) {
      this._hideFavoriteList();
      return true;
    }
    this._isClicked = true;
    return false;
  }

  async _hideFavoriteList() {
    if (this._isClicked) {
      this._triangle.style.borderBottom = '0 solid var(--color-grey-dark-2)';
      this._removeBoxes();
      await sleep(0.4); // wait for animation
      this._checkbox.checked = false;
      this._removeInnerHTML();

      this._isClicked = false;
    }
  }

  _checkIfEmpty() {
    if (!this._favoriteData.length) {
      this._messageWhenEmpty();
      return true;
    }
    return false;
  }

  _messageWhenEmpty() {
    // Define height, gap hider, text
    this._fillElement();

    // Clicking the search button
    this._handleSearchClick();
  }

  _fillElement() {
    this._triangle.style.borderBottom = '1.6rem solid var(--color-grey-dark-2)'; // gap hider
    const markup =
      '<span class="emptyText">Currently, there are no saved cities. Please initiate a search to save one.<span class="emptySearch">Search &rarr;</span></span>';

    this._parentElement.insertAdjacentHTML('beforeend', markup);
    this._parentElement.style.height = 12 + 'rem'; // 2 box height
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow
  }

  _handleSearchClick() {
    document.querySelector('.emptySearch').addEventListener('click', () => {
      // hide element
      this._triangle.style.borderBottom = '0 solid var(--color-grey-dark-2)';
      this._removeBoxes();
      this._removeInnerHTML();
      // input focus
      this._inputField.focus();
    });
  }

  _displayFavorites() {
    // This forEach runs the result() function 'favoriteData.length' times
    Array.from({ length: this._favoriteData.length }).forEach((_, i) => {
      this._parentElement.innerHTML += this._favCityMarkup(i);
    });
  }

  _favCityMarkup(i) {
    return `
    <div class="navigation__favorites-box">
              <div class="navigation__favorites-box--location">
                <span class="navigation__favorites-box--city">${
                  this._favoriteData[i].city
                }</span>
                <span class="navigation__favorites-box--country">${
                  this._favoriteData[i].country
                }</span>
              </div>
              <div class="navigation__favorites-box--icons">
                ${this._favoriteData[i].isPinned ? pinned : pin}
                ${liked}
              </div>
      </div>`;
  }

  async _handleStyleAnimatons() {
    // add HEIGHT for animation
    this._parentElement.style.height =
      this._favoriteData.length * (window.innerWidth > 1100 ? 6 : 9) + 'rem';
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the box shadow
    this._parentElement.style.overflowY = `${
      this._favoriteData.length > 9 ? 'scroll' : 'hidden'
    }`;

    this._triangle.style.left = '5%';
    await sleep(0); // bugfix for switching the gaphider's left position when clicking the info box
    this._triangle.style.borderBottom = '1.6rem solid var(--color-grey-dark-2)';

    this._likeAnimation(); // when removing from list

    this._hideOnInfoClick(); // hide list when clicking on the info button
  }

  _replacePinIcon(icon) {
    this._event.target
      .closest('.navigation__favorites-box--icons :first-child')
      .insertAdjacentHTML('beforebegin', icon);
    this._event.target
      .closest('.navigation__favorites-box--icons :nth-child(2)')
      .remove();
  }

  async _removeClicked() {
    // Clicked city
    const clickedElement = this._event.target.closest(
      '.navigation__favorites-box'
    );

    clickedElement.classList.add('fade-out');
    await sleep(0.3); // wait for animation
    clickedElement.remove(); // remove from layout
  }

  _animationOnClick() {
    this._parentElement.style.height = `${
      this._parentElement.clientHeight -
      6 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    }px`;
    if (this._parentElement.clientHeight <= 62) this._messageWhenEmpty(); // when empty, display empty message
  }

  _likeAnimation() {
    document
      .querySelectorAll('.navigation__favorites-box--icons svg:last-child')
      .forEach(heart =>
        heart.addEventListener('click', () => {
          heart.classList.toggle('like-clicked'); // basically removes this class (animation)
        })
      );
  }

  _hideOnInfoClick() {
    this._infoButton.addEventListener('click', () => {
      this._hideFavoriteList();
    });
  }
}
export default new FavoriteView();
