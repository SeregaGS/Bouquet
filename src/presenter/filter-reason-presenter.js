import FilterReasonView from '../views/filter-reason-view';
import { render, remove } from '../framework/render';
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
    if(this.#filterComponent !== null) {
      return;
    }
    this.#currentFilter = this.#filter.get();
    const filters = this.filters;

    this.#filterComponent = new FilterReasonView(filters, this.#currentFilter);
    this.#filterComponent.setFilterTypeClickHandler(this.#filterTypeReason);

    render(this.#filterComponent, this.#container);
  };

  #filterTypeReason = (filterType) => {
    if(this.#filter.get() === filterType) {
      return;
    }
    this.#filter.set(UpdateType.MINOR, filterType);
  }

  destroy() {
    remove(this.#filterComponent);
    this.#filterComponent = null;
    this.#currentFilter = null;
  }
}
