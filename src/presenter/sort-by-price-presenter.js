import SortByPriceView from '../views/sort-by-price-view'
import { render, replace, remove } from '../framework/render';

export default class SortByPricePresenter {
  #container = null;
  #sortByPriceComponents = null;

  constructor(container) {
    this.#container = container;
  }

  init() {
    this.#sortByPriceComponents = new SortByPriceView();
    render(this.#sortByPriceComponents, this.#container);
  }
}
