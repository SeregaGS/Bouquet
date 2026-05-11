import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { createImageSliderPopup } from './catalog-product-item-popup-images-view'

const createProductItemPopupTemplate = (flower) => {
  const {title, price, description, isAdding } = flower
  return `<div>
           <div class="image-slider swiper modal-product__slider">
              <div class="image-slides-list swiper-wrapper">
                ${createImageSliderPopup(flower).join('')}
              </div>
              <button class="btn-round btn-round--to-left image-slider__button image-slider__button--prev" type="button">
                  <svg width="80" height="85" aria-hidden="true" focusable="false">
                    <use xlink:href="#icon-round-button"></use>
                  </svg>
                </button>
              <button class="btn-round btn-round--to-right image-slider__button image-slider__button--next" type="button">
                  <svg width="80" height="85" aria-hidden="true" focusable="false">
                    <use xlink:href="#icon-round-button"></use>
                  </svg>
                </button>
           </div>
          <div class="product-description">
            <div class="product-description__header">
              <h3 class="title title--h2">${title}</h3>
              <b class="price price--size-big">${price}<span>Р</span></b>
            </div>
            <p class="text text--size-40">${description}</p>
            <button class="btn btn--outlined btn--full-width product-description__button" type="button" data-focus>
              ${!isAdding ? 'отложить' : 'отложено'}
            </button>
          </div>
        </div>
`
}
export default class ProductItemPopupView extends AbstractStatefulView {
  constructor(flower, isAdding) {
    super();
    this._state = {...flower, isAdding}
  }
  get template() {
    return createProductItemPopupTemplate(this._state);
  }

  setCloseButtonHandler = (callback)=> {
    this._callback.closePopup = callback;
  }
  setAddToCartButtonHandler = (callback)=> {
    this._callback.addToCart = callback;
    this.element
      .querySelector('.product-description__button')
      .addEventListener('click', this.#addToCartButtonHandler);
  }

  #addToCartButtonHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToCart(evt.target);
  }

  _restoreHandlers = () => {
    this.setCloseButtonHandler(this._callback.closePopup);
    this.setAddToCartButtonHandler(this._callback.addToCart);
  }

}
