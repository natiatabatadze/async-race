import { CAR_BRANDS, CAR_MODELS } from '../constants/car-names.constants';

const HEX_COLOR_LENGTH = 6;
const HEX_CHARS = '0123456789ABCDEF';

export function randomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function randomCarName(): string {
  return `${randomItem(CAR_BRANDS)} ${randomItem(CAR_MODELS)}`;
}

export function randomColor(): string {
  let color = '#';
  for (let i = 0; i < HEX_COLOR_LENGTH; i += 1) {
    color += randomItem([...HEX_CHARS]);
  }
  return color;
}