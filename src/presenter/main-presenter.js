import AdvantagesView from '../views/advantages-view';
import MissionView from '../views/mission-view';
import LoadingView from '../views/loading-view';
import LoadingErrorView from '../views/error-loading-view';
import FilterReasonPresenter from '../presenter/filter-reason-presenter'
import FilterColorPresenter from '../presenter/filter-color-presenter'
import CataloguePresenter from "../presenter/catalog-presenter";
import ProductPopupPresenter from './product-popup-presenter';
import CartHeaderPresenter from "./cart-header-presenter";
import CartFullPresenter from '../presenter/cart-full-presenter';
import HeroView from '../views/hero-view';
import {render, remove} from '../framework/render';
import { modals } from "../modals/init-modals";

export default class MainPresenter {
  #loadingComponent = new LoadingView();
  #loadingErrorComponent = new LoadingErrorView();
  #missionView = new MissionView();
  #advantagesView = new AdvantagesView();
  #heroView = new HeroView();

  #filterReasonPresenter = null;
  #filterColorPresenter = null;
  #cataloguePresenter = null;
  #productPopupPresenter = null;
  #cartPresenter = null;
  #cartFullPresenter = null;

  #isLoading= true;
  #selectedProduct = null;

  #container = null;
  #wrapper = null;
  #cartContainer = null;

  #productsModel = null;
  #filterModel = null;
  #cartModel = null

  constructor(container, cartContainer, wrapper, productsModel, filterModel, cartModel) {
    this.#container = container;
    this.#cartContainer = cartContainer;
    this.#wrapper = wrapper;
    this.#productsModel = productsModel;
    this.#filterModel = filterModel;
    this.#cartModel = cartModel;

    this.#productsModel.addObserver(this.#onData);
  }
  init = () => {
    this.#renderHeroPresenter()
    this.#renderAdvantagesMission();
    this.#renderCart();
    this.#renderCartPopup();
  }
  #renderCartPopup = () => {
    if(this.#cartFullPresenter === null) {
      this.#cartFullPresenter = new CartFullPresenter(this.#container, this.#productsModel, this.#cartModel, this.#handlerCartPopup);
      this.#cartFullPresenter.init();
      return;
    }
    remove(this.#cartFullPresenter);
    this.#cartFullPresenter = null;
  }
  #renderCart = () => {
    if(this.#cartPresenter === null) {
      this.#cartPresenter = new CartHeaderPresenter(this.#cartContainer, this.#cartModel, this.#handlerCartPopup);
      return;
    }
    remove(this.#cartPresenter);
    this.#cartPresenter = null;
  }

  #onData = () => {
    this.#isLoading = false;
    this.#renderCatalog();
  }
  #renderHeroPresenter = () => {
    render(this.#heroView, this.#container);
    this.#heroView.buttonClickHandler(this.#buttonUpClickHandler);
  }
  #buttonUpClickHandler = () => {
    const element = this.#filterReasonPresenter?.getElement();
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  #handlerCartPopup = () => {
    this.#clickCartVisibleHandler();
  }
  #clickCartVisibleHandler = () => {
    const cartPopupContainer = this.#cartFullPresenter.cartContainer.element;

    if(this.#container.style.display === 'none') {
      cartPopupContainer.style.display = 'none';
      this.#container.style.display = 'block';
      return;
    }
    this.#container.style.display = 'none';
    cartPopupContainer.style.display = 'block';
  }
}
