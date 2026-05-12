import AbstractView from '../framework/view/abstract-view';

const createLoadingErrorTemplate = () =>
  `
   <section class="error-message">
    <h3 class="visually-hidden">Ошибка</h3>
    <p class="text text--align-center message__title title title--header">Упс, что - то пошло не так</p>
    <button class="btn btn--outlined-2 error-message__button" type="button">Перезагрузить страницу</button>
   </section>
  `
export default class LoadingErrorView extends AbstractView {
  get template() {
    return createLoadingErrorTemplate();
  }
  setReloadPage = (callback) => {
    this._callback.reloadPage = callback;
    this.element.querySelector('.error-message__button').addEventListener('click', this.#reloadPage);
  }
  #reloadPage = (evt) => {
    evt.preventDefault();
    this._callback.reloadPage();
  }
}
