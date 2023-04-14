//---------- This view is responsible for rendering the search results ----------//

import View from './View.js';
import { like, liked } from '../../icons/likeSVG.js';
import { city } from '../../icons/city.js';

class SearchView extends View {
  _parentElement = document.querySelector('.navigation__searchbar-results');
  _searchBar = document.querySelector('.navigation__searchbar');
  _inputField = document.querySelector('.navigation__searchbar-input');

  addHandlerRender(render) {
    this._inputField.addEventListener('input', () => {
      this._inputField.value.length >= 3 && render(); // if the input field has at least 3 characters
      this._inputField.value.length < 3 && this._removeBoxes();
    });
  }

  addBasicConfig() {
    this._searchBar.addEventListener('submit', e => {
      e.preventDefault(); // prevent default submitting
    });
    // when something in the form element is clicked, focus the input
    this._searchBar.addEventListener('click', () => this._inputField.focus());

    // shiny hover effect
    this._parentElement.addEventListener('mousemove', e => {
      const { x, y } = this._parentElement.getBoundingClientRect();
      this._parentElement.style.setProperty('--x', e.clientX - x);
      this._parentElement.style.setProperty('--y', e.clientY - y);
    });

    // hide search results on focus loss
    this._inputField.addEventListener('blur', () => {
      this._removeBoxes();
    });
  }

  getValue() {
    return this._inputField.value;
  }

  _preventFocusLoss(results) {
    if (results) {
      // if there are results
      document
        .querySelectorAll('.navigation__searchbar-results--box')
        .forEach(btn =>
          btn.addEventListener('mousedown', e => {
            e.preventDefault(); // prevent losing focus on clicking the like button
          })
        );
    }
  }

  generateResults(data) {
    this._removeBoxes(); // remove previous data
    const resultsNumber = data.length; // this is how many results should be displayed
    const borderHider = '<div class="border-hider"></div>'; // with a height of 5rem (hides the bottom borders)

    const result = i => `
<div class="navigation__searchbar-results--box">
  ${city}

  <span class="results-city">${data[i].city}</span>
  <span class="results-country">${data[i].country}</span>

  ${like}
</div>
`;

    this._parentElement.innerHTML += borderHider; // add the bottom border filler

    // this forEach runs the result() function 'resultsNumber' times
    Array.from({ length: resultsNumber }).forEach((_, i) => {
      this._parentElement.innerHTML += result(i);
    });
    // add HEIGHT for animation
    this._parentElement.style.height = resultsNumber * 5 + 5 + 'rem'; // *5 because 1 box is 5rem, +5 because of border hider
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow

    this._preventFocusLoss(resultsNumber); // prevent losing focus on clicking the like button
  }
}
export default new SearchView();
