import FilterReasonView from '../views/filter-reason-view';
import {render, remove, replace} from '../framework/render';
import { FILTER_TYPE_REASONS, UpdateType } from '../const';

export default class FilterReasonPresenter {
  #container = null;
  #filterComponent = null;

  #currentFilter = null;

  #filter = null;

  constructor(container, filter) {
    this.#container = container;
    this.#filter = filter;
  }

  get filters() {
    return Object.entries(FILTER_TYPE_REASONS).map(([key, value]) => ({
      key: key,
      name: value
    }))
  };

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#currentFilter = this.#filter.get();

    this.#filterComponent = new FilterReasonView(this.filters, this.#currentFilter);
    this.#filterComponent.setFilterTypeClickHandler(this.#filterTypeReason);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #filterTypeReason = (filterType) => {
    if(this.#filter.get() === filterType) {
      return;
    }
    this.#filter.set(UpdateType.MINOR, filterType);
  }

  getElement = () => {
    return this.#filterComponent.element;
  }
  destroy() {
    remove(this.#filterComponent);
    this.#filterComponent = null;
    this.#currentFilter = null;
  }
}
