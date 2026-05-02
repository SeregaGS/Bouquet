import AdvantagesView from '../views/advantages-view';
import MissionView from '../views/mission-view';
import LoadingView from '../views/loading-view';
import LoadingErrorView from '../views/error-loading-view';
import FilterReasonPresenter from '../presenter/filter-reason-presenter'
import FilterColorPresenter from '../presenter/filter-color-presenter'
import CataloguePresenter from "../presenter/catalog-presenter";
import ProductPopupPresenter from './product-popup-presenter';
import HeaderCartPresenter from "./header-cart-presenter";
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
  #cartPresenter = null;

  #isLoading= true;
  #selectedProduct = null;

  #container = null;
  #cartContainer = null;

  #productsModel = null;
  #filterModel = null;
  #cartModel = null

  constructor(container, cartContainer ,productsModel, filterModel, cartModel) {
    this.#container = container;
    this.#cartContainer = cartContainer;
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;

    this.#productsModel.addObserver(this.#onData);
  }
  init = () => {
    this.#renderAdvantagesMission();
    this.#renderCart();
  }
  #renderCart = () => {
    if(this.#cartPresenter === null) {
      this.#cartPresenter = new HeaderCartPresenter(this.#cartContainer, this.#cartModel);
      this.#cartPresenter.init();
      return;
    }
    remove(this.#cartPresenter);
    this.#cartPresenter = null;
  }

  #onData = () => {
    this.#isLoading = false;
    this.#renderCatalog();
  }
  #renderAdvantagesMission = () => {
    render(this.#missionView, this.#container);
    render(this.#advantagesView, this.#container);
  }
  #renderFilters = () => {
    if(!this.#filterReasonPresenter && !this.#filterColorPresenter) {
      this.#filterReasonPresenter = new FilterReasonPresenter(this.#container, this.#filterModel);
      this.#filterColorPresenter = new FilterColorPresenter(this.#container, this.#filterModel);
    }
    this.#filterReasonPresenter.init();
    this.#filterColorPresenter.init();
  }
  #renderCatalog = () => {
    if(this.#isLoading) {
      render(this.#loadingComponent, this.#container);
      return;
    }

    remove(this.#loadingComponent);

    if(!this.#cataloguePresenter) {
      this.#cataloguePresenter = new CataloguePresenter(
        this.#container,
        this.#productsModel,
        this.#filterModel,
        this.#cartModel,
        this.#clickOpenPopup);
    }
    this.#renderFilters();
    this.#cataloguePresenter.init();
  }

  #renderPopup = (id) => {
    const contentContainer = document.querySelector('.modal-product');
    if(this.#productPopupPresenter) {
      this.#removeProductPopup();
    }
    this.#productPopupPresenter = new ProductPopupPresenter(contentContainer, this.#removeProductPopup, this.#cartModel)
    this.#productPopupPresenter.init(id);
    modals.open('popup-data-attr');
  }
  #removeProductPopup = () => {
    if (!this.#productPopupPresenter) {
      return;
    }
    this.#productPopupPresenter.destroy();
    this.#selectedProduct = null;
    modals.close('popup-data-attr');
  }
  #clickOpenPopup = async (id) => {
    this.#selectedProduct = await this.#productsModel.loadProductDetails(id);
    this.#renderPopup(this.#selectedProduct);
  }
}
