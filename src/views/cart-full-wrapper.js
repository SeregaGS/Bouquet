import AbstractView from '../framework/view/abstract-view';

const createCartWrapperTemplate = () => `<div class="popup-deferred__wrapper"></div>`

export default class CartFullWrapperView extends AbstractView {
  get template() {
    return createCartWrapperTemplate();
  }
}
