import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, CAR_IMAGE_FALLBACK, getMediaUrl } from '../../api/http.js';
import { startRental } from '../../api/rentals.js';
import { useAuth } from '../../context/AuthContext.jsx';

function formatTag(tag) {
  if (!tag?.name) return '';
  return tag.name.charAt(0).toUpperCase() + tag.name.slice(1);
}

const CarCard = ({ car, onRented, showRentButton = true, className = '' }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [renting, setRenting] = useState(false);
  const [message, setMessage] = useState('');
  const [imageSrc, setImageSrc] = useState(() => getMediaUrl(car?.main_image));

  useEffect(() => {
    setImageSrc(getMediaUrl(car?.main_image));
  }, [car?.id, car?.main_image]);

  if (!car) return null;

  const title = `${car.brand} ${car.model}`;
  const tagLabel = car.tags?.[0] ? formatTag(car.tags[0]) : '';

  const handleImageError = () => {
    setImageSrc(CAR_IMAGE_FALLBACK);
  };

  const handleRent = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRenting(true);
    setMessage('');

    try {
      const result = await startRental({ car_id: car.id, services: [] });
      setMessage(result.message || 'Аренда начата');
      onRented?.(car);
    } catch (err) {
      const text = err instanceof ApiError ? err.message : 'Не удалось начать аренду';
      setMessage(text);
    } finally {
      setRenting(false);
    }
  };

  return (
    <div className={`car-card ${className}`.trim()}>
      <h3 className="car-card__model">{title}</h3>

      <div className="car-card__info-row">
        {tagLabel && <span className="car-card__tag">{tagLabel}</span>}
        <time className="car-card__year" dateTime={String(car.year)}>
          {car.year}
        </time>
      </div>

      <img
        className="car-card__image"
        src={imageSrc}
        alt={title}
        onError={handleImageError}
      />

      <p className="car-card__number">{car.plate_number}</p>

      {showRentButton && (
        <div className="car-card__action-row">
          <span className="car-card__price">
            {car.price_per_minute} ₽ /
            <span className="period"> мин</span>
          </span>
          <button
            type="button"
            className="car-card__button"
            onClick={handleRent}
            disabled={renting || car.status !== 'available'}
          >
            {renting ? 'Бронирование...' : 'Арендовать'}
          </button>
        </div>
      )}

      {!showRentButton && (
        <p className="car-card__price car-card__price--solo">
          {car.price_per_minute} ₽ / <span className="period">мин</span>
        </p>
      )}

      {message && <p className="car-card__message">{message}</p>}
    </div>
  );
};

export default CarCard;
