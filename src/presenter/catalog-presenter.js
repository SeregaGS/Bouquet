import CatalogContainerView from '../views/catalog-container-view';
import CatalogContainerWrapView from '../views/catalog-container-wrap-view';
import CatalogueHeaderContainerView from '../views/catalog-container-header-view';
import CatalogButtonWrapView from "../views/catalog-button-wrap-view";
import CatalogButtonMoreView from '../views/catalog-button-more-view';
import CatalogButtonUpView from '../views/catalog-button-up-view';
import CatalogProductListView from '../views/catalog-product-list-view';
import SortByPriceView from '../views/sort-by-price-view';
import CatalogNoItemView from '../views/catalog-no-items-view';
import ProductPresenter from './product-presenter';
import { render, replace, remove } from '../framework/render';
import { SortType, COUNT_FLOWERS } from "../const";
import { filterReason, filterColors } from '../utils/filter-reason';

export default class CataloguePresenter {
  #catalogContainer = new CatalogContainerView();
  #catalogWrapContainer = new CatalogContainerWrapView();
  #catalogHeaderContainer = new CatalogueHeaderContainerView();
  #catalogProductListContainer = new CatalogProductListView();
  #catalogNoItems = new CatalogNoItemView();
  #catalogButtonContainer = new CatalogButtonWrapView();
  #catalogButtonMore = new CatalogButtonMoreView();
  #catalogButtonUpView = new CatalogButtonUpView();

  #sortByPrice = null;
  #currentSortByPrice;
  #productPresenter = new Map();

  #container = null;
  #products = null;

  #renderFlowersCount = COUNT_FLOWERS;
  #filterModel = null;
  #selectPopup = null

  constructor(container, products, filterModel, selectPopup) {
    this.#container = container;
    this.#products = products;
    this.#filterModel = filterModel;
    this.#selectPopup = selectPopup;

    this.#filterModel.addObserver(this.#onFilterModelChange);
  }

  init() {
    this.#renderCatalogContainer(this.#container);
    this.#renderCatalog();
  }

  get flowers () {
    let flowers = [...this.#products.get()];

    const currentFilterReason = this.#filterModel.get();
    const currentFilterColor = this.#filterModel.getColors();

    if (filterReason[currentFilterReason]) {
      flowers = filterReason[currentFilterReason](flowers)
    }

    flowers = filterColors(flowers, currentFilterColor);

    switch (this.#currentSortByPrice) {
      case SortType.INCREMENT:
        flowers.sort((a, b) => a.price - b.price);
        break;
      case SortType.DECREMENT:
        flowers.sort((a, b) => b.price - a.price);
        break;
    }

    return flowers;
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
    const allFlowers = this.flowers;
    const totalFlowers = allFlowers.length;

    const flowersToRender = allFlowers.slice(0, Math.min(totalFlowers, COUNT_FLOWERS));

    this.#renderSort(this.#catalogHeaderContainer.element);

    if(totalFlowers === 0) {
      render (this.#catalogNoItems, this.#catalogWrapContainer.element);
      return;
    }
    this.#renderCatalogList(flowersToRender, totalFlowers);
  }
  #renderCatalogList = (flowers, total) => {
    this.#renderFlowers(flowers, this.#catalogProductListContainer);

    if (total > COUNT_FLOWERS) {
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
    const productPresenter = new ProductPresenter(container, this.#selectPopup);

    productPresenter.init(flower);

    this.#productPresenter.set(flower.id, productPresenter);
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

    this.#clearFlowersList();
    this.#renderCatalog();
  }
  #renderSort = (container)=> {
    const prevFilterComponent = this.#sortByPrice;

    this.#sortByPrice = new SortByPriceView(this.#currentSortByPrice);
    this.#sortByPrice.buttonClickHandler(this.#sortTypeChange);

    if(prevFilterComponent === null) {
      render(this.#sortByPrice, container);
      return;
    }
      replace(this.#sortByPrice, prevFilterComponent);
      remove(prevFilterComponent);
  }
  // Clear and remove
  #clearFlowersList = () => {
    this.#productPresenter.forEach((presenter) => presenter.destroy());
    this.#productPresenter.clear();
    this.#renderFlowersCount = COUNT_FLOWERS;
    remove(this.#catalogButtonMore);
    remove(this.#catalogButtonUpView);
    remove(this.#catalogNoItems);
  }
  // Handler, Click and Change
  #buttonMoreClickHandler = () => {
    const allFlowers = this.flowers;
    const totalFlowers = allFlowers.length;

    const newCountFlowers = Math.min(totalFlowers, this.#renderFlowersCount + COUNT_FLOWERS);

    const flowers = allFlowers.slice(this.#renderFlowersCount, newCountFlowers);

    this.#renderFlowers(flowers, this.#catalogProductListContainer);
    this.#renderFlowersCount += COUNT_FLOWERS;

    if(this.#renderFlowersCount >= totalFlowers) {
      remove(this.#catalogButtonMore);
    }
  }
  #buttonUpClickHandler = () => {
    this.#catalogHeaderContainer.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  #onFilterModelChange = () => {
    this.#clearFlowersList();
    this.#renderCatalog();
  }
}
