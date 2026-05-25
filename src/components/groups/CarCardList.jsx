import { useEffect, useMemo, useState } from 'react';
import { getAllCars } from '../../api/cars.js';
import { buildFleetFromCars } from '../../patterns/composite/buildFleetFromCars.js';
import { CarFilterIterator } from '../../patterns/iterator/CarFilterIterator.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { collectTagOptions } from '../../utils/carTags.js';
import CatalogComposite from '../catalog/CatalogComposite.jsx';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Все категории' },
  { value: 'economy', label: 'Эконом' },
  { value: 'comfort', label: 'Комфорт' },
  { value: 'business', label: 'Бизнес' },
  { value: 'luxury', label: 'Люкс' },
];

const STEERING_OPTIONS = [
  { value: '', label: 'Любая КПП' },
  { value: 'manual', label: 'Механика' },
  { value: 'automatic', label: 'Автомат' },
  { value: 'electric', label: 'Электро' },
];

const CarCardList = () => {
  const { user, isAuthenticated } = useAuth();
  const [fleet, setFleet] = useState(null);
  const [tagOptions, setTagOptions] = useState([{ value: '', label: 'Все теги' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    steering: '',
    tag: '',
  });

  const apiParams = useMemo(() => {
    const params = {};
    if (isAuthenticated && user?.license_category) {
      params.license_category = user.license_category;
    }
    if (filters.category) params.category = filters.category;
    if (filters.steering) params.steering = filters.steering;
    if (filters.tag) params.tag = filters.tag;
    return params;
  }, [isAuthenticated, user?.license_category, filters]);

  const loadCars = () => {
    setLoading(true);
    setError('');

    getAllCars(apiParams)
      .then((cars) => {
        const availableIterator = new CarFilterIterator(
          cars,
          (car) => car.status === 'available',
        );
        const availableCars = availableIterator.toArray();
        setFleet(buildFleetFromCars(availableCars));
      })
      .catch(() => setError('Не удалось загрузить каталог'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCars();
  }, [apiParams]);

  useEffect(() => {
    const params =
      isAuthenticated && user?.license_category
        ? { license_category: user.license_category }
        : {};

    getAllCars(params)
      .then((cars) => {
        const available = cars.filter((car) => car.status === 'available');
        setTagOptions(collectTagOptions(available));
      })
      .catch(() => {});
  }, [isAuthenticated, user?.license_category]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const totalCount = useMemo(() => fleet?.getCount() ?? 0, [fleet]);

  if (loading) {
    return <p className="catalog__status">Загрузка...</p>;
  }

  if (error) {
    return (
      <p className="catalog__status catalog__status--error">
        {error}
        <button type="button" onClick={loadCars}>
          Повторить
        </button>
      </p>
    );
  }

  if (!fleet || totalCount === 0) {
    return (
      <>
        <CatalogFilters
          filters={filters}
          tagOptions={tagOptions}
          onChange={handleFilterChange}
        />
        <p className="catalog__status">Нет доступных автомобилей по выбранным фильтрам</p>
      </>
    );
  }

  return (
    <>
      <CatalogFilters filters={filters} tagOptions={tagOptions} onChange={handleFilterChange} />
      <CatalogComposite fleet={fleet} onRented={loadCars} />
    </>
  );
};

function CatalogFilters({ filters, tagOptions, onChange }) {
  return (
    <div className="catalog__filters">
      <label>
        Категория
        <select name="category" value={filters.category} onChange={onChange}>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        КПП
        <select name="steering" value={filters.steering} onChange={onChange}>
          {STEERING_OPTIONS.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Тег
        <select name="tag" value={filters.tag} onChange={onChange}>
          {tagOptions.map((opt) => (
            <option key={opt.value || 'all'} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default CarCardList;
