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

  renderError(message = this._errorMessage) {}
}
