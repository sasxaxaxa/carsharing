import { CarComponent } from './CarComponent.js';

/** Корневой композит — весь автопарк. */
export class CarFleet extends CarComponent {
  constructor(name = 'Автопарк Morent') {
    super();
    this.name = name;
    this.categories = [];
  }

  addCategory(category) {
    this.categories.push(category);
  }

  getPrice() {
    if (!this.categories.length) return 0;
    const total = this.categories.reduce((sum, cat) => sum + cat.getPrice(), 0);
    return total / this.categories.length;
  }

  getCount() {
    return this.categories.reduce((sum, cat) => sum + cat.getCount(), 0);
  }

  getName() {
    return this.name;
  }

  getCategories() {
    return this.categories;
  }
}
