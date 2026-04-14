import AbstractView from '../framework/view/abstract-view';

const createCatalogProductListTemplate = () =>
  `
   <ul class="catalogue__list">

   </ul>
  `
export default class CatalogProductListView extends AbstractView {
  get template() {
    return createCatalogProductListTemplate();
  }
}
