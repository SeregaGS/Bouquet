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
    this._notify();
  }
  get = () => this.#products
};
