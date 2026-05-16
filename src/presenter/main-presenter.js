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

  }
  init = async () => {
    try {
      render(this.#loadingComponent, this.#container);

      await Promise.all([
        this.#cartModel.init(),
        this.#productsModel.init()
      ])
      this.#isLoading = false;

      remove(this.#loadingErrorComponent);

      this.#renderIsLoading();
    } catch (error) {
      this.#renderCathError();
    }
  }

  #renderHeroView = () => {
    render(this.#heroView, this.#container);
    this.#heroView.buttonClickHandler(this.#setButtonUpHandler);
  }
  #renderAdvantagesMission = () => {
    render(this.#missionView, this.#container);
    render(this.#advantagesView, this.#container);
  }

  #renderCart = () => {
    if(this.#cartPresenter === null) {
      this.#cartPresenter = new CartHeaderPresenter(this.#cartContainer, this.#cartModel, this.#setCartVisibleHandler);
      this.#cartPresenter.init();
      return;
    }
    remove(this.#cartPresenter);
    this.#cartPresenter = null;
  }

  #renderCartPopup = () => {
    if(this.#cartFullPresenter === null) {
      this.#cartFullPresenter = new CartFullPresenter(this.#container, this.#productsModel, this.#cartModel, this.#setCartVisibleHandler);
      this.#cartFullPresenter.init();
      return;
    }
    remove(this.#cartFullPresenter);
    this.#cartFullPresenter = null;
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
    if(!this.#cataloguePresenter) {
      this.#cataloguePresenter = new CataloguePresenter(
        this.#container,
        this.#productsModel,
        this.#filterModel,
        this.#cartModel,
        this.#setOpenPopup);
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

  #onData = () => {
    this.#renderCatalog();
  }

  #renderIsLoading = () => {
    remove(this.#loadingComponent);
    this.#renderHeroView();
    this.#renderAdvantagesMission();
    this.#renderCartPopup();
    this.#renderCart();
    this.#renderCatalog();
    this.#productsModel.addObserver(this.#onData);
  }
  #renderCathError = () => {
    this.#productsModel.removeObserver(this.#onData);
    render(this.#loadingErrorComponent, this.#container);
    this.#loadingErrorComponent.setReloadPage(this.#reloadPage);
  }

  #setOpenPopup = async (id) => {
    this.#selectedProduct = await this.#productsModel.loadProductDetails(id);
    this.#renderPopup(this.#selectedProduct);
  }
  #setCartVisibleHandler = () => {
    const cartPopupContainer = this.#cartFullPresenter.cartContainer.element;
    if(this.#container.style.display === 'none') {
      cartPopupContainer.style.display = 'none';
      this.#container.style.display = 'block';
      return;
    }
    this.#container.style.display = 'none';
    cartPopupContainer.style.display = 'block';
  }
  #setButtonUpHandler = () => {
    const element = this.#filterReasonPresenter?.getElement();
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  #reloadPage = () => {
    window.location.reload()
  }
}
