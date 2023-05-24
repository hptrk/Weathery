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

  // ---------- HANDLER ---------- //

  addHandlerRender(handler) {
    // Open info box (click)
    this._infoButton.addEventListener('click', handler);

    // Close box on searchbar focus
    this._inputField.addEventListener('focus', () => {
      this._hideInfoBox();
    });

    // Add shiny hover effect
    this._addHoverEffect();
  }

  // ---------- MAIN FUNCTION ---------- //

  async renderInfoBox() {
    // If it is shown, hide it
    if (this._checkIfClicked()) return;

    // Display favorite cities
    this._displayInfo();

    // Handle element's style and animations
    this._handleStyleAnimatons();

    this._hideListOnClick(); // hide info box when clicking on the list
    this._addGithubLogoListener(); // open Weathery github page on click
  }

  // ---------- HELPER FUNCTIONS ---------- //

  _checkIfClicked() {
    if (this._isClicked) {
      this._hideInfoBox();
      return true;
    }
    this._isClicked = true;
    return false;
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

  _displayInfo() {
    const markup = `
    <div class="weathery-logo"></div>
    <div class="navigation__info-text">
    I am proud to have worked on this project independently. It was a transformative journey filled with valuable learning experiences and new discoveries. Through this project, I honed my skills and expanded my knowledge in various aspects of development. With its completion, I am excited to showcase this application as a vibrant addition to my portfolio, reflecting my growth, commitment, and passion for creating impactful software solutions.
    </div>
        <div class="navigation__info-copyright">&copy; 2023 Weathery ${githubLogo}</div>

    `;
    this._parentElement.insertAdjacentHTML('beforeend', markup);
  }

  async _handleStyleAnimatons() {
    this._parentElement.style.height = `${
      window.innerWidth > 1100 ? 47 : 53
    }rem`;
    this._parentElement.style.boxShadow = '0 2.1rem 2rem rgba(0, 0, 0, 0.3)'; // animating the boxshadow
    this._triangle.style.left = '65%';
    await sleep(0); // bugfix for switching the gaphider's left position when clicking the list
    this._triangle.style.borderBottom = '1.6rem solid var(--color-grey-dark-2)';
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
