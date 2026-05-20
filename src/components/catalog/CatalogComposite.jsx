import CarCard from '../ui/CarCard.jsx';
import { CategoryIterator } from '../../patterns/iterator/CategoryIterator.js';
import { CarLeaf } from '../../patterns/composite/CarLeaf.js';
import { CarCategory } from '../../patterns/composite/CarCategory.js';
import { CarFleet } from '../../patterns/composite/CarFleet.js';

/**
 * Отображение иерархии каталога (Компоновщик + Итератор).
 */
const CatalogComposite = ({ fleet, onRented }) => {
  const sections = [];
  let currentSection = null;

  const iterator = new CategoryIterator(fleet);

  for (const node of iterator) {
    if (node instanceof CarFleet) {
      sections.push({
        type: 'fleet',
        key: 'fleet',
        title: node.getName(),
        meta: `Всего: ${node.getCount()} · ср. цена: ${node.getPrice().toFixed(2)} ₽/мин`,
      });
    } else if (node instanceof CarCategory) {
      currentSection = {
        type: 'category',
        key: node.getName(),
        title: node.getName(),
        meta: `${node.getCount()} авто · ср. ${node.getPrice().toFixed(2)} ₽/мин`,
        cars: [],
      };
      sections.push(currentSection);
    } else if (node instanceof CarLeaf) {
      if (!currentSection) {
        currentSection = { type: 'category', key: 'other', title: 'Прочее', cars: [] };
        sections.push(currentSection);
      }
      currentSection.cars.push(node.getCar());
    }
  }

  return (
    <div className="catalog-composite">
      {sections.map((section) => {
        if (section.type === 'fleet') {
          return (
            <header key={section.key} className="catalog-composite__fleet">
              <h1>{section.title}</h1>
              <p>{section.meta}</p>
            </header>
          );
        }

        return (
          <section key={section.key} className="catalog-composite__section">
            <h2 className="catalog-composite__title">{section.title}</h2>
            <p className="catalog-composite__meta">{section.meta}</p>
            <ul className="catalog-composite__grid">
              {section.cars.map((car) => (
                <li key={car.id}>
                  <CarCard car={car} onRented={onRented} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

export default CatalogComposite;
