import AdvantagesView from '../views/advantages-view';
import MissionView from '../views/mission-view';
import {render, remove} from '../framework/render';

export default class MainPresenter {
  #advantagesView = null;
  #missionView = null;

  #container = null;

  constructor(container) {
    this.#container = container;
  }
  init = () => {
    this.#renderMissionComponent();
    this.#renderAdvantagesComponent();
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
