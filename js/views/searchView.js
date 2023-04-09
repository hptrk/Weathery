import View from './View.js';
import { like, liked } from '../../icons/likeSVG.js';
import { city } from '../../icons/city.js';

class SearchView extends View {
  _parentElement = document.querySelector('.navigation__searchbar-results');
  _inputField = document.querySelector('.navigation__searchbar-input');

  addHandlerRender(render) {
    this._inputField.addEventListener('input', () => {
      this._inputField.value.length >= 3 && render(); // if the input field has at least 3 characters
    });
  }

  getValue() {
    return this._inputField.value;
  }
  generateResults(data) {
    const boxes = document.querySelectorAll(
      '.navigation__searchbar-results--box'
    );
    boxes.forEach(box => box.remove()); // remove boxes
    // this is how many results should be displayed
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
