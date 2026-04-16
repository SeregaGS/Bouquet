import ApiService from "../framework/api-service";

export default class FlowersApiServices extends ApiService {
  get = () => this._load({url: 'products'})
    .then(ApiService.parseResponse);
  getProductId = (productId) => this._load({url: `products/${productId}`})
    .then(ApiService.parseResponse);
}
