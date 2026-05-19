import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layouts/Header.jsx';
import { getRentalHistory } from '../api/rentals.js';
import { useAuth } from '../context/AuthContext.jsx';

const MyRentsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    getRentalHistory()
      .then(setRentals)
      .catch(() => setError('Не удалось загрузить историю аренд'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading]);

  return (
    <>
      <Header />
      <div className="page-container">
        <section className="rentals">
          <h1>Мои аренды</h1>

          {!authLoading && !isAuthenticated && (
            <p>
              <Link to="/login">Войдите</Link>, чтобы увидеть историю аренд.
            </p>
          )}

          {loading && <p>Загрузка...</p>}
          {error && <p className="rentals__error">{error}</p>}

          {!loading && isAuthenticated && !rentals.length && !error && (
            <p>У вас пока нет аренд.</p>
          )}

          <ul className="rentals__list">
            {rentals.map((rental) => {
              const car = rental.car_details;
              const title = car ? `${car.brand} ${car.model}` : `Авто #${rental.car}`;

              return (
                <li key={rental.id} className="rentals__item">
                  <h3>{title}</h3>
                  <p>Статус: {rental.status}</p>
                  <p>Начало: {new Date(rental.start_time).toLocaleString('ru-RU')}</p>
                  {rental.end_time && (
                    <p>Окончание: {new Date(rental.end_time).toLocaleString('ru-RU')}</p>
                  )}
                  {rental.total_price && <p>Сумма: {rental.total_price} ₽</p>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
};

export default MyRentsPage;
