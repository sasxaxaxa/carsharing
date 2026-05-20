import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, CAR_IMAGE_FALLBACK, getMediaUrl } from '../../api/http.js';
import { startRental } from '../../api/rentals.js';
import { updateUserLocation } from '../../api/users.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getCarCoords } from '../../utils/geo.js';

function formatTag(tag) {
  if (!tag?.name) return '';
  return tag.name.charAt(0).toUpperCase() + tag.name.slice(1);
}

const CarCard = ({ car, onRented, showRentButton = true, className = '' }) => {
  const { isAuthenticated, user } = useAuth();
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
  const licenseMismatch =
    isAuthenticated && user?.license_category && car.required_license
      ? user.license_category !== car.required_license
      : false;
  const notVerified = isAuthenticated && user && !user.is_verified;

  const handleImageError = () => {
    setImageSrc(CAR_IMAGE_FALLBACK);
  };

  const handleRent = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user?.is_verified) {
      setMessage('Аккаунт не верифицирован. Дождитесь проверки документов.');
      return;
    }

    if (licenseMismatch) {
      setMessage(
        `Нужна категория прав ${car.required_license_display || car.required_license}`,
      );
      return;
    }

    setRenting(true);
    setMessage('');

    try {
      const { lat, lon } = getCarCoords(car);

      await updateUserLocation({ latitude: lat, longitude: lon }).catch(() => {});

      const result = await startRental({
        car_id: car.id,
        services: [],
        user_latitude: lat,
        user_longitude: lon,
      });
      setMessage(result.message || 'Аренда начата');
      onRented?.(car);
      navigate('/my-rents');
    } catch (err) {
      const text = err instanceof ApiError ? err.message : 'Не удалось начать аренду';
      setMessage(text);
    } finally {
      setRenting(false);
    }
  };

  const rentDisabled = renting || car.status !== 'available';

  const rentHint = (() => {
    if (!isAuthenticated) return null;
    if (notVerified) return 'Аккаунт не верифицирован — аренда недоступна.';
    if (licenseMismatch) {
      return `Нужна категория прав ${car.required_license_display || car.required_license}.`;
    }
    return null;
  })();

  return (
    <div className={`car-card ${className}`.trim()}>
      <h3 className="car-card__model">{title}</h3>

      <div className="car-card__info-row">
        {tagLabel && <span className="car-card__tag">{tagLabel}</span>}
        <time className="car-card__year" dateTime={String(car.year)}>
          {car.year}
        </time>
      </div>

      {car.required_license_display && (
        <p className="car-card__license">{car.required_license_display}</p>
      )}

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
            disabled={rentDisabled}
          >
            {renting ? 'Бронирование...' : 'Арендовать'}
          </button>
        </div>
      )}

      {rentHint && <p className="car-card__hint">{rentHint}</p>}

      {!showRentButton && (
        <p className="car-card__price car-card__price--solo">
          {car.price_per_minute} ₽ / <span className="period">мин</span>
        </p>
      )}

      {message && <p className="car-card__message car-card__message--visible">{message}</p>}
    </div>
  );
};

export default CarCard;
