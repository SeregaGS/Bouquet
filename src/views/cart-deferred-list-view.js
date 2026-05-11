import AbstractView from '../framework/view/abstract-view';

const createCartDeferredListTemplate = () =>
  `
   <ul class="popup-deferred__catalog">

   </ul>
  `
export default class CartDeferredListView extends AbstractView {
  get template() {
    return createCartDeferredListTemplate();
  }
}
