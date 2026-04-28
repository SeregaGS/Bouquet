import { FILTER_TYPE_REASONS } from '../const';
import { ALL_TYPE } from "../const";

export const filterReason = {
  all: (flowers) => [...flowers],
  birthday: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.birthday),
  bride: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.bride),
  mother: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.mother),
  colleague: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.colleague),
  darling: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.darling),
}
export const filterColors = (flowers, currentColors) => {
  if(currentColors.includes(ALL_TYPE) || currentColors.length === 0) {
    return flowers;
  }
  return flowers.filter(flower => currentColors.includes(flower.color))
}
