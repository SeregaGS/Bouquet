import AbstractView from '../framework/view/abstract-view';

const createCartButtonClearTemplate = () =>
  `<div class="popup-deferred__btn-container">
    <button class="btn btn--with-icon popup-deferred__btn-clean" type="button">очистить
      <svg width="61" height="24" aria-hidden="true">
        <use xlink:href="#icon-arrow"></use>
      </svg>
    </button>
  </div>
  `
export default class CartButtonClearView extends AbstractView {
  get template() {
    return createCartButtonClearTemplate();
  }

  setClearCart(callback) {
    this._callback.buttonClear = callback;
    this.element.addEventListener('click', this.#setClearCart);
  }

  #setClearCart = (evt) => {
    evt.preventDefault();
    this._callback.buttonClear(evt.target);
  }
}
