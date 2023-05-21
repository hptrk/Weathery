//---------- This view is responsible for displaying the "info" section ----------//

import View from './View.js';
import { sleep } from '../helpers.js';
import { githubLogo } from '../../icons/githubLogo.js';
class InfoView extends View {
  _parentElement = document.querySelector('.navigation__info');
  _infoButton = document.querySelectorAll('.navigation__icon-box')[1]; // [0]-menu, [1]-info
  _menuButton = document.querySelectorAll('.navigation__icon-box')[0];
  _inputField = document.querySelector('.navigation__searchbar-input');
  _isClicked = false;
  _triangle = document.querySelector('.gaphider');

  addHandlerRender(handler) {
    this._infoButton.addEventListener('click', handler); // open info box
    this._inputField.addEventListener('focus', () => {
      // close box on searchbar focus
      this._hideInfoBox();
    });

    // Add shiny hover effect
    this._addHoverEffect();
  }

  async renderInfoBox() {
    // if it is already on screen, remove it
    if (this._isClicked) {
      this._hideInfoBox();
      return;
    }
    this._isClicked = true;

    const markup = `
    <div class="weathery-logo"></div>
    <div class="navigation__info-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo laborum.
    </div>
        <div class="navigation__info-copyright">&copy; 2023 Weathery ${githubLogo}</div>

    `;
    this._parentElement.insertAdjacentHTML('beforeend', markup);
    // add HEIGHT for animation
    this._parentElement.style.height = `${
      window.innerWidth > 1100 ? 30 : 36
    }rem`;
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow
    this._triangle.style.left = '65%';
    await sleep(0); // bugfix for switching the gaphider's left position when clicking the list
    this._triangle.style.borderBottom = '1.6rem solid var(--color-grey-dark-2)';

    this._hideListOnClick(); // hide info box when clicking on the list
    this._addGithubLogoListener(); // open Weathery github page on click
  }

  async _hideInfoBox() {
    if (this._isClicked) {
      this._triangle.style.borderBottom = '0 solid var(--color-grey-dark-2)';
      this._removeBoxes();
      await sleep(0.4); // wait for animation
      this._removeInnerHTML();

      this._isClicked = false;
    }
  }
  _hideListOnClick() {
    this._menuButton.addEventListener('click', async () => {
      this._hideInfoBox();
    });
  }

  _addGithubLogoListener() {
    this._parentElement.addEventListener('click', e => {
      e.target.classList.contains('github-logo') &&
        window.open('https://github.com/hptrk/Weathery', '_blank');
    });
  }
}
export default new InfoView();
