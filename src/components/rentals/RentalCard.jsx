import { useCallback, useEffect, useMemo, useState } from 'react';
import CarCard from '../ui/CarCard.jsx';
import { endRental } from '../../api/rentals.js';
import { ApiError } from '../../api/http.js';
import { getUserCoordinates } from '../../utils/geo.js';

const STATUS_LABELS = {
  active: 'Активна',
  finished: 'Завершена',
  completed: 'Завершена',
  cancelled: 'Отменена',
};

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—';
  return `${parseFloat(value).toLocaleString('ru-RU')} ₽`;
}

function isActiveRental(rental) {
  return rental.status === 'active';
}

const RentalCard = ({ rental, onEnded }) => {
  const car = rental.car_details;
  const statusLabel = STATUS_LABELS[rental.status] ?? rental.status;
  const [ending, setEnding] = useState(false);
  const [endError, setEndError] = useState('');
  const [tick, setTick] = useState(0);

  const pricePerMinute = useMemo(() => {
    if (!car?.price_per_minute) return 0;
    return parseFloat(car.price_per_minute);
  }, [car]);

  const estimatedMinutes = useMemo(() => {
    if (!isActiveRental(rental) || !rental.start_time) return 0;
    const start = new Date(rental.start_time).getTime();
    return Math.max(0, (Date.now() - start) / 60000);
  }, [rental, tick]);

  const estimatedTotal = useMemo(() => {
    if (!isActiveRental(rental) || !pricePerMinute) return 0;
    return estimatedMinutes * pricePerMinute;
  }, [rental, estimatedMinutes, pricePerMinute]);

  useEffect(() => {
    if (!isActiveRental(rental)) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, [rental]);

  const handleEndRental = useCallback(async () => {
    setEndError('');
    setEnding(true);

    try {
      const { lat, lon } = await getUserCoordinates(car);
      const result = await endRental({
        rental_id: rental.id,
        end_latitude: lat,
        end_longitude: lon,
      });
      onEnded?.(result);
    } catch (err) {
      setEndError(err instanceof ApiError ? err.message : 'Не удалось завершить аренду');
    } finally {
      setEnding(false);
    }
  }, [rental.id, car, onEnded]);

  return (
    <li className="rental-card">
      <div className="rental-card__car">
        {car ? (
          <CarCard car={car} showRentButton={false} />
        ) : (
          <div className="rental-card__placeholder">Авто #{rental.car}</div>
        )}
      </div>

      <div className="rental-card__info">
        <span className={`rental-card__status rental-card__status--${rental.status}`}>
          {statusLabel}
        </span>

        <h3 className="rental-card__title">
          {car ? `${car.brand} ${car.model}` : `Аренда #${rental.id}`}
        </h3>

        <dl className="rental-card__details">
          <div className="rental-card__row">
            <dt>Начало</dt>
            <dd>{formatDateTime(rental.start_time)}</dd>
          </div>
          <div className="rental-card__row">
            <dt>Окончание</dt>
            <dd>{formatDateTime(rental.end_time)}</dd>
          </div>
          {isActiveRental(rental) && (
            <div className="rental-card__row">
              <dt>Сейчас</dt>
              <dd>
                ~{estimatedMinutes.toFixed(1)} мин × {pricePerMinute.toFixed(2)} ₽/мин ≈{' '}
                <strong>{formatPrice(estimatedTotal)}</strong>
                <span className="rental-card__hint"> (оценка до завершения)</span>
              </dd>
            </div>
          )}
          {!isActiveRental(rental) && (
            <div className="rental-card__row rental-card__row--total">
              <dt>Итого</dt>
              <dd>{formatPrice(rental.total_price)}</dd>
            </div>
          )}
        </dl>

        {isActiveRental(rental) && (
          <div className="rental-card__actions">
            <button
              type="button"
              className="rental-card__btn-end"
              onClick={handleEndRental}
              disabled={ending}
            >
              {ending ? 'Завершение...' : 'Завершить аренду'}
            </button>
            <p className="rental-card__geo-hint">
              Координаты конца: браузер попросит геолокацию; если отказ — точка парка машины с карточки.
            </p>
            {endError && <p className="rental-card__end-error">{endError}</p>}
          </div>
        )}
      </div>
    </li>
  );
};

export default RentalCard;
