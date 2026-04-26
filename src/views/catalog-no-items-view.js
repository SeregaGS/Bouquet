import AbstractView from '../framework/view/abstract-view';

const createCatalogNoItemsTemplate = () =>
  `
    <div class="message catalogue__no-items">
      <p class="text text--align-center message__text">Извините, по вашему запросу букетов не найдено</p>
    </div>
  `
export default class CatalogNoItemView extends AbstractView {
  get template() {
    return createCatalogNoItemsTemplate();
  }
}
