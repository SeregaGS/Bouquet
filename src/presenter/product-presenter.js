import ProductItemView from '../views/catalog-product-item-view';
import { render, replace, remove } from '../framework/render';

export default class ProductPresenter {
  #container = null;
  #product = null;

  #productComponent = null;
  #handleDataChange = null;

  constructor(container, handleDataChange) {
    this.#container = container;
    this.#handleDataChange = handleDataChange;
  }

  init(flower) {
    this.#product = flower;
    const prevFlowerCardComponent = this.#productComponent;

    this.#productComponent = new ProductItemView(this.#product);
    this.#productComponent.setOpenPopupHandler(this.#handleOpenPopup);
    this.#productComponent.setAddToCart(this.#clickAddToCartHandler);

    if(prevFlowerCardComponent === null) {
      render(this.#productComponent, this.#container.element);
      return;
    }

    replace(this.#productComponent, prevFlowerCardComponent);
    remove(prevFlowerCardComponent);
  }
  destroy() {
    remove(this.#productComponent);
  }
  #handleOpenPopup = () => {
    this.#handleDataChange(this.#product.id);
  }
  #clickAddToCartHandler = () => {
    console.log('Заглушка');
  }
}
