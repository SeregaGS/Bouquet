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
      const flowers = await this.#apiServices.get();
      this.#products = flowers.map(FlowersModels.adaptToClient);
    } catch {
      this.#products = [];
    }
    this._notify();
  }
  get = () => this.#products

  loadProductDetails = async (productId) => {
    try {
      const flower = await this.#apiServices.getProductId(productId);
      return FlowersModels.adaptToClient(flower);
    } catch(error) {
      throw error;
    }
  }

  static adaptToClient(flowers) {
    return {
      ...flowers,
      isAdding: false
    };
  }
};
