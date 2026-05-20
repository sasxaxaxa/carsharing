import { CarFleet } from './CarFleet.js';
import { CarCategory } from './CarCategory.js';
import { CarLeaf } from './CarLeaf.js';

/**
 * Строит иерархию Компоновщика из плоского списка API.
 */
export function buildFleetFromCars(cars) {
  const fleet = new CarFleet('Автопарк Morent');
  const economy = new CarCategory('Эконом-класс');
  const comfort = new CarCategory('Комфорт-класс');
  const business = new CarCategory('Бизнес-класс');

  cars.forEach((car) => {
    const price = parseFloat(car.price_per_minute);
    const leaf = new CarLeaf(car);

    if (price < 6) {
      economy.add(leaf);
    } else if (price < 12) {
      comfort.add(leaf);
    } else {
      business.add(leaf);
    }
  });

  if (economy.getCount() > 0) fleet.addCategory(economy);
  if (comfort.getCount() > 0) fleet.addCategory(comfort);
  if (business.getCount() > 0) fleet.addCategory(business);

  return fleet;
}
