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
import { filterReason } from '../utils/filter-reason';

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
  #filterModel = null;

  constructor(container, products, filterModel) {
    this.#container = container;
    this.#products = products;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#onFilterModelChange);
  }

  init() {
    this.#renderCatalogContainer(this.#container);
    this.#renderCatalog();
    console.log(this.flowers)
  }

  get flowers () {
    let flowers = [...this.#products.get()];

    const currentFilterReason = this.#filterModel.get();

    if (filterReason[currentFilterReason]) {
      flowers = filterReason[currentFilterReason](flowers)
    }

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

    this.#clearFlowersList();
    this.#renderCatalog();
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
  #handleProductClick = async (id) => {
    this.#selectedProduct = await this.#products.loadProductDetails(id);
    this.#renderPopup(this.#selectedProduct);
  }
  #onFilterModelChange = () => {
    this.#clearFlowersList();
    this.#renderCatalog();
  }
}
