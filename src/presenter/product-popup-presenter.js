import ProductItemPopupView from '../views/catalog-product-item-popup-view';
import { render, replace, remove } from '../framework/render';

export default class ProductPopupPresenter {
  #container = null;
  #product = null;

  #popupComponent = null;

  constructor(container) {
    this.#container = container;
  }

  init = (flower) => {
    this.#product = flower;

    const prevFlowerCardComponent = this.#popupComponent;

    this.#popupComponent = new ProductItemPopupView(this.#product);

    if(prevFlowerCardComponent === null) {
      return render(this.#popupComponent, this.#container);
    }

    replace(this.#popupComponent, prevFlowerCardComponent);
    remove(prevFlowerCardComponent);
  }

  destroy() {
    remove(this.#popupComponent);
  }

}
