import ApiService from "../framework/api-service";

export default class CartApiServices extends ApiService {
  get = () => {
    return this._load({url: 'cart'})
      .then(ApiService.parseResponse);
  }

  add = async (product) => {
    const response = await this._load({
      url: `products/${product.id}`,
      method: 'PUT',
    })
    return await ApiService.parseResponse(response);
  }

  delete = async (product) => {
    const response = await this._load({
      url: `products/${product.id}`,
      method: 'DELETE',
    })
    if (response.status === 204) {
      return null;
    }
    try {
      return await ApiService.parseResponse(response);
    } catch {
      return null;
    }
  }
}
