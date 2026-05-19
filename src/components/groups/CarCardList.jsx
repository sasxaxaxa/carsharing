import { useEffect, useState } from 'react';
import { getAllCars } from '../../api/cars.js';
import CarCard from '../ui/CarCard.jsx';

const CarCardList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCars = () => {
    setLoading(true);
    setError('');

    getAllCars()
      .then(setCars)
      .catch(() => setError('Не удалось загрузить каталог'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCars();
  }, []);

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

  if (!cars.length) {
    return <p className="catalog__status">Нет доступных автомобилей</p>;
  }

  return (
    <div className="catalog">
      <div className="catalog__list">
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              <CarCard car={car} onRented={loadCars} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CarCardList;
