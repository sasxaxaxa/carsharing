/**
 * Компоновщик (Composite): базовый компонент иерархии каталога.
 */
export class CarComponent {
  getPrice() {
    throw new Error('getPrice() must be implemented');
  }

  getCount() {
    throw new Error('getCount() must be implemented');
  }

  getName() {
    return '';
  }
}
