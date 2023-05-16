//---------- Main View file with helper functions ----------//

import { mark } from 'regenerator-runtime';
import { sleep } from '../helpers';

export default class View {
  _data;
  _errorBox = document.querySelector('.error-message');
  _buttons = document.querySelectorAll('.forecast__header-menu--item');
  _todayButton = this._buttons[0];
  _tomorrowButton = this._buttons[1];
  _nextDaysButton = this._buttons[2];

  //if render is false, create markup string instead of rendering to the DOM
  render(data, render = true) {
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderCards(data) {
    this._data = data;
    this._generateCards();
  }

  _removeBoxes() {
    this._parentElement.style.height = 0;
    this._parentElement.style.boxShadow = 'none'; // animating the boxshadow
  }
  _removeInnerHTML() {
    this._parentElement.innerHTML = '';
  }

  // This function is used when clicking on a city in:
  // -search list, pinned cities, favorite cities
  indexOfClicked(el) {
    // el:
    // s -> search
    // p -> pin
    // f -> favorite
    let element;
    if (el === 's') element = 'navigation__searchbar-results--box';
    if (el === 'p') element = 'pinned__container-card';
    if (el === 'f') element = 'navigation__favorites-box';

    // if enter was pressed, return the first city immediately // (only when clicking search results)
    if (this._pressedEnter) return 0;

    const childs = Array.from(this._parentElement.childNodes).filter(
      node =>
        node.nodeType === 1 && // TYPE 1: Element node
        node.classList.contains(element)
    ); // only children with this exact class

    const clickedChild = this._event.target.closest(`.${element}`);
    const clickedIndex = childs.indexOf(clickedChild);

    return clickedIndex; // this function returns a number - index of clicked child
  }

  resetToNext7Days() {
    // reset the active button back to "next 7 days"
    this._nextDaysButton.classList.add('forecast__active-item');
    this._tomorrowButton.classList.remove('forecast__active-item');
    this._todayButton.classList.remove('forecast__active-item');
  }

  renderError(message = this._errorMessage) {
    this._errorBox.style.display = 'block';
    this._errorBox.style.opacity = '1';
    this._errorBox.innerHTML = `${message}`;
  }
}
