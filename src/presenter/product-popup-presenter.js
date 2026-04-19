import ProductItemPopupView from '../views/catalog-product-item-popup-view';
import { render, replace, remove } from '../framework/render';

export default class ProductPopupPresenter {
  #container = null;
  #product = null;

  #popupComponent = null;

  #closeBtnClickHandler = null;

  constructor(container, closeBtnClickHandler) {
    this.#container = container;
    this.#closeBtnClickHandler = closeBtnClickHandler;
  }

  init = (flower) => {
    this.#product = flower;

    const prevFlowerCardComponent = this.#popupComponent;

    this.#popupComponent = new ProductItemPopupView(this.#product);
    this.#popupComponent.setCloseButtonClickHandler(this.#handleClose);

    document.addEventListener('keydown', this.#onEscKeyDown);
    document.addEventListener('click', this.#onOverlayClick);

    if (prevFlowerCardComponent === null) {
      render(this.#popupComponent, this.#container);
    } else {
      replace(this.#popupComponent, prevFlowerCardComponent);
      remove(prevFlowerCardComponent);
    }

  }

  destroy() {
    if(this.#popupComponent === null) {
      return;
    }
    remove(this.#popupComponent);
    this.#popupComponent = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
    document.removeEventListener('click', this.#onOverlayClick);
  }
  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleClose();
    }
  };
  #onOverlayClick = (evt) => {
    if (evt.target.closest('.modal__overlay')) {
      this.#handleClose()
    }
  }
  #handleClose = () => {
    this.#closeBtnClickHandler();
  }
}
