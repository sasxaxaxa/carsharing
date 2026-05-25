import { getAllCars, getNearestCars } from '../api/cars.js';
import { haversineKm } from './geo.js';

/**
 * Бэкенд (NearestCarFinder) считает distance и radius в градусах (евклид),
 * не в км — см. morent-backend cars/services.py.
 * На клиенте всегда пересчитываем расстояние и фильтруем по радиусу в км.
 */
function applyKmRadiusFilter(items, userLat, userLon, radiusKm, limit) {
  return items
    .map((item) => {
      const lat = parseFloat(item?.location?.latitude);
      const lon = parseFloat(item?.location?.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
      const distanceKm = haversineKm(userLat, userLon, lat, lon);
      return { ...item, distance: distanceKm };
    })
    .filter((car) => car && car.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

function normalizeNearestResponse(data) {
  if (!data) return [];
  const cars = data.cars ?? data.results ?? [];
  return Array.isArray(cars) ? cars : [];
}

function mergeNearestWithDetails(item, full) {
  if (!full) return { ...item };

  const {
    last_latitude: _a,
    last_longitude: _b,
    location: _c,
    distance: _d,
    ...fullRest
  } = full;

  return {
    ...fullRest,
    ...item,
    distance: item.distance,
    location: item.location ?? full.location,
  };
}

export async function fetchNearestCars(
  { latitude, longitude, limit = 20, radius: radiusKm = 5 },
  listParams = {},
) {
  const hasLicenseFilter = Boolean(listParams.license_category);
  const poolLimit = 100;

  let pool = [];

  try {
    const nearestRaw = await getNearestCars({
      latitude,
      longitude,
      limit: poolLimit,
    });
    pool = normalizeNearestResponse(nearestRaw);
  } catch {
    pool = [];
  }

  let cars = applyKmRadiusFilter(pool, latitude, longitude, radiusKm, limit);

  if (cars.length === 0) {
    const allCars = await getAllCars(listParams).catch(() => []);
    const available = allCars.filter((car) => car.status === 'available');
    cars = applyKmRadiusFilter(available, latitude, longitude, radiusKm, limit);
  }

  if (cars.length > 0 && (hasLicenseFilter || cars.some((c) => !c.tags?.length))) {
    const details = await getAllCars(listParams).catch(() => []);
    const detailsById = new Map(details.map((car) => [car.id, car]));
    cars = cars
      .map((item) => {
        const full = detailsById.get(item.id);
        if (hasLicenseFilter && !full) return null;
        return mergeNearestWithDetails(item, full);
      })
      .filter(Boolean);
  }

  return {
    count: cars.length,
    cars,
  };
}
