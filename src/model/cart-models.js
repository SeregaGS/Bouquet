import Observable from "../framework/observable";

export default class CartModels extends Observable {
  #DEFAULT_CART = {"products": {}, "productCount": 0, "sum": 0}
  #apiServices = null;
  #isLoading = true;

  constructor(apiServices) {
    super();
    this.#apiServices = apiServices;
  }

  init = async () => {
    try {
      this.#DEFAULT_CART = await this.#apiServices.get();
      this.#isLoading = false;
    } catch (error) {
      this.#isLoading = false;
      this.#DEFAULT_CART = {"products": {}, "productCount": 0, "sum": 0};
      throw new Error(error);
    }
    this._notify('EXTRA', this.#DEFAULT_CART);
  }
  get = () => {
   return this.#DEFAULT_CART?.products
     ? this.#DEFAULT_CART
     : { "products": {}, "productCount": 0, "sum": 0 };
  }
  add = async (product) => {
    try {
      const response = await this.#apiServices.add(product);
      this.#DEFAULT_CART = response.products ? response : await this.#apiServices.get();
      this._notify('EXTRA', this.#DEFAULT_CART);
      return this.#DEFAULT_CART;
    } catch (error) {
      this.#DEFAULT_CART = await this.#apiServices.get();
      this._notify('EXTRA', this.#DEFAULT_CART);
      throw error;
    }
  }

  delete = async (product) => {
    try {
      const response = await this.#apiServices.delete(product);
      if (!response || !response.products) {
        this.#DEFAULT_CART = await this.#apiServices.get();
      } else {
        this.#DEFAULT_CART = response;
      }

      this._notify('EXTRA', this.#DEFAULT_CART);
      return this.#DEFAULT_CART;
    } catch (error) {
      this.#DEFAULT_CART = await this.#apiServices.get();
      this._notify('EXTRA', this.#DEFAULT_CART);
      throw error;
    }
  }
};
