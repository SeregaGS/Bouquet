import CartHeaderView from '../views/cart-header-view';
import { render, replace, remove } from '../framework/render';

export default class CartHeaderPresenter {
  #container = null;
  #headerCartComponents = null;
  #cartModel = null

  #isLoading = true;
  #cartClick = null;

  constructor(container, cartModel, cartClick) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#cartClick = cartClick;

    this.#cartModel.addObserver(this.#loadData);
  }

  init = () => {
    const prevHeaderCartComponents = this.#headerCartComponents;
    const cartModels = this.#cartModel.get();

    this.#headerCartComponents = new CartHeaderView(cartModels);
    this.#headerCartComponents.setPopupCartHandler(this.#cartClick);

    if(prevHeaderCartComponents === null) {
      render(this.#headerCartComponents, this.#container);
      return;
    }
    replace(this.#headerCartComponents, prevHeaderCartComponents);
    remove(prevHeaderCartComponents);
  }

  #loadData = () => {
    this.#isLoading = false;
    this.init();
  }
}
