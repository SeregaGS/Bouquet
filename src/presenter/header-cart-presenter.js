import HeaderCartView from '../views/header-cart-view';
import { render, replace, remove } from '../framework/render';

export default class HeaderCartPresenter {
  #container = null;
  #headerCartComponents = null;
  #cartModel = null

  #isLoading = true;

  constructor(container, cartModel) {
    this.#container = container;
    this.#cartModel = cartModel;
    this.#cartModel.addObserver(this.#loadData);
  }

  init = () => {
    const prevHeaderCartComponents = this.#headerCartComponents;
    const cartModels = this.#cartModel.get();
    this.#headerCartComponents = new HeaderCartView(cartModels);

    if(prevHeaderCartComponents === null) {
      return render(this.#headerCartComponents, this.#container)
    }
    replace(this.#headerCartComponents, prevHeaderCartComponents);
    remove(prevHeaderCartComponents);
  }

  #loadData = () => {
    this.#isLoading = false;
    this.init();
  }
}
