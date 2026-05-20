export class BaseRental {
  constructor({ pricePerMinute }) {
    this.pricePerMinute = Number(pricePerMinute) || 0;
  }

  getDescription() {
    return 'Аренда';
  }

  getPricePerMinute() {
    return this.pricePerMinute;
  }
}

