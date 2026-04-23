import FilterColorView from "../views/filter-color-view";
import { render, remove, replace } from '../framework/render';
import { FILTER_TYPE_COLOR, UpdateType } from '../const';

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
    this.#currentFilter = this.#filter.getColors();

    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterColorView(this.filters, this.#currentFilter);
    this.#filterComponent.setFilterTypeClickHandler(this.#handleColorChange);

    if(prevFilterComponent === null) {
      return render(this.#filterComponent, this.#container);
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };
  #filterModelEventHandler = () => {
      this.init();
    }
  #handleColorChange = (filterType) => {

    console.log('Отправляем в модель:', this.#currentFilter);
  }

}
