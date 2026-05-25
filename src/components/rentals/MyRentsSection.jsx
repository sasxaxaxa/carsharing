import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RentalCard from './RentalCard.jsx';
import { getRentalHistory } from '../../api/rentals.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRentalMetaMap } from '../../utils/rentalMeta.js';

const MyRentsSection = ({ showTitle = true, className = '' }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = useCallback(() => {
    if (!isAuthenticated) return Promise.resolve();

    setLoading(true);
    setError('');

    return getRentalHistory()
      .then((data) => {
        const metaMap = getRentalMetaMap();
        const merged = (Array.isArray(data) ? data : []).map((rental) => {
          const meta = metaMap[String(rental?.id)];
          return meta ? { ...rental, __meta: meta } : rental;
        });
        setRentals(merged);
      })
      .catch(() => setError('Не удалось загрузить историю аренд'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    loadHistory();
  }, [authLoading, isAuthenticated, loadHistory]);

  const handleRentalEnded = useCallback(
    (result) => {
      if (result?.message || result?.total_price != null) {
        const lines = [result.message || 'Аренда завершена'];
        if (result.duration_minutes != null) {
          lines.push(`Длительность: ${result.duration_minutes} мин.`);
        }
        if (result.total_price != null) {
          lines.push(
            `Итого к оплате: ${Number(result.total_price).toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ₽`,
          );
        }
        window.alert(lines.join('\n'));
      }
      loadHistory();
    },
    [loadHistory],
  );

  return (
    <section className={`rentals ${className}`.trim()}>
      {showTitle && <h1>Мои аренды</h1>}

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
        {rentals.map((rental) => (
          <RentalCard key={rental.id} rental={rental} onEnded={handleRentalEnded} />
        ))}
      </ul>
    </section>
  );
};

export default MyRentsSection;
