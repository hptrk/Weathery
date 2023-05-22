//---------- This view is responsible for rendering the search results ----------//

import View from './View.js';
import { like, liked } from '../../icons/likeSVG.js';
import { city } from '../../icons/city.js';
import { sleep } from '../helpers.js';

class SearchView extends View {
  _parentElement = document.querySelector('.navigation__searchbar-results');
  _searchBar = document.querySelector('.navigation__searchbar');
  _inputField = document.querySelector('.navigation__searchbar-input');
  _results;
  _favorites;
  _borderHider = '<div class="border-hider"></div>'; // with a height of 5rem (hides the bottom borders)
  _errorMessage =
    'Something went wrong while loading your search results. Please refresh the page and try again.';

  addHandlerRender(render) {
    // Write in the input field
    this._inputField.addEventListener('input', async () => {
      this._inputField.value.length >= 3 && render(); // if the input field has at least 3 characters
      if (this._inputField.value.length < 3) {
        this._removeBoxes();
        this._removeInnerHTML();
      }
    });
  }

  addBasicConfig() {
    // Submitting input field
    this._searchBar.addEventListener('submit', e => {
      e.preventDefault(); // prevent default submitting
    });

    // when something in the form element is clicked, focus the input
    this._searchBar.addEventListener('click', () => this._inputField.focus());

    // Add shiny hover effect
    this._addHoverEffect();

    // hide search results on focus loss
    this._inputField.addEventListener('blur', async () => {
      this._removeBoxes();
      await sleep(0.4); // wait for animation
      this._removeInnerHTML();
    });
  }

  _preventFocusLoss(results) {
    // if there are results
    if (results) {
      document
        .querySelectorAll('.navigation__searchbar-results--box')
        .forEach(btn =>
          btn.addEventListener('mousedown', e => {
            e.preventDefault(); // prevent losing focus on clicking
          })
        );
    }
  }

  getValue() {
    return this._inputField.value;
  }

  _likeAnimation() {
    document
      .querySelectorAll('.navigation__searchbar-results--box svg:last-child')
      .forEach(heart =>
        heart.addEventListener('click', () => {
          heart.classList.toggle('like-clicked');
        })
      );
  }

  generateResults(data, favorites) {
    // Remove previous data
    this._removeBoxes();
    this._removeInnerHTML();

    this._results = data;
    this._favorites = favorites;

    this._parentElement.innerHTML += this._borderHider; // add the bottom border filler

    // Display search results markup
    this._displaySearchResults();

    // Handle like animation
    this._likeAnimation();

    // Handle element's style and animation
    this._handleStyleAnimations();

    this._preventFocusLoss(this._results.length); // without this prevention the boxes would be removed too fast
  }

  _searchResultMarkup(i) {
    return `
<div class="navigation__searchbar-results--box">
  ${city}

  <span class="results-city">${this._results[i].city}</span>
  <span class="results-country">${this._results[i].country}</span>

  ${
    // if the city is in the favorites list already, display the filled heart icon
    this._favorites.some(
      obj =>
        obj.lat === this._results[i].lat && obj.lon === this._results[i].lon
    )
      ? liked
      : like
  }
</div>
`;
  }

  _displaySearchResults() {
    // this forEach runs the _searchResultMarkup() function 'results.length' times
    Array.from({ length: this._results.length }).forEach((_, i) => {
      this._parentElement.innerHTML += this._searchResultMarkup(i);
    });
  }

  _handleStyleAnimations() {
    // add HEIGHT for animation
    this._parentElement.style.height = this._results.length * 5 + 5 + 'rem'; // *5 because 1 box is 5rem, +5 because of border hider
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow
  }
}
export default new SearchView();
