import HeroView from '../views/hero-view';
import { render, replace, remove } from '../framework/render';

export default class HeroPresenter {
  #container = null;
  #heroComponents = null;

  constructor(container) {
    this.#container = container;
  }

  init() {
    const prevHeroComponents = this.#heroComponents;

    this.#heroComponents = new HeroView();

    if(prevHeroComponents === null) {
      return render(this.#heroComponents, this.#container)
    }
    replace(this.#heroComponents, prevHeroComponents);
    remove(prevHeroComponents);
  }
}
