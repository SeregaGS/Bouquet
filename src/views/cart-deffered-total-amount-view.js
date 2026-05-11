import AbstractView from '../framework/view/abstract-view';

const createCartDeferredTotalAmountTemplate = ({productCount, sum}) =>
  `<div class="popup-deferred__sum">
    <p class="text text--total">Итого вы выбрали:</p>
    <div class="popup-deferred__block-wrap">
      <div class="popup-deferred__block">
        <p class="text text--total">Букеты</p><span class="popup-deferred__count" data-atribut="count-defer">${productCount}</span>
      </div>
      <div class="popup-deferred__block">
        <p class="text text--total">Сумма</p><b class="price price--size-middle-p">${sum}<span>Р</span></b>
      </div>
    </div>
  </div>
  `
export default class CartDeferredTotalAmountView extends AbstractView {
  constructor(total) {
    super();
    this._state = total
  }
  get template() {
    return createCartDeferredTotalAmountTemplate(this._state);
  }

}
