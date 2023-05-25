//---------- This view is responsible for rendering the data when clicking on another city ----------//

import View from './View.js';
import { sleep } from '../helpers.js';

class CityView extends View {
  _parentElement = document.querySelector('.navigation__searchbar-results');
  _checkbox = document.querySelector('.forecast__header-switcher--checkbox');
  _inputField = document.querySelector('.navigation__searchbar-input');
  _buttons = document.querySelectorAll('.forecast__header-menu--item');
  _todayButton = this._buttons[0];
  _tomorrowButton = this._buttons[1];
  _nextDaysButton = this._buttons[2];
  _pressedEnter = false;
  _errorMessage = `Please allow access to your location for seamless user experience!`;
  _event;

  // ---------- HANDLERS ---------- //

  addHandlerRender(render) {
    // Clicking on a city
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      // clicking on like button will not render/reset
      if (this._event.target.classList.contains('results-save')) return;
      render() && this._resetDefaultStates();
    });

    // Pressing enter
    this._inputField.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        this._pressedEnter = true;
        render() && this._resetDefaultStates();
        this._pressedEnter = false; // reset to default
      }
    });
  }

  addHandlerLike(handler) {
    // Clicking like button
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      // if the like button was clicked, call the handler
      this._event.target.classList.contains('results-save') && handler();
    });
  }

  // ---------- HELPER FUNCTION ---------- //

  async _resetDefaultStates() {
    // hide results on click (except clicking on save)
    (this._pressedEnter ||
      !this._event.target.classList.contains('results-save')) &&
      this._removeBoxes();

    // reset the switcher back to the forecast state
    this._checkbox.checked = false;

    // clear the input field
    this._inputField.value = '';

    // remove focus from input field
    await sleep(0); // async run, otherwise the blur will remove focus before loading, gives undefined index
    document.activeElement.blur();
  }
}
export default new CityView();
