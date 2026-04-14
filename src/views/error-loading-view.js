import AbstractView from '../framework/view/abstract-view';

const createLoadingErrorTemplate = () =>
  `
   <section class="error-message">
          <h3 class="visually-hidden">Ошибка</h3>
          <div class="message message--titled">
            <p class="text text--align-center message__title">Упс, что - то пошло не так</p>
            <p class="text text--align-center message__text">Давайте вернёмся на шаг назад и опробуем отправить ваш запрос снова</p>
          </div>
          <button class="btn btn--outlined-2 error-message__button" type="button">назад
          </button>
        </section>
  `
export default class LoadingErrorView extends AbstractView {
  get template() {
    return createLoadingErrorTemplate();
  }
}
