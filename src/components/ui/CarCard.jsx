import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../../api/http.js';
import { getCarImageUrl, getCarPlaceholderUrl } from '../../utils/carImage.js';
import { startRental } from '../../api/rentals.js';
import { updateUserLocation } from '../../api/users.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  formatCarLocation,
  formatDistance,
  formatSteering,
  getUserCoordinates,
} from '../../utils/geo.js';
import { BaseRental } from '../../patterns/decorator/BaseRental.js';
import {
  SERVICE_OPTIONS,
  buildDecoratedRental,
} from '../../patterns/decorator/RentalDecorators.js';
import { setRentalMeta } from '../../utils/rentalMeta.js';

function formatTag(tag) {
  if (!tag?.name) return '';
  return tag.name.charAt(0).toUpperCase() + tag.name.slice(1);
}

const CarCard = ({ car, onRented, showRentButton = true, className = '' }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [renting, setRenting] = useState(false);
  const [message, setMessage] = useState('');
  const [imageSrc, setImageSrc] = useState(() => getCarImageUrl(car));
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    setImageSrc(getCarImageUrl(car));
  }, [car?.id, car?.main_image]);

  if (!car) return null;

  const title = `${car.brand} ${car.model}`;
  const tagLabels = (car.tags ?? []).map(formatTag).filter(Boolean);
  const locationLabel = formatCarLocation(car.location);
  const distanceLabel = car.distance != null ? formatDistance(car.distance) : '';
  const steeringLabel = formatSteering(car.steering);
  const licenseMismatch =
    isAuthenticated && user?.license_category && car.required_license
      ? user.license_category !== car.required_license
      : false;
  const notVerified = isAuthenticated && user && !user.is_verified;

  const handleImageError = () => {
    setImageSrc(getCarPlaceholderUrl(car));
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
      const { lat, lon } = await getUserCoordinates(car, user);

      await updateUserLocation({ latitude: lat, longitude: lon }).catch(() => {});

      const result = await startRental({
        car_id: car.id,
        services: selectedServices,
        user_latitude: lat,
        user_longitude: lon,
      });

      if (result?.rental_id) {
        setRentalMeta(result.rental_id, {
          services: selectedServices,
          services_text: result.services,
          price_per_minute: result.price_per_minute,
          total_with_services: result.total_with_services,
          car_id: car.id,
        });
      }

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

  const decorated = (() => {
    const base = new BaseRental({ pricePerMinute: car.price_per_minute });
    return buildDecoratedRental(base, selectedServices);
  })();

  const totalPerMinute = decorated.getPricePerMinute();
  const servicesLabel =
    selectedServices.length > 0
      ? decorated.getDescription().replace(/^Аренда\s*\+\s*/, '')
      : 'Без доп. услуг';

  const toggleService = (key) => {
    setSelectedServices((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  return (
    <div className={`car-card ${className}`.trim()}>
      <h3 className="car-card__model">{title}</h3>

      <div className="car-card__info-row">
        {tagLabels.length > 0 ? (
          <div className="car-card__tags">
            {tagLabels.map((label) => (
              <span key={label} className="car-card__tag">
                {label}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}
        <time className="car-card__year" dateTime={String(car.year)}>
          {car.year}
        </time>
      </div>

      {(distanceLabel || locationLabel) && (
        <p className="car-card__meta">
          {distanceLabel && <span className="car-card__distance">≈ {distanceLabel}</span>}
          {distanceLabel && locationLabel && ' · '}
          {locationLabel}
        </p>
      )}

      {(car.capacity || steeringLabel || car.gasoline) && (
        <p className="car-card__specs">
          {car.capacity && <span>{car.capacity} мест</span>}
          {steeringLabel && <span>{steeringLabel}</span>}
          {car.gasoline && <span>{car.gasoline}</span>}
        </p>
      )}

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
        <div className="car-card__services">
          <p className="car-card__services-title">Доп. услуги</p>
          <div className="car-card__services-grid">
            {SERVICE_OPTIONS.map((opt) => (
              <label key={opt.key} className="car-card__service">
                <input
                  type="checkbox"
                  checked={selectedServices.includes(opt.key)}
                  onChange={() => toggleService(opt.key)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <p className="car-card__services-summary">{servicesLabel}</p>
        </div>
      )}

      {showRentButton && (
        <div className="car-card__action-row">
          <span className="car-card__price">
            {totalPerMinute.toFixed(2)} ₽ /
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
