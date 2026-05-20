import { useCallback, useEffect, useMemo, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { getAllCars } from '../../api/cars.js';
import { CarFilterIterator } from '../../patterns/iterator/CarFilterIterator.js';
import { useAuth } from '../../context/AuthContext.jsx';
import CarCard from '../ui/CarCard.jsx';

const DEFAULT_CENTER = [55.751574, 37.573856];

function getCarCoords(car) {
  const lat = parseFloat(car?.location?.latitude);
  const lon = parseFloat(car?.location?.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return [lat, lon];
}

const YandexMap = () => {
  const { user, isAuthenticated } = useAuth();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

  const loadCars = useCallback(() => {
    setLoading(true);
    setError('');

    const params =
      isAuthenticated && user?.license_category
        ? { license_category: user.license_category }
        : {};

    return getAllCars(params)
      .then((data) => {
        const iterator = new CarFilterIterator(data, (car) => car.status === 'available');
        setCars(iterator.toArray());
      })
      .catch(() => setError('Не удалось загрузить автомобили'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user?.license_category]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const placemarks = useMemo(
    () =>
      cars
        .map((car) => {
          const coords = getCarCoords(car);
          if (!coords) return null;
          return { id: car.id, coords, car };
        })
        .filter(Boolean),
    [cars],
  );

  const mapCenter = placemarks[0]?.coords ?? DEFAULT_CENTER;

  const handlePlacemarkClick = (car) => {
    setSelectedCar(car);
  };

  const handleCloseOverlay = () => {
    setSelectedCar(null);
  };

  const handleRented = () => {
    loadCars().then(() => setSelectedCar(null));
  };

  if (!apiKey) {
    return <div>Ошибка: отсутствует ключ API для Яндекс.Карт (VITE_YANDEX_MAPS_API_KEY)</div>;
  }

  return (
    <div className="map">
      {loading && <p className="map__status">Загрузка автомобилей...</p>}
      {error && <p className="map__status map__status--error">{error}</p>}

      <YMaps query={{ apikey: apiKey, lang: 'ru_RU' }}>
        <div className="map__container">
          <Map
            defaultState={{ center: mapCenter, zoom: 11 }}
            width="100%"
            height="100%"
          >
            {placemarks.map((mark) => (
              <Placemark
                key={mark.id}
                geometry={mark.coords}
                options={{ preset: 'islands#blueAutoIcon' }}
                onClick={() => handlePlacemarkClick(mark.car)}
              />
            ))}
          </Map>

          {selectedCar && (
            <>
              <button
                type="button"
                className="map__backdrop"
                aria-label="Закрыть"
                onClick={handleCloseOverlay}
              />
              <div className="map__overlay" role="dialog" aria-label="Карточка автомобиля">
                <button
                  type="button"
                  className="map__overlay-close"
                  aria-label="Закрыть"
                  onClick={handleCloseOverlay}
                >
                  ×
                </button>
                <CarCard car={selectedCar} onRented={handleRented} className="car-card--map" />
              </div>
            </>
          )}
        </div>
      </YMaps>

      {!loading && !error && (
        <p className="map__legend">На карте: {placemarks.length} автомобилей · нажмите на метку</p>
      )}
    </div>
  );
};

export default YandexMap;
