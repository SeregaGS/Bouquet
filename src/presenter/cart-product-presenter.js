import CartDeferredProductItemView from '../views/cart-deferred-item-view';
import { render, replace, remove } from '../framework/render';

export default class CartProductPresenter {
  #container = null;
  #cartModel = null;

  #decrement = null
  #increment = null;
  #delete = null;

  #productComponent = null;

  constructor(container, cartModel, decrement, increment, del) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#decrement = decrement;
    this.#increment = increment;
    this.#delete = del;
  }

  init(flower) {
    const obj = this.#cartModel.get().products;
    const result = obj[flower.id] || 0;

    const prevFlowerCardComponent = this.#productComponent;
    this.#productComponent = new CartDeferredProductItemView(flower, result);
    this.#productComponent.setDecrementCartProduct(this.#decrement);
    this.#productComponent.setIncrementCartProduct(this.#increment);
    this.#productComponent.setClearCartProduct(this.#delete);

    if(prevFlowerCardComponent === null) {
      render(this.#productComponent, this.#container);
      return;
    }

    replace(this.#productComponent, prevFlowerCardComponent);
    remove(prevFlowerCardComponent);
  }

  destroy() {
    remove(this.#productComponent);
    this.#productComponent = null;
  }

}
