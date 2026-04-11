import AdvantagesView from '../views/advantages-view';
import {render, remove} from '../framework/render';

export default class MainPresenter {
  #advantagesView = null;

  #container = null;

  constructor(container) {
    this.#container = container;
  }
  init = () => {
    this.#renderAdvantagesComponent();
  }

  #renderAdvantagesComponent() {
    this.#advantagesView = new AdvantagesView();
    render(this.#advantagesView, this.#container);
  }
}
