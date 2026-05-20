/**
 * Итератор (Iterator): последовательный перебор автомобилей.
 */
export class CarIterator {
  constructor(cars) {
    this.cars = cars;
    this.index = 0;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.index < this.cars.length) {
      const value = this.cars[this.index];
      this.index += 1;
      return { value, done: false };
    }
    return { done: true };
  }

  first() {
    if (!this.cars.length) return null;
    this.index = 0;
    return this.cars[0];
  }

  last() {
    if (!this.cars.length) return null;
    this.index = this.cars.length - 1;
    return this.cars[this.cars.length - 1];
  }

  reset() {
    this.index = 0;
  }

  toArray() {
    return [...this.cars];
  }
}
