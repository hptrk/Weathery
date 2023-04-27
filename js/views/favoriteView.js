//---------- This view is responsible for rendering the "favorite cities" (top left menu icon) ----------//

import View from './View.js';
import { like, liked, pin, pinned } from '../../icons/likeSVG.js';
import { sleep } from '../helpers.js';
import { mark } from 'regenerator-runtime';

class FavoriteView extends View {
  _parentElement = document.querySelector('.navigation__favorites');
  _menuButton = document.querySelectorAll('.navigation__icon-box')[0]; // [0]-menu, [1]-info
  _inputField = document.querySelector('.navigation__searchbar-input');
  _triangle = document.querySelector('.gaphider');
  _iconsBox = document.querySelectorAll('.navigation__favorites-box--icons');
  _isClicked = false;
  _favBoxes;
  _clickedBox;
  _event;

  addHandlerRender(handler) {
    this._menuButton.addEventListener('click', handler);

    // shiny hover effect
    this._parentElement.addEventListener('mousemove', e => {
      const { x, y } = this._parentElement.getBoundingClientRect();
      this._parentElement.style.setProperty('--x', e.clientX - x);
      this._parentElement.style.setProperty('--y', e.clientY - y);
    });
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
        handler(false);
    });
  }
  addHandlerPin(handler) {
    this._parentElement.addEventListener('click', e => {
      if (
        e.target.classList.contains('pin') ||
        e.target.classList.contains('pinned')
      ) {
        this._event = e;
        handler(); // manage pinned cities in the model
        // toggling between pin & pinned
        this._replacePinIcon(e.target.classList.contains('pin') ? pinned : pin);
      }
    });
  }

  // REPLACE PIN ICON (not possible with css, have to replace the whole element)
  _replacePinIcon(icon) {
    this._event.target
      .closest('.navigation__favorites-box--icons :first-child')
      .insertAdjacentHTML('beforebegin', icon);
    this._event.target
      .closest('.navigation__favorites-box--icons :nth-child(2)')
      .remove();
  }

  _messageWhenEmpty() {
    // TEXT //
    this._triangle.style.borderBottom = '1.6rem solid #1e1e1e'; // gap hider
    const markup =
      '<span class="emptyText">Currently, there are no saved cities. Please initiate a search to save one.<span class="emptySearch">Search &rarr;</span></span>';

    this._parentElement.insertAdjacentHTML('beforeend', markup);
    this._parentElement.style.height = 12 + 'rem'; // 2 box height
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow

    // clicking the search button
    document.querySelector('.emptySearch').addEventListener('click', () => {
      // hide element
      this._triangle.style.borderBottom = '0 solid #1e1e1e';
      this._removeBoxes();
      this._removeInnerHTML();
      // input focus
      this._inputField.focus();
    });
  }

  async generateFavorites(data) {
    // if it is already on screen, remove it
    if (this._isClicked) {
      this._triangle.style.borderBottom = '0 solid #1e1e1e';
      this._removeBoxes();
      await sleep(0.4); // wait for animation
      this._removeInnerHTML();

      this._isClicked = false;
      return;
    }
    this._isClicked = true;

    const favoritesNumber = data.length; // this is how many favorite city should be displayed

    if (!favoritesNumber) {
      this._messageWhenEmpty();
      return;
    }

    const result = i =>
      `
    <div class="navigation__favorites-box">
              <div class="navigation__favorites-box--location">
                <span class="navigation__favorites-box--city">${
                  data[i].city
                }</span>
                <span class="navigation__favorites-box--country">${
                  data[i].country
                }</span>
              </div>
              <div class="navigation__favorites-box--icons">
                ${data[i].isPinned ? pinned : pin}
                ${liked}
              </div>
      </div>`;

    // this forEach runs the result() function 'favoritesNumber' times
    Array.from({ length: favoritesNumber }).forEach((_, i) => {
      this._parentElement.innerHTML += result(i);
    });

    // add HEIGHT for animation
    this._parentElement.style.height = favoritesNumber * 6 + 'rem'; //*6 because 1 box is 6rem
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow
    this._parentElement.style.overflowY = `${
      favoritesNumber > 9 ? 'scroll' : 'hidden'
    }`;

    this._triangle.style.borderBottom = '1.6rem solid #1e1e1e';
    this._likeAnimation(); // when removing from list
  }

  indexOfClicked() {
    this._favBoxes = Array.from(this._parentElement.childNodes).filter(
      node =>
        node.nodeType === 1 && // TYPE 1: Element node
        node.classList.contains('navigation__favorites-box')
    ); // only children with this exact class

    this._clickedBox = this._event.target.closest('.navigation__favorites-box');
    const clickedIndex = this._favBoxes.indexOf(this._clickedBox);
    return clickedIndex;
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

  async refreshOnClick() {
    // clicked city
    const clickedElement = this._event.target.closest(
      '.navigation__favorites-box'
    );

    clickedElement.classList.add('fade-out');
    await sleep(0.3); // wait for animation
    clickedElement.remove(); // remove from layout

    // -- ANIMATION --
    this._parentElement.style.height = `${
      this._parentElement.clientHeight -
      6 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    }px`;
    if (this._parentElement.clientHeight <= 62) this._messageWhenEmpty(); // when empty, display empty message
  }
}
export default new FavoriteView();
