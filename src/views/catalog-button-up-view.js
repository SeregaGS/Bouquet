import AbstractView from '../framework/view/abstract-view';

const createCatalogButtonUpTemplate = () =>
  `
    <button class="btn-round btn-round--to-top btn-round--size-small catalogue__to-top-btn" type="button" aria-label="наверх">
      <svg width="80" height="85" aria-hidden="true" focusable="false">
        <use xlink:href="#icon-round-button"></use>
      </svg>
    </button>
  `
export default class CatalogButtonUpView extends AbstractView {
  get template() {
    return createCatalogButtonUpTemplate();
  }

  buttonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }
  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonClick();
  }
}
