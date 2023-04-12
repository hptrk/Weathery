import View from './View.js';
import { like, liked } from '../../icons/likeSVG.js';
import { city } from '../../icons/city.js';

class SearchView extends View {
  _parentElement = document.querySelector('.navigation__searchbar-results');
  _formElement = document.querySelector('.navigation__searchbar');
  _inputField = document.querySelector('.navigation__searchbar-input');
  _searchbar = document.querySelector('.navigation__searchbar');

  addHandlerRender(render) {
    this._inputField.addEventListener('input', () => {
      this._inputField.value.length >= 3 && render(); // if the input field has at least 3 characters
      this._inputField.value.length < 3 && this._removeBoxes();
    });
  }
  addBasicConfig() {
    this._searchbar.addEventListener('submit', e => {
      e.preventDefault(); // prevent default submitting
    });
    // when something in the form element is clicked, focus the input
    this._formElement.addEventListener('click', () => this._inputField.focus());
    // if a letter is pressed on the keyboard, put the focus on the input
    // the user can start searching for a city immediately
    document.addEventListener('keydown', e => {
      if (/^\p{L}$/u.test(e.key)) {
        this._inputField.focus();
        input.value += letter;
      }
    });
  }

  getValue() {
    return this._inputField.value;
  }
  _removeBoxes() {
    const boxes = document.querySelectorAll(
      '.navigation__searchbar-results--box'
    );
    boxes.forEach(box => box.remove()); // remove boxes
    // this is how many results should be displayed
  }
  generateResults(data) {
    this._removeBoxes();
    const resultsNumber = data.length;

    const result = i => `
<div class="navigation__searchbar-results--box">
  ${city}

  <span class="results-city">${data[i].city}</span>
  <span class="results-country">${data[i].country}</span>

  ${like}
</div>
`;

    // this forEach runs the result() function 'resultsNumber' times
    Array.from({ length: resultsNumber }).forEach(
      (_, i) => this._parentElement.insertAdjacentHTML('beforeend', result(i)) // add the card to the DOM
    );
  }
}
export default new SearchView();
