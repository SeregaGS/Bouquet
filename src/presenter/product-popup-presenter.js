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

  #addToCart = async () => {
    const cartData = this.#cartModel.get();
    const hasProduct = cartData.products.hasOwnProperty(this.#product.id);

    this.#popupComponent.updateElement({
      isDisabled: true,
    });

    try {
      if(hasProduct) {
        await this.#cartModel.clear(this.#product);
      } else {
        await this.#cartModel.add(this.#product);
      }
    } catch {
      this.#popupComponent.updateElement({
        isDisabled: false,
      });
    }
  }
  #handleModelChange = () => {
    this.init(this.#product);
  }
  destroy() {
    this.#cartModel.removeObserver(this.#handleModelChange);
    this.#slider = null;
    this.#product = null;

    if(this.#popupComponent === null) {
      return;
    }

    remove(this.#popupComponent);
    this.#popupComponent = null;
  }
}
