import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createCartDeferredProductItemTemplate = (flower) => {
  const { id, previewImage, title, description, price, cart } = flower;
  return `
    <li class="popup-deferred__item" id="${id}">
      <div class="deferred-card">
        <div class="deferred-card__img">
          <picture>
            <img src="${previewImage}" width="233" height="393" alt="букет">
          </picture>
        </div>
        <div class="deferred-card__content">
          <h2 class="title title--h2">${title}</h2>
          <p class="text text--size-40">${description}</p>
        </div>
        <div class="deferred-card__count">
          <button class="btn-calculate" data-button="minus" type="button">
            <svg width="30" height="27" style="pointer-events: none" aria-hidden="true">
              <use xlink:href="#icon-minus"></use>
            </svg>
          </button>
          <span>${cart}</span>
          <button class="btn-calculate" data-button="cross" type="button">
            <svg width="30" height="28" style="pointer-events: none" aria-hidden="true">
              <use xlink:href="#icon-cross"></use>
            </svg>
          </button>
        </div>
        <div class="deferred-card__price"><b class="price price--size-middle-p">${price}<span>Р</span></b></div>
        <button class="btn-close deferred-card__close-btn" type="button">
          <svg width="55" height="56" style="pointer-events: none" aria-hidden="true">
            <use xlink:href="#icon-close-big"></use>
          </svg>
        </button>
        <svg class="deferred-card__close-btn deferred-card__loader" width="56" height="56" aria-hidden="true">
          <use xlink:href="#icon-loader"></use>
        </svg>
      </div>
    </li>
  `
}
export default class CartDeferredProductItemView extends AbstractStatefulView {
  constructor(flower, cart) {
    super();
    this._state = {...flower, cart};
  }
  get template() {
    return createCartDeferredProductItemTemplate(this._state);
  }

  setDecrementCartProduct = (callback) => {
    this._callback.decrementCartProduct = callback;
    this.element.querySelector('[data-button="minus"]').addEventListener('click', this.#setDecrementCartProduct);
  }
  setIncrementCartProduct = (callback) => {
    this._callback.incrementCartProduct = callback;
    this.element.querySelector('[data-button="cross"]').addEventListener('click', this.#setIncrementCartProduct);
  }
  setClearCartProduct = (callback) => {
    this._callback.clearCartProduct = callback;
    this.element.querySelector('.deferred-card__close-btn').addEventListener('click', this.#setClearCartProduct);
  }

  #setDecrementCartProduct = (evt) => {
    evt.preventDefault();
    this._callback.decrementCartProduct(this._state);
  }
  #setIncrementCartProduct = (evt) => {
    evt.preventDefault();
    this._callback.incrementCartProduct(this._state);
  }
  #setClearCartProduct = (evt) => {
    evt.preventDefault();
    this._callback.clearCartProduct(this._state);
  }

  _restoreHandlers() {
    this.setDecrementCartProduct(this._callback.decrementCartProduct);
    this.setIncrementCartProduct(this._callback.incrementCartProduct);
    this.setClearCartProduct(this._callback.clearCartProduct);
  }
}
