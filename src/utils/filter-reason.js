import { FILTER_TYPE_REASONS } from '../const';

export const filterReason = {
  all: (flowers) => [...flowers],
  birthday: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.birthday),
  bride: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.bride),
  mother: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.mother),
  colleague: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.colleague),
  darling: (flowers) => flowers.filter(flower => flower.type === FILTER_TYPE_REASONS.darling),
}
