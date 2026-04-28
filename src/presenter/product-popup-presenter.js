import ProductItemPopupView from '../views/catalog-product-item-popup-view';
import { ImageSlider } from "../utils/image-slider";
import { render, replace, remove } from '../framework/render';

export default class ProductPopupPresenter {
  #container = null;
  #product = null;

  #popupComponent = null;

  #closePopup = null;

  constructor(container, closePopup) {
    this.#container = container;
    this.#closePopup = closePopup;
  }

  init = (flower) => {
    this.#product = flower;
    this.#container.scrollTop = 0;

    const prevFlowerCardComponent = this.#popupComponent;

    this.#popupComponent = new ProductItemPopupView(this.#product);

    this.#popupComponent.setCloseClickHandler(this.#closePopup);
    this.#popupComponent.setAddToCartButtonClickHandler(this.#addToCart);

    if (prevFlowerCardComponent === null) {
      render(this.#popupComponent, this.#container);
      this.#initSlider();
      return;
    }
    replace(this.#popupComponent, prevFlowerCardComponent);
    remove(prevFlowerCardComponent);
  }
  #initSlider = () => {
    const imageSlider = new ImageSlider(".image-slider");
    imageSlider.init();
  }
  #addToCart = () => {
    console.log('заглушка')
  }
  destroy() {
    if(this.#popupComponent === null) {
      return;
    }
    remove(this.#popupComponent);
    this.#popupComponent = null;
  }
}
