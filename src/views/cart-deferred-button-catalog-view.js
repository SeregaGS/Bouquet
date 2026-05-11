import AbstractView from '../framework/view/abstract-view';

const createCartDeferredButtonCatalogTemplate = () =>
  `<a class="btn btn--with-icon popup-deferred__btn btn--light" href="#">в каталог
    <svg width="61" height="24" aria-hidden="true">
      <use xlink:href="#icon-arrow"></use>
    </svg>
   </a>`

export default class CartDeferredButtonCatalogView extends AbstractView {
  get template() {
    return createCartDeferredButtonCatalogTemplate();
  }
  setCloseCartPopup = (callback) => {
    this._callback.closedCartFull = callback;
    this.element.addEventListener('click', this.#setCloseCartPopup);
  }
  #setCloseCartPopup = (evt) => {
    evt.preventDefault();
    this._callback.closedCartFull();
  }
}
