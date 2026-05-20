import { CarComponent } from './CarComponent.js';
import { CarLeaf } from './CarLeaf.js';

/** Композит — категория автомобилей. */
export class CarCategory extends CarComponent {
  constructor(name) {
    super();
    this.name = name;
    this.children = [];
  }

  add(component) {
    this.children.push(component);
  }

  remove(component) {
    this.children = this.children.filter((child) => child !== component);
  }

  getPrice() {
    if (!this.children.length) return 0;
    const total = this.children.reduce((sum, child) => sum + child.getPrice(), 0);
    return total / this.children.length;
  }

  getCount() {
    return this.children.reduce((sum, child) => sum + child.getCount(), 0);
  }

  getName() {
    return this.name;
  }

  /** Все листья (автомобили) внутри категории. */
  getLeaves() {
    const leaves = [];
    this.children.forEach((child) => {
      if (child instanceof CarLeaf) {
        leaves.push(child);
      } else if (child.getLeaves) {
        leaves.push(...child.getLeaves());
      }
    });
    return leaves;
  }
}
