import CatalogContainerView from '../views/catalog-container-view';
import CatalogContainerWrapView from '../views/catalog-container-wrap-view';
import CatalogueHeaderContainerView from '../views/catalog-container-header-view';
import CatalogButtonWrapView from "../views/catalog-button-wrap-view";
import CatalogButtonMoreView from '../views/catalog-button-more-view';
import CatalogButtonUpView from '../views/catalog-button-up-view';
import CatalogProductListView from '../views/catalog-product-list-view';
import SortByPriceView from '../views/sort-by-price-view';
import ProductPresenter from './product-presenter';
import { render, replace, remove } from '../framework/render';
import { SortType } from "../const";

const COUNT_FLOWERS = 6;

export default class CataloguePresenter {
  #catalogContainer = new CatalogContainerView();
  #catalogWrapContainer = new CatalogContainerWrapView();
  #catalogHeaderContainer = new CatalogueHeaderContainerView();
  #catalogButtonContainer = new CatalogButtonWrapView();
  #catalogButtonMore = new CatalogButtonMoreView();
  #catalogButtonUpView = new CatalogButtonUpView();
  #catalogProductListContainer = new CatalogProductListView();

  #sortByPrice = null;
  #currentSortByPrice = SortType.INCREMENT;
  #productPresenter = new Map();

  #container = null;
  #products = null;

  #renderFlowersCount = COUNT_FLOWERS;

  constructor(container, products) {
    this.#container = container;
    this.#products = products.get();
  }
  init() {
    this.#sortProducts();
    this.#renderCatalog();
  }
  get flowers () {
    return this.#products
  }
  #renderCatalogContainer(container) {
    render(this.#catalogContainer, container);
    render(this.#catalogWrapContainer, this.#catalogContainer.element);
    render(this.#catalogHeaderContainer, this.#catalogWrapContainer.element);
    render(this.#catalogProductListContainer, this.#catalogWrapContainer.element);
    render(this.#catalogButtonContainer, this.#catalogWrapContainer.element);
  }

  #renderCatalog() {
    const flowers = this.flowers.slice(0, Math.min(this.#products.length, COUNT_FLOWERS));

    this.#renderCatalogContainer(this.#container)
    this.#renderSort(this.#catalogHeaderContainer.element);
    this.#renderCatalogList(flowers);
  }

  #renderButtonMore() {
    render(this.#catalogButtonMore, this.#catalogButtonContainer.element);
    this.#catalogButtonMore.buttonClickHandler(() => this.#buttonMoreClickHandler());
  }
  #renderButtonUp() {
    render(this.#catalogButtonUpView, this.#catalogButtonContainer.element);
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
    const productPresenter = new ProductPresenter(container);
    productPresenter.init(flower);
    this.#productPresenter.set(flower.id, productPresenter);
  }
  // Sort of price
  #sortTypeChange = (sortType) => {
    if (this.#currentSortByPrice === sortType) {
      return;
    }
    this.#currentSortByPrice = sortType;
    this.#sortProducts();
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
  #sortProducts = () => {
    this.flowers.sort((a, b) => {
      if (this.#currentSortByPrice === SortType.INCREMENT) {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }
  // Clear Products presenter and buttons
  #clearFlowersList = () => {
    this.#productPresenter.forEach((presenter) => presenter.destroy());
    this.#productPresenter.clear();
    this.#renderFlowersCount = COUNT_FLOWERS;
    remove(this.#catalogButtonMore);
    remove(this.#catalogButtonUpView);
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
}
