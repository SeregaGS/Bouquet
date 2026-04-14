import AbstractView from '../framework/view/abstract-view';

const createCatalogButtonWrapTemplate = () =>
  `
    <div class="catalogue__btn-wrap">

    </div>
  `
export default class CatalogButtonWrapView extends AbstractView {
  get template() {
    return createCatalogButtonWrapTemplate();
  }
}
