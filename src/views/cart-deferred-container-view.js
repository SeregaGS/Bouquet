import AbstractView from '../framework/view/abstract-view';

const createCartDeferredContainerTemplate = () => `<div class="popup-deferred__container"></div>`;

export default class CartDeferredContainerView extends AbstractView {
  get template() {
    return createCartDeferredContainerTemplate();
  }
}
