//---------- Main View file with helper functions ----------//

import { mark } from 'regenerator-runtime';
import { sleep } from '../helpers';

export default class View {
  _data;

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
    if (el === 'p') element = 'other__container-card';
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

  renderError(message = this._errorMessage) {}
}
