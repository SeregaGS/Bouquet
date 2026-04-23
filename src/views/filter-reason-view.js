import AbstractView from '../framework/view/abstract-view';
import { TypeLabelProducts } from '../const'

const createFilterReasonItem = ({key, name}, index, currentFilters) => {
  return `
      <div class="filter-field-text filter-reason__form-field--for-${key} filter-reason__form-field">
        <input
          class="filter-field-text__input filter-reason__form-field--for-${key} filter-reason__form-field"
          type="radio"
          id="filter-reason-field-id-${key}"
          name="reason"
          value="for-${key}"
          ${key === currentFilters ? 'checked' : ''}
          >
        <label
          class="filter-field-text__label"
          for="filter-reason-field-id-${index}"
          >
          <span class="filter-field-text__text" data-filter-reason="${key}">${TypeLabelProducts[name]}</span>
        </label>
       </div>`
}
const createFilterReasonTemplate = (filters, currentFilters) => {
 const filterItems = filters.map((filter, index) =>
   createFilterReasonItem(filter, index, currentFilters))
   .join('');

  return `
     <section class="filter-reason">
       <div class="container">
        <h2 class="title title--h3 filter-reason__title">Выберите повод для букета</h2>
        <form class="filter-reason__form" action="#" method="post">
          <div class="filter-reason__form-fields">
            ${filterItems}
          </div>
        </form>
       </div>
     </section>
  `;
}
export default class FilterReasonView extends AbstractView {
  #filters = null;
  #currentFilters = null;

  constructor(filters, currentFilters) {
    super();
    this.#filters = filters;
    this.#currentFilters = currentFilters;
  }
  get template() {
    return createFilterReasonTemplate(this.#filters, this.#currentFilters);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterType = callback;
    this.element.addEventListener('click', this.#filterTypeHandler);
  }

  #filterTypeHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.dataset.filterReason === undefined) {
      return;
    }
    this._callback.filterType(evt.target.dataset.filterReason);
  }
}
