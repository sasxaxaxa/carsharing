import { CarComponent } from './CarComponent.js';

/** Лист дерева — один автомобиль. */
export class CarLeaf extends CarComponent {
  constructor(car) {
    super();
    this.car = car;
  }

  getPrice() {
    return parseFloat(this.car.price_per_minute);
  }

  getCount() {
    return 1;
  }

  getName() {
    return `${this.car.brand} ${this.car.model}`;
  }

  getCar() {
    return this.car;
  }
}
