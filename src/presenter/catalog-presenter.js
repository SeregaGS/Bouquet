import CatalogContainerView from '../views/catalog-container-view';
import CatalogContainerWrapView from '../views/catalog-container-wrap-view';
import CatalogueHeaderContainerView from '../views/catalog-container-header-view';
import CatalogButtonWrapView from "../views/catalog-button-wrap-view";
import CatalogButtonMoreView from '../views/catalog-button-more-view';
import CatalogButtonUpView from '../views/catalog-button-up-view';
import CatalogProductListView from '../views/catalog-product-list-view';
import SortByPriceView from '../views/sort-by-price-view';
import ProductPresenter from './product-presenter';
import ProductPopupPresenter from './product-popup-presenter';
import { render, replace, remove } from '../framework/render';
import { SortType, COUNT_FLOWERS } from "../const";
import { ImageSlider } from "../utils/image-slider";
import { modals } from "../modals/init-modals";

export default class CataloguePresenter {
  #catalogContainer = new CatalogContainerView();
  #catalogWrapContainer = new CatalogContainerWrapView();
  #catalogHeaderContainer = new CatalogueHeaderContainerView();
  #catalogButtonContainer = new CatalogButtonWrapView();
  #catalogButtonMore = new CatalogButtonMoreView();
  #catalogButtonUpView = new CatalogButtonUpView();
  #catalogProductListContainer = new CatalogProductListView();

  #sortByPrice = null;
  #currentSortByPrice;
  #productPresenter = new Map();
  #productPopupPresenter = null;

  #container = null;
  #products = null;
  #selectedProduct = null;

  #renderFlowersCount = COUNT_FLOWERS;

  constructor(container, products) {
    this.#container = container;
    this.#products = products;
  }

  init() {
    this.#renderCatalog();
  }

  get flowers () {
    const flowers = [...this.#products.get()];

    switch (this.#currentSortByPrice) {
      case SortType.INCREMENT:
        return flowers.sort((a, b) => a.price - b.price);
      case SortType.DECREMENT:
        return flowers.sort((a, b) => b.price - a.price);
      default:
        return flowers;
    }
  }
  // Render containers
  #renderCatalogContainer(container) {
    render(this.#catalogContainer, container);
    render(this.#catalogWrapContainer, this.#catalogContainer.element);
    render(this.#catalogHeaderContainer, this.#catalogWrapContainer.element);
    render(this.#catalogProductListContainer, this.#catalogWrapContainer.element);
    render(this.#catalogButtonContainer, this.#catalogWrapContainer.element);
  }
  // Render Catalog
  #renderCatalog() {
    const flowers = this.flowers.slice(0, Math.min(this.#products.get().length, COUNT_FLOWERS));

    this.#renderCatalogContainer(this.#container)
    this.#renderSort(this.#catalogHeaderContainer.element);
    this.#renderCatalogList(flowers);
  }
  #renderCatalogList = (flowers) => {
    this.#renderFlowers(flowers, this.#catalogProductListContainer);

    if (this.flowers.length > COUNT_FLOWERS) {
      this.#renderButtonMore();
      this.#renderButtonUp();
    }
  }
  #renderFlowers = (flowers, container) => {
    flowers.forEach((flower) => {
      this.#renderFlower(flower, container);
    })
  }
  #renderFlower = (flower, container) => {
    const productPresenter = new ProductPresenter(container, this.#handleProductClick);
    productPresenter.init(flower);
    this.#productPresenter.set(flower.id, productPresenter);
  }
  #renderPopup = (id) => {
    const contentContainer = document.querySelector('.modal-product');
    const imageSlider = new ImageSlider(".image-slider");

    if(this.#productPopupPresenter) {
      this.#removeProductPopup();
    }
    this.#productPopupPresenter = new ProductPopupPresenter(contentContainer, this.#removeProductPopup)
    this.#productPopupPresenter.init(id);
    modals.open('popup-data-attr');
    imageSlider.init();
  }
  // Buttons
  #renderButtonMore() {
    render(this.#catalogButtonMore, this.#catalogButtonContainer.element);
    this.#catalogButtonMore.buttonClickHandler(() => this.#buttonMoreClickHandler());
  }
  #renderButtonUp() {
    render(this.#catalogButtonUpView, this.#catalogButtonContainer.element);
    this.#catalogButtonUpView.buttonClickHandler(() => this.#buttonUpClickHandler());
  }
  // Sort of price
  #sortTypeChange = (sortType) => {
    if (this.#currentSortByPrice === sortType) {
      return;
    }
    this.#currentSortByPrice = sortType;
    const flowers = this.flowers.slice(0, Math.min(this.flowers.length, COUNT_FLOWERS));
    this.#clearFlowersList();
    this.#renderSort(this.#catalogHeaderContainer.element);
    this.#renderCatalogList(flowers);
  }
  #renderSort = (container)=> {
    if (!this.#sortByPrice) {
      this.#sortByPrice = new SortByPriceView(this.#currentSortByPrice);
      render(this.#sortByPrice, container);
    } else {
      const updateSortByPrice = new SortByPriceView(this.#currentSortByPrice);
      replace(updateSortByPrice, this.#sortByPrice)
      this.#sortByPrice = updateSortByPrice;
    }
    this.#sortByPrice.buttonClickHandler(this.#sortTypeChange);
  }
  // Clear and remove
  #clearFlowersList = () => {
    this.#productPresenter.forEach((presenter) => presenter.destroy());
    this.#productPresenter.clear();
    this.#renderFlowersCount = COUNT_FLOWERS;
    remove(this.#catalogButtonMore);
    remove(this.#catalogButtonUpView);
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
  // Handler, Click and Change
  #buttonMoreClickHandler = () => {
    const flowersCount = this.flowers.length;
    const newCountFlowers = Math.min(flowersCount, this.#renderFlowersCount + COUNT_FLOWERS);
    const flowers = this.flowers.slice(this.#renderFlowersCount, newCountFlowers);

    this.#renderFlowers(flowers, this.#catalogProductListContainer);

    this.#renderFlowersCount += COUNT_FLOWERS;

    if(this.#renderFlowersCount >= flowersCount) {
      remove(this.#catalogButtonMore);
    }
  }
  #buttonUpClickHandler = () => {
    this.#catalogHeaderContainer.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  #handleProductClick = async (id) => {
    this.#selectedProduct = await this.#products.loadProductDetails(id);
    this.#renderPopup(this.#selectedProduct);
  }

}
