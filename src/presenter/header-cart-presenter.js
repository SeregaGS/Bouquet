import HeaderCartView from '../views/header-cart-view';
import { render, replace, remove } from '../framework/render';

export default class HeaderCartPresenter {
  #container = null;
  #headerCartComponents = null;

  constructor(container) {
    this.#container = container;
  }

  init() {
    const prevHeaderCartComponents = this.#headerCartComponents;

    this.#headerCartComponents = new HeaderCartView();

    if(prevHeaderCartComponents === null) {
      return render(this.#headerCartComponents, this.#container)
    }
    replace(this.#headerCartComponents, prevHeaderCartComponents);
    remove(prevHeaderCartComponents);
  }
}
