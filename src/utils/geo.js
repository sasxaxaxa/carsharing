export const DEFAULT_COORDS = { lat: 55.751574, lon: 37.573856 };

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
