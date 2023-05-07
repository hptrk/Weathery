//---------- This view is responsible for changing the theme ----------//

import View from './View.js';
import { darkModeColors, lightModeColors } from '../helpers.js';
class ThemeView extends View {
  _themeSwitcher = document.querySelector('.settingsbox__switcher-checkbox');

  addHandlerChangeTheme(handler) {
    this._themeSwitcher.addEventListener('change', handler);
  }

  changeTheme() {
    this._themeSwitcher.checked && this._setColors(lightModeColors);
    !this._themeSwitcher.checked && this._setColors(darkModeColors);
  }
  // sets the CSS root variables
  _setColors(mode) {
    this._setStyle('--color-grey-light', mode);
    this._setStyle('--color-grey-light-shade', mode);
    this._setStyle('--color-grey-light-2', mode);
    this._setStyle('--color-grey-light-3', mode);
    this._setStyle('--color-blueish-grey', mode);
    this._setStyle('--color-blueish-black', mode);

    this._setStyle('--color-background-dark', mode);
    this._setStyle('--color-background-light', mode);

    this._setStyle('--color-container-background', mode);

    this._setStyle('--color-grey-dark', mode);
    this._setStyle('--color-grey-dark-2', mode);
    this._setStyle('--color-grey-dark-3', mode);
    this._setStyle('--color-grey-dark-4', mode);
    this._setStyle('--color-grey-lines', mode);

    this._setStyle('--color-lightblue-main', mode);
    this._setStyle('--color-lightblue-main-shade', mode);
    this._setStyle('--color-lightblue-main-shade-2', mode);
  }

  // helper for setting the style
  _setStyle(property, mode) {
    const root = document.documentElement;
    root.style.setProperty(property, `${mode[property]}`);
  }
  isLightMode() {
    if (this._themeSwitcher.checked) return true;
    return false;
  }
}
export default new ThemeView();
