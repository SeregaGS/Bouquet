import AdvantagesView from '../views/advantages-view';
import MissionView from '../views/mission-view';
import FilterReasonView from '../views/filter-reason-view';
import FilterColorContainer from '../views/filter-color-container-view';
import LoadingView from '../views/loading-view';
import LoadingErrorView from '../views/error-loading-view';

import CataloguePresenter from "../presenter/catalog-presenter";
import {render, remove} from '../framework/render';

export default class MainPresenter {
  #loadingComponent = new LoadingView();
  #loadingErrorComponent = new LoadingErrorView();

  #advantagesView = null;
  #missionView = null;
  #filterReasonView = null;
  #filterColorContainer = null;

  #cataloguePresenter = null;
  #isLoading= true;

  #container = null;
  #products = null;

  constructor(container, products) {
    this.#container = container;
    this.#products = products;

    this.#products.addObserver(this.#onData);
  }
  init = () => {
    this.#renderCatalog();
  }
  #renderFilterColorContainerComponent() {
    this.#filterColorContainer = new FilterColorContainer();
    render(this.#filterColorContainer, this.#container);
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

  #onData = () => {
    this.#isLoading = false;
    this.#renderCatalog();
  }
  #renderCatalog = () => {
    if(this.#isLoading) {
      return render(this.#loadingComponent, this.#container);
    }
    remove(this.#loadingComponent)

    if (this.#products.get().length === 0) {
      return render(this.#loadingErrorComponent, this.#container);
    }
    remove(this.#loadingErrorComponent);

    // this.#renderMissionComponent();
    // this.#renderAdvantagesComponent();
    this.#renderFilterReasonComponent();
    this.#renderFilterColorContainerComponent()

    this.#cataloguePresenter = new CataloguePresenter(this.#container, this.#products);
    this.#cataloguePresenter.init()
  }
}
