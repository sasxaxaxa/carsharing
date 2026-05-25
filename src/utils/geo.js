export const DEFAULT_COORDS = { lat: 55.751574, lon: 37.573856 };

const EARTH_RADIUS_KM = 6371;

export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const STEERING_LABELS = {
  manual: 'Механика',
  automatic: 'Автомат',
  electric: 'Электропривод',
};

export function formatSteering(value) {
  if (!value) return '';
  return STEERING_LABELS[value] || value;
}

export function formatDistance(km) {
  const value = parseFloat(km);
  if (Number.isNaN(value)) return '';
  if (value < 1) {
    const meters = Math.round(value * 1000);
    return meters < 1000 ? `${meters} м` : `${(value).toFixed(2)} км`;
  }
  return `${value.toFixed(2)} км`;
}

export function formatCarLocation(location) {
  if (!location) return '';
  const parts = [location.city, location.street, location.house_number].filter(Boolean);
  return parts.join(', ');
}

/**
 * Координаты [lat, lon] для карты.
 * Для ближайших авто (есть distance) — только location, не GPS-трек.
 */
export function getCarMapCoords(car) {
  const lat = parseFloat(car?.location?.latitude);
  const lon = parseFloat(car?.location?.longitude);
  if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
    return [lat, lon];
  }

  if (car?.distance == null) {
    const lastLat = parseFloat(car?.last_latitude);
    const lastLon = parseFloat(car?.last_longitude);
    if (!Number.isNaN(lastLat) && !Number.isNaN(lastLon)) {
      return [lastLat, lastLon];
    }
  }

  return null;
}

/**
 * Позиция для карты: только реальная геолокация или сохранённый профиль.
 * Без подстановки Москвы — иначе «ближайшие» считаются от центра города.
 */
export function getMapUserPosition(user) {
  const profileLat = parseFloat(user?.last_latitude);
  const profileLon = parseFloat(user?.last_longitude);
  const hasProfile =
    !Number.isNaN(profileLat) && !Number.isNaN(profileLon);

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      if (hasProfile) {
        resolve({ lat: profileLat, lon: profileLon });
        return;
      }
      reject(new Error('Геолокация недоступна'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        if (hasProfile) {
          resolve({ lat: profileLat, lon: profileLon });
          return;
        }
        reject(new Error('Не удалось определить местоположение'));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  });
}

export function getCarCoords(car) {
  const lastLat = parseFloat(car?.last_latitude);
  const lastLon = parseFloat(car?.last_longitude);
  if (!Number.isNaN(lastLat) && !Number.isNaN(lastLon)) {
    return { lat: lastLat, lon: lastLon };
  }

  const lat = parseFloat(car?.location?.latitude);
  const lon = parseFloat(car?.location?.longitude);
  if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
    return { lat, lon };
  }

  return DEFAULT_COORDS;
}

export function getUserCoordinates(car, user) {
  const profileLat = parseFloat(user?.last_latitude);
  const profileLon = parseFloat(user?.last_longitude);
  const carCoords = getCarCoords(car);

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      if (!Number.isNaN(profileLat) && !Number.isNaN(profileLon)) {
        resolve({ lat: profileLat, lon: profileLon });
        return;
      }
      resolve(carCoords);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        if (!Number.isNaN(profileLat) && !Number.isNaN(profileLon)) {
          resolve({ lat: profileLat, lon: profileLon });
          return;
        }
        resolve(carCoords);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 },
    );
  });
}
