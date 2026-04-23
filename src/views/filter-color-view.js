import AbstractView from "../framework/view/abstract-view";

const createFilterColorItemsTemplate = ({key, name}, index, currentFilter) => {
  const isChecked = currentFilter.includes(key) ? 'checked' : '';

  return `<div class="filter-field-img filter-color__form-field">
            <input
              class="filter-field-img__input filter-color__form-field"
              type="checkbox"
              id="filter-colors-field-id-${index}"
              name="colors" value="color-${key}"
              data-filter-color="${key}"
              ${isChecked}>
            <label class="filter-field-img__label" for="filter-colors-field-id-${index}">
              <span class="filter-field-img__img">
                <picture>
                  <source
                      type="image/webp"
                      srcset="img/content/filter-${key}.webp, img/content/filter-${key}@2x.webp 2x">
                    <img
                      src="img/content/filter-${key}.png"
                      srcset="img/content/filter-${key}@2x.png 2x"
                      width="130" height="130"
                      alt="${name}">
                </picture>
              </span>
              <span class="filter-field-img__text">${name}</span>
            </label>
          </div>`
}

const createFilterColorContainerTemplate = (filters, currentFilter) => {
  const filtersColor = filters.map((filter, index) =>
    createFilterColorItemsTemplate(filter, index, currentFilter)).join('')
  return `
      <section class="filter-color">
        <div class="container">
          <h2 class="title title--h3 filter-color__title">Выберите основной цвет для букета</h2>
          <form class="filter-color__form" action="#" method="post">
            <div class="filter-color__form-fields" data-filter-color="filter">
              ${filtersColor}
            </div>
          <button class="visually-hidden" type="submit" tabindex="-1">применить фильтр</button>
        </form>
      </div>
    </section>
  `
}

export default class FilterColorView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilter) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterColorContainerTemplate(this.#filters, this.#currentFilter);
  }
  setFilterTypeClickHandler(callback) {
    this._callback.filterType = callback;
    this.element.addEventListener('change', this.#filterTypeHandler);
  }

  #filterTypeHandler = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }
    this._callback.filterType(evt.target.dataset.filterColor);
  }
}
