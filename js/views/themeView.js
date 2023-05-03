//---------- This view is responsible for changing the theme ----------//

import View from './View.js';
class ThemeView extends View {
  _themeSwitcher = document.querySelector('.settingsbox__switcher-checkbox');

  addHandlerChangeTheme(handler) {
    this._themeSwitcher.addEventListener('change', handler);
  }

  changeTheme() {
    const root = document.documentElement;
    if (this._themeSwitcher.checked) {
      root.style.setProperty('--color-grey-light', 'red'); // TEST ONLY
    }
  }
}
export default new ThemeView();
