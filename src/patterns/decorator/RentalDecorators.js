export class RentalDecorator {
  constructor(rental) {
    this.rental = rental;
  }

  getDescription() {
    return this.rental.getDescription();
  }

  getPricePerMinute() {
    return this.rental.getPricePerMinute();
  }
}

export class InsuranceDecorator extends RentalDecorator {
  getDescription() {
    return `${this.rental.getDescription()} + Страховка`;
  }

  getPricePerMinute() {
    return this.rental.getPricePerMinute() + 1.5;
  }
}

export class ChildSeatDecorator extends RentalDecorator {
  getDescription() {
    return `${this.rental.getDescription()} + Детское кресло`;
  }

  getPricePerMinute() {
    return this.rental.getPricePerMinute() + 0.8;
  }
}

export class AdditionalDriverDecorator extends RentalDecorator {
  getDescription() {
    return `${this.rental.getDescription()} + Доп. водитель`;
  }

  getPricePerMinute() {
    return this.rental.getPricePerMinute() + 1.0;
  }
}

export class GPSDecorator extends RentalDecorator {
  getDescription() {
    return `${this.rental.getDescription()} + GPS`;
  }

  getPricePerMinute() {
    return this.rental.getPricePerMinute() + 0.4;
  }
}

export const SERVICE_OPTIONS = [
  { key: 'insurance', label: 'Страховка', Decorator: InsuranceDecorator },
  { key: 'child_seat', label: 'Детское кресло', Decorator: ChildSeatDecorator },
  { key: 'additional_driver', label: 'Доп. водитель', Decorator: AdditionalDriverDecorator },
  { key: 'gps', label: 'GPS', Decorator: GPSDecorator },
];

export function buildDecoratedRental(baseRental, serviceKeys = []) {
  return serviceKeys.reduce((rental, key) => {
    const option = SERVICE_OPTIONS.find((s) => s.key === key);
    if (!option) return rental;
    return new option.Decorator(rental);
  }, baseRental);
}

