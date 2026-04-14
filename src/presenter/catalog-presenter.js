import CatalogContainerView from '../views/catalog-container-view';
import CatalogueHeaderContainerView from '../views/catalog-container-header-view';
import CatalogButtonWrapView from "../views/catalog-button-wrap-view";
import CatalogButtonMoreView from '../views/catalog-button-more-view';
import CatalogButtonUpView from '../views/catalog-button-up-view';
import CatalogProductListView from '../views/catalog-product-list-view'
import SortByPricePresenter from './sort-by-price-presenter';
import ProductPresenter from './product-presenter';
import { render, replace, remove } from '../framework/render';

export default class CataloguePresenter {
  #catalogContainer = new CatalogContainerView();
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
  init() {
    this.#renderCatalogContainer(this.#container)
  }
  #renderCatalogContainer(container) {
    const containerElement = this.#catalogContainer.element.querySelector('.container');
    render(this.#catalogContainer, container);
    render(this.#catalogHeaderContainer, containerElement);
    this.#renderSortByPricePresenter();
    this.#renderCatalogList(this.#products);
    render(this.#catalogProductListContainer, containerElement);
    this.#renderButton(containerElement);
  }
  #renderButton(container) {
    const containerButton = this.#catalogButtonContainer.element;
    render(this.#catalogButtonContainer, container);
    render(this.#catalogButtonMore, containerButton);
    render(this.#catalogButtonUpView, containerButton);
  }

  #renderSortByPricePresenter() {
    const container = this.#catalogHeaderContainer.element;
    this.#sortByPricePresenter = new SortByPricePresenter(container);
    this.#sortByPricePresenter.init();
  }


  #renderCatalogList(flowers) {
    this.#renderFlowers(flowers, this.#catalogProductListContainer)
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
