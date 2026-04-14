import CatalogContainerView from '../views/catalog-container-view';
import CatalogContainerWrapView from '../views/catalog-container-wrap-view';
import CatalogueHeaderContainerView from '../views/catalog-container-header-view';
import CatalogButtonWrapView from "../views/catalog-button-wrap-view";
import CatalogButtonMoreView from '../views/catalog-button-more-view';
import CatalogButtonUpView from '../views/catalog-button-up-view';
import CatalogProductListView from '../views/catalog-product-list-view'
import SortByPricePresenter from './sort-by-price-presenter';
import ProductPresenter from './product-presenter';
import { render, replace, remove } from '../framework/render';

const COUNT_FLOWERS = 6;

export default class CataloguePresenter {
  #catalogContainer = new CatalogContainerView();
  #catalogWrapContainer = new CatalogContainerWrapView();
  #catalogHeaderContainer = new CatalogueHeaderContainerView();
  #catalogButtonContainer = new CatalogButtonWrapView();
  #catalogButtonMore = new CatalogButtonMoreView();
  #catalogButtonUpView = new CatalogButtonUpView();
  #catalogProductListContainer = new CatalogProductListView();

  #sortByPricePresenter = null;
  #productPresenter = new Map();

  #container = null;
  #products = null

  constructor(container, products) {
    this.#container = container;
    this.#products = products.get();
  }
  get flowers () {
    const flowers = this.#products;
    return flowers;
  }
  init() {
    this.#renderCatalog();
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
    this.#renderSortByPricePresenter();
    this.#renderCatalogList(flowers);
  }

  #renderButtonMore() {
    render(this.#catalogButtonMore, this.#catalogButtonContainer.element);
  }
  #renderButtonUp() {
    render(this.#catalogButtonUpView, this.#catalogButtonContainer.element);
  }

  #renderSortByPricePresenter() {
    const container = this.#catalogHeaderContainer.element;
    this.#sortByPricePresenter = new SortByPricePresenter(container);
    this.#sortByPricePresenter.init();
  }
  #renderCatalogList(flowers) {
    this.#renderFlowers(flowers, this.#catalogProductListContainer);

    if (this.flowers.length > COUNT_FLOWERS) {
      this.#renderButtonMore();
      this.#renderButtonUp();
    }
  }
  #renderFlowers(flowers, container) {
    flowers.forEach((flower) => {
      this.#renderFlower(flower, container);
    })
  }
  #renderFlower(flower, container) {
    const productPresenter = new ProductPresenter(container);
    productPresenter.init(flower);
    this.#productPresenter.set(flower.id, productPresenter);
  }
}
