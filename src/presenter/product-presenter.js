import ProductItemView from '../views/catalog-product-item-view';
import { render, replace, remove } from '../framework/render';

export default class ProductPresenter {
  #container = null;
  #product = null;
  #cartModel = null
  #productComponent = null;
  #handleDataChange = null;

  constructor(container, handleDataChange, cartModel) {
    this.#container = container;
    this.#handleDataChange = handleDataChange;
    this.#cartModel = cartModel;

    this.#cartModel.addObserver(() => this.init(this.#product));

  }

  init(flower) {
    if(!flower) return;
    this.#product = flower;
    const data = this.#cartModel.get().products.hasOwnProperty(this.#product.id);
    const prevFlowerCardComponent = this.#productComponent;

    this.#productComponent = new ProductItemView(this.#product, data);
    this.#productComponent.setOpenPopupHandler(this.#handleOpenPopup);
    this.#productComponent.setAddToCart(this.#clickAddToCartHandler);

    if(prevFlowerCardComponent === null) {
      render(this.#productComponent, this.#container.element);
      return;
    }

    replace(this.#productComponent, prevFlowerCardComponent);
    remove(prevFlowerCardComponent);
  }
  destroy() {
    remove(this.#productComponent);
  }
  #handleOpenPopup = () => {
    this.#handleDataChange(this.#product.id);
  }
  #clickAddToCartHandler = () => {
    const cartData = this.#cartModel.get();

    if(cartData?.products?.hasOwnProperty(this.#product.id)) {
      this.#cartModel.clear(this.#product);
    } else {
      this.#cartModel.add(this.#product);
    }

  }
}
