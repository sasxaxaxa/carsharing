import { CarLeaf } from '../composite/CarLeaf.js';
import { CarCategory } from '../composite/CarCategory.js';
import { CarFleet } from '../composite/CarFleet.js';

/**
 * Итератор обхода дерева Компоновщика (категории и листья).
 */
export class CategoryIterator {
  constructor(root) {
    this.stack = [root];
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    while (this.stack.length > 0) {
      const current = this.stack.pop();

      if (current instanceof CarLeaf) {
        return { value: current, done: false };
      }

      if (current instanceof CarFleet) {
        for (let i = current.categories.length - 1; i >= 0; i -= 1) {
          this.stack.push(current.categories[i]);
        }
        return { value: current, done: false };
      }

      if (current instanceof CarCategory) {
        for (let i = current.children.length - 1; i >= 0; i -= 1) {
          this.stack.push(current.children[i]);
        }
        return { value: current, done: false };
      }
    }

    return { done: true };
  }
}
