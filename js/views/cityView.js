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
  _resultBoxes;
  _event;
  _clickedBox;
  _pressedEnter = false;

  addHandlerRender(render) {
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      // clicking on like button will not render/reset
      !this._event.target.classList.contains('results-save') &&
        render() &&
        this._resetDefaultStates();
    });
    this._inputField.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        this._pressedEnter = true;
        render() && this._resetDefaultStates();
        this._pressedEnter = false; // reset to default
      }
    });
  }
  addHandlerLike(handler) {
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      // if the like button was clicked, call the handler
      this._event.target.classList.contains('results-save') && handler();
    });
  }

  indexOfClicked() {
    // if enter was pressed, return the first city immediately
    if (this._pressedEnter) return 0;

    this._resultBoxes = Array.from(this._parentElement.childNodes).filter(
      node =>
        node.nodeType === 1 && // TYPE 1: Element node
        node.classList.contains('navigation__searchbar-results--box')
    ); // only children with this exact class

    this._clickedBox = this._event.target.closest(
      '.navigation__searchbar-results--box'
    );
    const clickedIndex = this._resultBoxes.indexOf(this._clickedBox);

    return clickedIndex; // this function returns a number (0-4) - index of clicked box
  }

  async _resetDefaultStates() {
    // hide results on click (except clicking on save)
    (this._pressedEnter ||
      !this._event.target.classList.contains('results-save')) &&
      this._removeBoxes();

    // reset the switcher back to the forecast state
    this._checkbox.checked = false;

    // reset the active button back to "next 7 days"
    this._nextDaysButton.classList.add('forecast__active-item');
    this._tomorrowButton.classList.remove('forecast__active-item');
    this._todayButton.classList.remove('forecast__active-item');

    // clear the input field
    this._inputField.value = '';

    // remove focus from input field
    await sleep(0); // async run, otherwise the blur will remove focus before loading, gives undefined index
    document.activeElement.blur();
  }
}
export default new CityView();
