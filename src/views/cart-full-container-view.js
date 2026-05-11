import AbstractView from '../framework/view/abstract-view';

const createCartContainerTemplate = () => `<section class="popup-deferred" style="display: none"></section>`

export default class CartFullContainerView extends AbstractView {
  get template() {
    return createCartContainerTemplate();
  }
}
