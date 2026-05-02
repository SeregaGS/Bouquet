import Observable from "../framework/observable";
import { FILTER_TYPE_REASONS } from '../const';

export default class FilterReasonType extends Observable {

  #filter = FILTER_TYPE_REASONS.all;
  #colors = [FILTER_TYPE_REASONS.all]

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
