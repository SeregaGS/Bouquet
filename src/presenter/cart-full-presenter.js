import CartFullContainerView from '../views/cart-full-container-view';
import CartFullWrapperView from '../views/cart-full-wrapper';
import CartHeroView from '../views/cart-hero-view';
import CartDeferredContainerView from '../views/cart-deferred-container-view'
import CartDeferredButtonCatalogView from '../views/cart-deferred-button-catalog-view';
import CartDeferredList from '../views/cart-deferred-list-view';
import CartButtonClearView from '../views/cart-deferred-button-clear-view';
import CartEmptyView from '../views/cart-empty-view'
import CartProductPresenter from "./cart-product-presenter";
import CartTotalAmountPresenter from './cart-total-amount-presenter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import {render, remove} from '../framework/render';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class CartFullPresenter {
  cartContainer = new CartFullContainerView();
  #cartWrapper = new CartFullWrapperView();
  #cartHeroView = new CartHeroView();
  #cartDeferredView = new CartDeferredContainerView();
  #cartDeferredButtonCatalog = new CartDeferredButtonCatalogView();
  #cartDeferredListContainer = new CartDeferredList();
  #cartButtonClearView = new CartButtonClearView();
  #cartEmptyView = new CartEmptyView();

  #cartDeferredTotalAmountPresenter = null;

  #container = null;
  #closeCartFull = null;

  #productModel = null;
  #cartModel = null;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  #productPresenter = new Map();

  constructor(container, productModel, cartModel, closeCartFull) {
    this.#container = container;
    this.#productModel = productModel;
    this.#cartModel = cartModel;
    this.#closeCartFull = closeCartFull;

    this.#cartModel.addObserver(this.#loadData);
    this.#productModel.addObserver(this.#loadData);
  }

  init = () => {
    this.#renderCartContainer();
    this.#renderHeroCart();
    this.#renderCartDeferredView();
    this.#renderButtonCatalog();
    render(this.#cartDeferredListContainer, this.#cartDeferredView.element);
  }
  get products() {
    const cartData = this.#cartModel.get().products;
    return this.#productModel.get().filter((item) => cartData.hasOwnProperty(item.id));
  }

  #renderCartContainer = () => {
    render(this.cartContainer, this.#container, 'afterend');
    render(this.#cartWrapper, this.cartContainer.element);
  }
  #renderHeroCart = () => {
    render(this.#cartHeroView, this.#cartWrapper.element);
    this.#cartHeroView.handlerCartVisible(this.#closeCartFull);
  }
  #renderCartDeferredView = () => {
    render(this.#cartDeferredView, this.#cartWrapper.element);
  }
  #renderButtonCatalog = () => {
    render(this.#cartDeferredButtonCatalog, this.#cartDeferredView.element);
    this.#cartDeferredButtonCatalog.setCloseCartPopup(this.#closeCartFull);
  }

  #renderButtonClear = () => {
    if (this.products.length === 0) {
      remove(this.#cartButtonClearView);
      return;
    }
    render(this.#cartButtonClearView, this.#cartDeferredView.element);

    this.#cartButtonClearView.setClearCart(this.#clearCartAllProducts);
  }

  #renderCartTotalAmount = (container, cartModel) => {
    this.#cartDeferredTotalAmountPresenter = new CartTotalAmountPresenter(container, cartModel);
    this.#cartDeferredTotalAmountPresenter.init();
  }
  #clearCartTotalAmount = () => {
    if(this.#cartDeferredTotalAmountPresenter !== null) {
      this.#cartDeferredTotalAmountPresenter.destroy();
      this.#cartDeferredTotalAmountPresenter = null;
    }
  }

  #renderCartDeferredList = () => {
    this.#clearRenderCart();

    if(this.products.length === 0) {
      render(this.#cartEmptyView, this.#cartDeferredListContainer.element);
      return;
    }

    this.#renderCartDeferredItems(this.#cartDeferredListContainer.element, this.products);
    this.#renderButtonClear();
    this.#renderCartTotalAmount(this.#cartDeferredView.element, this.#cartModel);
  }
  #renderCartDeferredItems = (container, flowers) => {
    flowers.forEach((flower) => {
      this.#renderCartDeferredItem(container, flower);
    })
  }
  #renderCartDeferredItem = (container, flower) => {
    const productCartPresenter = new CartProductPresenter(
        container,
        this.#cartModel,
        this.#decrementCartProduct,
        this.#incrementCartProduct,
        this.#clearCartProduct);

    productCartPresenter.init(flower);

    this.#productPresenter.set(flower.id, productCartPresenter);
  }
  #clearRenderCart = () => {
    this.#productPresenter.forEach((presenter) => presenter.destroy());
    this.#productPresenter.clear();
    this.#clearCartTotalAmount();
    remove(this.#cartEmptyView);
    remove(this.#cartButtonClearView);
  }

  #loadData = () => {
    const allProducts = this.#productModel.get();
    const cartData = this.#cartModel.get().products;

    if(!allProducts || !cartData || allProducts.length === 0) {
      return;
    }

    this.#renderCartDeferredList();
  }

  #clearCartProduct = async (id) => {
    this.#uiBlocker.block();
    try {
      this.#cartModel.clear(id);
    } finally  {
      this.#uiBlocker.unblock();
    }
  }
  #decrementCartProduct = async (id) => {
    this.#uiBlocker.block();
    try {
      await this.#cartModel.delete(id);
    } finally  {
      this.#uiBlocker.unblock();
    }
  }
  #incrementCartProduct = async (id) => {
    this.#uiBlocker.block();
    try {
      await this.#cartModel.add(id);
    } finally  {
      this.#uiBlocker.unblock();
    }
  }
  #clearCartAllProducts = async (button) => {
    this.#uiBlocker.block();
    try {
      button.disabled = true;
      button.textContent = 'Очищаем...';
      await this.#cartModel.clearAll();
    } finally {
      this.#uiBlocker.unblock();
    }
  }
}
