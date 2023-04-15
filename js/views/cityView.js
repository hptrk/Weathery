//---------- This view is responsible for rendering the data when clicking on another city ----------//

import View from './View.js';

class CityView extends View {
  _parentElement = document.querySelector('.navigation__searchbar-results');
  _resultBoxes;
  _event;
  _clickedBox;
  addHandlerRender(render) {
    this._parentElement.addEventListener('click', e => {
      this._event = e;
      render();
    });
  }

  indexOfClicked() {
    this._resultBoxes = Array.from(this._parentElement.childNodes).filter(
      node =>
        node.nodeType === 1 && // TYPE 1: Element node
        node.classList.contains('navigation__searchbar-results--box')
    ); // only children with this exact class

    this._clickedBox = this._event.target.closest(
      '.navigation__searchbar-results--box'
    );
    const clickedIndex = this._resultBoxes.indexOf(this._clickedBox);

    !this._event.target.classList.contains('results-save') &&
      this._removeBoxes(); // hide results on click (except clicking on save)

    return clickedIndex; // this function returns a number (0-4) - index of clicked box
  }
}
export default new CityView();
