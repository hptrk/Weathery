import View from './View.js';
class LocationView extends View {
  _parentElement = document.querySelector('.navigation__location-text');

  _generateMarkup() {
    return `<strong class="navigation__location-text--city">${this._data.city}</strong>,
    ${this._data.country}</span
  >`;
  }
}
export default new LocationView();
