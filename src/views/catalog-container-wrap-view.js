import AbstractView from '../framework/view/abstract-view';

const createCatalogueWrapTemplate = () =>
  `
    <div class="container">

    </div>
  `
export default class CatalogContainerWrapView extends AbstractView {
  get template() {
    return createCatalogueWrapTemplate();
  }
}
