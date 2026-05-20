import { CarIterator } from './CarIterator.js';

/**
 * Итератор с фильтрацией (например, только доступные авто).
 */
export class CarFilterIterator extends CarIterator {
  constructor(cars, filterFunc) {
    const filtered = cars.filter(filterFunc);
    super(filtered);
    this.filterFunc = filterFunc;
  }
}
