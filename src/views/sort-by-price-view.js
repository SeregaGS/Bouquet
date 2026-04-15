import AbstractView from '../framework/view/abstract-view';
import { SortType } from '../const';

const createSortByPriceTemplate = (activeSort) =>
  `
    <div class="catalogue__sorting">
      <div class="sorting-price">
        <h3 class="title sorting-price__title">Цена</h3>
        <a
          class="
            sorting-price__link
            sorting-price__link--incr
            ${(activeSort === SortType.INCREMENT) ? 'sorting-price__link--active' : ''}"
          href="#"
          data-sort-by-price="${SortType.INCREMENT}"
          aria-label="сортировка по возрастанию цены"
          >
          <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
            <use xlink:href="#icon-increase-sort"></use>
          </svg>
        </a>
        <a
          class="
            sorting-price__link
            ${(activeSort === SortType.DECREMENT) ? 'sorting-price__link--active' : ''}"
          href="#"
          data-sort-by-price="${SortType.DECREMENT}"
          aria-label="сортировка по убыванию цены"
          >
          <svg class="sorting-price__icon" width="50" height="46" aria-hidden="true">
            <use xlink:href="#icon-descending-sort"></use>
          </svg>
        </a>
      </div>
    </div>
  `
export default class SortByPriceView extends AbstractView {
  #currentSort = null

  constructor(currentSort) {
    super();
    this.#currentSort = currentSort;
  }
  get template() {
    return createSortByPriceTemplate(this.#currentSort);
  }

  buttonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    const link = evt.target.closest('.sorting-price__link');

    if(link) {
      this._callback.buttonClick(link.dataset.sortByPrice);
    }
    // if(evt.target.tagName === null || evt.target.closest('.sorting-price__link')) {
    //   const link = evt.target.closest('.sorting-price__link');
    //   this._callback.buttonClick(link.dataset.sortByPrice);
    // }
    // const link = evt.target.closest('.sorting-price__link');
    // this._callback.buttonClick(link.dataset.sortByPrice);
  }
}
