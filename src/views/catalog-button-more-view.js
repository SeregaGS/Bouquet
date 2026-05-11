import AbstractView from '../framework/view/abstract-view';

const createCatalogButtonMoreTemplate = () =>
  `
    <button class="btn btn--outlined catalogue__show-more-btn" type="button">
      больше букетов
    </button>
  `
export default class CatalogButtonMoreView extends AbstractView {
  get template() {
    return createCatalogButtonMoreTemplate();
  }

  setButtonMoreHandler(callback) {
    this._callback.buttonMoreHandler = callback;
    this.element.addEventListener('click', this.#setButtonMoreHandler);
  }

  #setButtonMoreHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonMoreHandler();
  }
}
