import AbstractView from '../framework/view/abstract-view';

const createCatalogueTemplate = () =>
  `
    <div class="catalogue" data-items="catalogue">
      <div class="container">

      </div>
    </div>
  `
export default class CatalogContainerView extends AbstractView {
  get template() {
    return createCatalogueTemplate();
  }
}
