import AdvantagesView from '../views/advantages-view';
import MissionView from '../views/mission-view';
import LoadingView from '../views/loading-view';
import LoadingErrorView from '../views/error-loading-view';
import FilterReasonPresenter from '../presenter/filter-reason-presenter'
import FilterColorPresenter from '../presenter/filter-color-presenter'
import CataloguePresenter from "../presenter/catalog-presenter";
import {render, remove} from '../framework/render';

export default class MainPresenter {
  #loadingComponent = new LoadingView();
  #loadingErrorComponent = new LoadingErrorView();

  #advantagesView = null;
  #missionView = null;
  #filterReasonPresenter = null;
  #filterColorPresenter = null;

  #cataloguePresenter = null;
  #isLoading= true;

  #container = null;
  #products = null;
  #filterType = null;

  constructor(container, products, filterReason) {
    this.#container = container;
    this.#products = products;
    this.#filterType = filterReason;

    this.#products.addObserver(this.#onData);
  }
  init = () => {
    this.#renderCatalog();
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
    remove(this.#loadingComponent);

    if (this.#products.get().length === 0) {
      return render(this.#loadingErrorComponent, this.#container);
    }
    remove(this.#loadingErrorComponent);
    // this.#renderMissionComponent();
    // this.#renderAdvantagesComponent();
    this.#filterReasonPresenter = new FilterReasonPresenter(this.#container, this.#filterType);
    this.#filterReasonPresenter.init();
    this.#filterColorPresenter = new FilterColorPresenter(this.#container, this.#filterType);
    this.#filterColorPresenter.init();
    this.#cataloguePresenter = new CataloguePresenter(this.#container, this.#products, this.#filterType);
    this.#cataloguePresenter.init();

  }
}
