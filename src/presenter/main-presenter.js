import AdvantagesView from '../views/advantages-view';
import MissionView from '../views/mission-view';
import FilterReasonView from '../views/filter-reason-view';
import {render, remove} from '../framework/render';

export default class MainPresenter {
  #advantagesView = null;
  #missionView = null;
  #filterReasonView = null;

  #container = null;

  constructor(container) {
    this.#container = container;
  }
  init = () => {
    this.#renderMissionComponent();
    this.#renderAdvantagesComponent();
    this.#renderFilterReasonComponent();
  }

  #renderFilterReasonComponent() {
    this.#filterReasonView = new FilterReasonView();
    render(this.#filterReasonView, this.#container);
  }

  #renderMissionComponent() {
    this.#missionView = new MissionView();
    render(this.#missionView, this.#container);
  }

  #renderAdvantagesComponent() {
    this.#advantagesView = new AdvantagesView();
    render(this.#advantagesView, this.#container);
  }
}
