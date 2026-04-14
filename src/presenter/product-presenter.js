import ProductItemView from '../views/catalog-product-item-view';
import { render, replace, remove } from '../framework/render';

export default class ProductPresenter {
  #container = null;
  #product = null
  #productComponent = null

  constructor(container) {
    this.#container = container;
  }
  init(flower) {
    this.#product = flower;

    const prevFlowerCardComponent = this.#productComponent;

    this.#productComponent = new ProductItemView(this.#product);

    if(prevFlowerCardComponent === null) {
      return render(this.#productComponent, this.#container.element);
    }

    replace(this.#productComponent, prevFlowerCardComponent);

    remove(prevFlowerCardComponent);
  }

}
