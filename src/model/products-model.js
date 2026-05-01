import Observable from "../framework/observable";

export default class FlowersModels extends Observable {
  #products = [];
  #apiServices = null;

  constructor(apiServices) {
    super();
    this.#apiServices = apiServices;
  }

  init = async () => {
    try {
      this.#products = await this.#apiServices.get();
    } catch {
      this.#products = [];
    }
    this._notify('EXTRA');
  }
  get = () => this.#products

  loadProductDetails = async (productId) => {
    try {
      return await this.#apiServices.getProductId(productId);
    } catch(error) {
      throw error;
    }
  }

};
