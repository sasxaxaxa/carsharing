import { getMediaUrl } from '../api/http.js';

const CAR_IMAGES = [
  '/images/cars/car-1.jpg',
  '/images/cars/car-2.jpg',
  '/images/cars/car-3.jpg',
];

const MOTORCYCLE_IMAGES = ['/images/motorcycle-1.jpg', '/images/motorcycle-2.jpg'];

const TRUCK_IMAGES = ['/images/truck-1.png', '/images/truck-2.png'];

const UNAVAILABLE_HOSTS = ['loremflickr.com', 'placehold.co'];

/** A — мото, B — легковые, C — грузовые (поле required_license с API). */
export function getVehicleType(car) {
  const license = String(car?.required_license ?? '').toUpperCase();
  if (license === 'A') return 'motorcycle';
  if (license === 'C') return 'truck';
  return 'car';
}

function pickFromPool(pool, carId) {
  const index = Math.abs(Number(carId) || 0) % pool.length;
  return pool[index];
}

export function isUnavailableImageUrl(path) {
  if (!path || typeof path !== 'string') return true;
  const lower = path.toLowerCase();
  return UNAVAILABLE_HOSTS.some((host) => lower.includes(host));
}

export function getCarPlaceholderUrl(car) {
  const type = getVehicleType(car);

  switch (type) {
    case 'motorcycle':
      return pickFromPool(MOTORCYCLE_IMAGES, car?.id);
    case 'truck':
      return pickFromPool(TRUCK_IMAGES, car?.id);
    default:
      return pickFromPool(CAR_IMAGES, car?.id);
  }
}

/**
 * URL для <img>: main_image с API или локальная заглушка по типу транспорта.
 */
export function getCarImageUrl(car) {
  const raw = car?.main_image;

  if (isUnavailableImageUrl(raw)) {
    return getCarPlaceholderUrl(car);
  }

  const resolved = getMediaUrl(raw);

  if (isUnavailableImageUrl(resolved)) {
    return getCarPlaceholderUrl(car);
  }

  return resolved;
}
