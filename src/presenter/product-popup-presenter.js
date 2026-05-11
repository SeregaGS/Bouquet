import ProductItemPopupView from '../views/catalog-product-item-popup-view';
import { ImageSlider } from "../utils/image-slider";
import { render, replace, remove } from '../framework/render';

export default class ProductPopupPresenter {
  #container = null;
  #product = null;

  #popupComponent = null;

  #closePopup = null;
  #slider = null;
  #cartModel = null;


  constructor(container, closePopup, cartModel) {
    this.#container = container;
    this.#closePopup = closePopup;
    this.#cartModel = cartModel;

    this.#cartModel.addObserver(this.#handleModelChange);
  }

  init = (flower) => {
    this.#product = flower;
    const data = this.#cartModel.get()?.products?.hasOwnProperty(this.#product.id);
    this.#container.scrollTop = 0;

    const prevFlowerCardComponent = this.#popupComponent;

    this.#popupComponent = new ProductItemPopupView(this.#product, data);

    this.#popupComponent.setCloseButtonHandler(this.#closePopup);
    this.#popupComponent.setAddToCartButtonHandler(this.#addToCart);

    if (prevFlowerCardComponent === null) {
      render(this.#popupComponent, this.#container);
      this.#initSlider();
      return;
    }

    replace(this.#popupComponent, prevFlowerCardComponent);
    remove(prevFlowerCardComponent);
    this.#initSlider();
  }
  #initSlider = () => {
    this.#slider = new ImageSlider(".image-slider");
    this.#slider.init();
  }

  #addToCart = (button) => {
    const cartData = this.#cartModel.get();

    if(cartData.products.hasOwnProperty(this.#product.id)) {
      button.disabled = true;
      button.textContent = 'возвращаем...';
      this.#cartModel.clear(this.#product);
    } else {
      button.disabled = true;
      button.textContent = 'откладываем...';
      this.#cartModel.add(this.#product);
    }
  }
  #handleModelChange = () => {
    this.init(this.#product);
  }
  destroy() {
    this.#cartModel.removeObserver(this.#handleModelChange);

    if(this.#popupComponent === null) {
      return;
    }

    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#slider = null;
    this.#product = null;
  }
}
