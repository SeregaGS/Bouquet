import Observable from "../framework/observable";

export default class CartModels extends Observable {
  #cart = {"products": {}, "productCount": 0, "sum": 0}
  #apiServices = null;
  #isLoading = true;

  constructor(apiServices) {
    super();
    this.#apiServices = apiServices;
  }

  init = async () => {
    try {
      this.#cart = await this.#apiServices.get();
      this.#isLoading = false;
    } catch (error) {
      this.#isLoading = false;
      this.#cart = {"products": {}, "productCount": 0, "sum": 0};
      throw new Error(error);
    }
    this._notify('EXTRA', this.#cart);
  }
  get = () => {
   return this.#cart?.products
     ? this.#cart
     : { "products": {}, "productCount": 0, "sum": 0 };
  }
  add = async (product) => {
    try {
      const response = await this.#apiServices.add(product);
      this.#cart = response.products ? response : await this.#apiServices.get();
      this._notify('EXTRA', this.#cart);
      return this.#cart;
    } catch (error) {
      throw new Error(error);
    }
  }
  delete = async (product) => {
    try {
      const response = await this.#apiServices.delete(product);
      if (!response || !response.products) {
        this.#cart = await this.#apiServices.get();
      } else {
        this.#cart = response;
      }
      this._notify('EXTRA', this.#cart);
      return this.#cart;
    } catch (error) {
      throw new Error(error);
    }
  }
  clear = async (product) => {
    try {
      const currentCount = this.#cart.products[product.id] || 0;

      const deletedCount = Array.from({ length: currentCount }, () => this.#apiServices.delete(product));

      await Promise.all(deletedCount);
      this.#cart = await this.#apiServices.get();

      this._notify('EXTRA', this.#cart);
      return this.#cart;

    } catch(error) {
      throw new Error(error);
    }
  }
  clearAll = async() => {
    try {
      const deletePromises = Object.entries(this.#cart.products).flatMap(([id, count]) =>
        Array.from({ length: count }, () => this.#apiServices.delete({ id }))
      );

      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
      this.#cart = await this.#apiServices.get();
      this._notify('EXTRA', this.#cart);
    } catch (error) {
      throw new Error(error);
    }
  }
};
