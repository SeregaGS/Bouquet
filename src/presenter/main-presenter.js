import AdvantagesView from '../views/advantages-view';
import MissionView from '../views/mission-view';
import LoadingView from '../views/loading-view';
import LoadingErrorView from '../views/error-loading-view';
import FilterReasonPresenter from '../presenter/filter-reason-presenter'
import FilterColorPresenter from '../presenter/filter-color-presenter'
import CataloguePresenter from "../presenter/catalog-presenter";
import ProductPopupPresenter from './product-popup-presenter';
import {render, remove} from '../framework/render';
import { modals } from "../modals/init-modals";

export default class MainPresenter {
  #loadingComponent = new LoadingView();
  #loadingErrorComponent = new LoadingErrorView();
  #missionView = new MissionView();
  #advantagesView = new AdvantagesView();

  #filterReasonPresenter = null;
  #filterColorPresenter = null;
  #cataloguePresenter = null;
  #productPopupPresenter = null;

  #isLoading= true;
  #selectedProduct = null;

  #container = null;

  #productsModel = null;
  #filterModel = null;

  constructor(container, productsModel, filterModel) {
    this.#container = container;
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;

    this.#productsModel.addObserver(this.#onData);
  }
  init = () => {
    this.#renderAdvantagesMission();
    this.#renderCatalog();
  }

  #onData = () => {
    this.#isLoading = false;
    this.#renderCatalog();
  }
  #renderAdvantagesMission = () => {
    render(this.#missionView, this.#container);
    render(this.#advantagesView, this.#container);
  }
  #renderCatalog = () => {
    if(this.#isLoading) {
      render(this.#loadingComponent, this.#container);
      return;
    }
    remove(this.#loadingComponent);
    if (this.#productsModel.get().length === 0) {
      render(this.#loadingErrorComponent, this.#container);
      return;
    }
    remove(this.#loadingErrorComponent);

    this.#filterReasonPresenter = new FilterReasonPresenter(this.#container, this.#filterModel);
    this.#filterReasonPresenter.init();
    this.#filterColorPresenter = new FilterColorPresenter(this.#container, this.#filterModel);
    this.#filterColorPresenter.init();
    this.#cataloguePresenter = new CataloguePresenter(this.#container, this.#productsModel, this.#filterModel, this.#clickOpenPopup);
    this.#cataloguePresenter.init();
  }

  #renderPopup = (id) => {
    const contentContainer = document.querySelector('.modal-product');
    // const imageSlider = new ImageSlider(".image-slider");

    if(this.#productPopupPresenter) {
      this.#removeProductPopup();
    }
    this.#productPopupPresenter = new ProductPopupPresenter(contentContainer, this.#removeProductPopup)
    this.#productPopupPresenter.init(id);
    modals.open('popup-data-attr');
    // imageSlider.init();
  }
  #removeProductPopup = () => {
    if (!this.#productPopupPresenter) {
      return;
    }
    this.#productPopupPresenter.destroy();
    this.#productPopupPresenter = null;
    this.#selectedProduct = null;
    modals.close('popup-data-attr');
  }
  #clickOpenPopup = async (id) => {
    this.#selectedProduct = await this.#productsModel.loadProductDetails(id);
    this.#renderPopup(this.#selectedProduct);
  }
}
