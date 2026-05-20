import { useEffect, useMemo, useState } from 'react';
import { getAllCars } from '../../api/cars.js';
import { buildFleetFromCars } from '../../patterns/composite/buildFleetFromCars.js';
import { CarFilterIterator } from '../../patterns/iterator/CarFilterIterator.js';
import { useAuth } from '../../context/AuthContext.jsx';
import CatalogComposite from '../catalog/CatalogComposite.jsx';

const CarCardList = () => {
  const { user, isAuthenticated } = useAuth();
  const [fleet, setFleet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCars = () => {
    setLoading(true);
    setError('');

    const params =
      isAuthenticated && user?.license_category
        ? { license_category: user.license_category }
        : {};

    getAllCars(params)
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
  }, [isAuthenticated, user?.license_category]);

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
    return <p className="catalog__status">Нет доступных автомобилей</p>;
  }

  return <CatalogComposite fleet={fleet} onRented={loadCars} />;
};

export default CarCardList;
