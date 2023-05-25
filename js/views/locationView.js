//---------- This view is responsible for rendering the current location to the navigation ----------//

import { mark } from 'regenerator-runtime';
import View from './View.js';
class LocationView extends View {
  _parentElement = document.querySelector('.navigation__location');

  // ---------- HELPER FUNCTION ---------- //

  _generateMarkup() {
    return `
   <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="navigation__location-icon">
  <path
    fill-rule="evenodd"
    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
    clip-rule="evenodd"
  />
</svg>
  <path
    fill-rule="evenodd"
    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
    clip-rule="evenodd"
  />
</svg>

<span class="navigation__location-text">
<strong class="navigation__location-text--city">
${this._data.city ? this._data.city : 'Search for a city!'}
  </strong>
  ${this._data.city ? ',' : ''}
  ${this._data.country ? this._data.country : ''}
  </span>
  `;
  }
  // If the user declined browser's location prompt, display "Search for a city!"
}
export default new LocationView();
