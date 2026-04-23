import Observable from "../framework/observable";
import { FILTER_TYPE_REASONS, FILTER_TYPE_COLOR } from '../const';

export default class FilterReasonType extends Observable {
  #colorDefault = Object.keys(FILTER_TYPE_COLOR).find(i => i === 'all');

  #filter = FILTER_TYPE_REASONS.all;
  #colors = [this.#colorDefault]

  get = () => this.#filter;

  set = (updateType, update) => {
    this.#filter = update;
    this._notify(updateType);
  }

  getColors = () => this.#colors;

  setColors = (updateType, colors) => {
    this.#colors = colors;
    this._notify(updateType);
  }
}
