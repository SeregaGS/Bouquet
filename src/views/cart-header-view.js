import AbstractView from '../framework/view/abstract-view';

const createHeaderCartTemplate= ({productCount, sum}) => {

  return `
    <div class="header-count">
      <button class="header-count__btn" type="button">
        <svg width="60" height="47" style="pointer-events: none" aria-hidden="true">
          <use xlink:href="#icon-heart-header"></use>
        </svg>
        <span class="visually-hidden">закрыть</span>
      </button>
      <div class="header-count__count">
        <p class="text text--size-20 header-count__counter">${productCount === undefined ? '0' : productCount}</p>
      </div>
      <div class="header-count__block">
        <p class="text text--size-20 header-count__text">сумма</p>
        <b class="price price--size-min header-count__price">
          ${sum === undefined ? '0' : sum}
        <span>Р</span>
        </b>
      </div>
    </div>
  `
}
export default class CartHeaderView extends AbstractView {
  #cartData = null;

  constructor(cartData) {
    super();
    this.#cartData = cartData;
  }

  get template() {
    return createHeaderCartTemplate(this.#cartData);
  }

  setPopupCartHandler = (callback) => {
    this._callback.popupCart = callback;
    this.element.addEventListener('click', this.#setPopupCartHandler);
  }
  
  #setPopupCartHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    this._callback.popupCart();
  }

}
