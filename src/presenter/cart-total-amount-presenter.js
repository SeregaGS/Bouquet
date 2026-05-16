import CartDeferredTotalAmountView from '../views/cart-deffered-total-amount-view';
import { render, replace, remove } from '../framework/render';

export default class CartTotalAmountPresenter {
  #container = null;
  #cartModel = null;

  #totalAmountComponent = null;

  constructor(container, cartModel) {
    this.#container = container;
    this.#cartModel = cartModel;
  }

  init() {
    const total = this.#cartModel.get();
    const prevTotalAmountComponent = this.#totalAmountComponent;

    this.#totalAmountComponent = new CartDeferredTotalAmountView(total);

    if(prevTotalAmountComponent === null) {
      render(this.#totalAmountComponent, this.#container);
      return;
    }

    replace(this.#totalAmountComponent, prevTotalAmountComponent);
    remove(prevTotalAmountComponent);
  }

  destroy() {
    remove(this.#totalAmountComponent);
    this.#totalAmountComponent = null;
  }

}
