import AbstractView from '../framework/view/abstract-view';

const createCartEmptyViewTemplate = () =>
  `
    <li class="popup-deferred__item">
      <h2 class="title title--h2">Ваша корзина пуста</h2>
    </li>
  `
export default class CartEmptyView extends AbstractView {
  get template() {
    return createCartEmptyViewTemplate();
  }
}
