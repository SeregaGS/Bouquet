import CartDeferredTotalAmountView from '../views/cart-deffered-total-amount-view';
import { render, replace, remove } from '../framework/render';

export default class CartTotalAmountPresenter {
  #container = null;
  #cartModel = null;

  #productComponent = null;

  constructor(container, cartModel) {
    this.#container = container;
    this.#cartModel = cartModel;
  }

  init() {
    const total = this.#cartModel.get();
    const prevFlowerCardComponent = this.#productComponent;

    this.#productComponent = new CartDeferredTotalAmountView(total);

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
