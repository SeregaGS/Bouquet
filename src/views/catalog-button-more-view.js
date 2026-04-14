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
}
