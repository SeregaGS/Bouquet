import FilterColorView from "../views/filter-color-view";
import { render, remove, replace } from '../framework/render';
import { FILTER_TYPE_COLOR, UpdateType, ALL_TYPE } from '../const';

export default class FilterColorPresenter {
  #container = null;
  #filterComponent = null;

  #currentFilter = null;

  #filter = null;

  constructor(container, filterType) {
    this.#container = container;
    this.#filter = filterType;
  }

  get filters() {
    return Object.entries(FILTER_TYPE_COLOR).map(([key, value]) => ({
      key: key,
      name: value
    }))
  };

  init() {
    if(this.#filterComponent !== null) {
      return;
    }
    this.#currentFilter = this.#filter.getColors();


    this.#filterComponent = new FilterColorView(this.filters, this.#currentFilter);
    this.#filterComponent.setFilterTypeClickHandler(this.#handleColorChange);

    render(this.#filterComponent, this.#container)
  };

  #handleColorChange = (filterType) => {
    if(filterType === ALL_TYPE) {
      this.#currentFilter = [ALL_TYPE];
    } else {
      this.#currentFilter = this.#currentFilter.filter(item => item !== ALL_TYPE);

      const index = this.#currentFilter.indexOf(filterType);
      if(index > -1) {
        this.#currentFilter.splice(index, 1);
      } else {
        this.#currentFilter.push(filterType);
      }
      if(this.#currentFilter.length === 0) {
        this.#currentFilter = [ALL_TYPE];
      }
    }
    this.#filterComponent.updateActiveFilters(this.#currentFilter)

    this.#filter.setColors(UpdateType.MINOR, this.#currentFilter);
  }
  destroy() {
    remove(this.#filterComponent);
    this.#filterComponent = null;
    this.#currentFilter = null;
  }
}
