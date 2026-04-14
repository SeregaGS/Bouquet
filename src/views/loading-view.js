import AbstractView from '../framework/view/abstract-view.js';

const createLoadingViewTemplate = () =>
  `
   <section class="error-message">
      <h3 class="title--header">Загрузка данных...</h3>
   </section>
  `;

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingViewTemplate();
  }
}
