import { useCallback, useEffect, useMemo, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { getCarDetail } from '../../api/cars.js';
import { updateUserLocation } from '../../api/users.js';
import { fetchNearestCars } from '../../utils/nearestCars.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  DEFAULT_COORDS,
  formatDistance,
  getCarMapCoords,
  getMapUserPosition,
} from '../../utils/geo.js';
import CarCard from '../ui/CarCard.jsx';
import Button from '../ui/Button.jsx';

const DEFAULT_CENTER = [DEFAULT_COORDS.lat, DEFAULT_COORDS.lon];
const NEAREST_LIMIT = 20;
const NEAREST_RADIUS_KM = 5;

const YandexMap = () => {
  const { user, isAuthenticated } = useAuth();
  const [cars, setCars] = useState([]);
  const [userCenter, setUserCenter] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [radiusKm, setRadiusKm] = useState(NEAREST_RADIUS_KM);

  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

  const listParams = useMemo(() => {
    if (isAuthenticated && user?.license_category) {
      return { license_category: user.license_category };
    }
    return {};
  }, [isAuthenticated, user?.license_category]);

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { lat, lon } = await getMapUserPosition(user);
      setUserCenter([lat, lon]);

      if (isAuthenticated) {
        updateUserLocation({ latitude: lat, longitude: lon }).catch(() => {});
      }

      const { cars: nearest } = await fetchNearestCars(
        {
          latitude: lat,
          longitude: lon,
          limit: NEAREST_LIMIT,
          radius: radiusKm,
        },
        listParams,
      );

      const available = nearest.filter((car) => !car.status || car.status === 'available');
      setCars(available);

      if (available.length === 0) {
        setError(`В радиусе ${radiusKm} км нет доступных автомобилей. Увеличьте радиус.`);
      }
    } catch (err) {
      const isGeo =
        err?.message?.includes('местоположен') ||
        err?.message?.includes('Геолокация');
      setError(
        isGeo
          ? 'Включите доступ к геолокации в браузере и нажмите «Обновить».'
          : 'Не удалось найти ближайшие автомобили. Повторите позже.',
      );
      setCars([]);
      setUserCenter(null);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, listParams, radiusKm]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const placemarks = useMemo(
    () =>
      cars
        .map((car) => {
          const coords = getCarMapCoords(car);
          if (!coords) return null;
          return { id: car.id, coords, car };
        })
        .filter(Boolean),
    [cars],
  );

  const mapCenter = userCenter ?? placemarks[0]?.coords ?? DEFAULT_CENTER;

  const handlePlacemarkClick = async (car) => {
    setSelectedCar(car);
    setDetailLoading(true);

    try {
      const full = await getCarDetail(car.id);
      setSelectedCar({ ...full, distance: car.distance });
    } catch {
      setSelectedCar(car);
    } finally {
      setDetailLoading(false);
    }
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
      <div className="map__toolbar">
        <label className="map__radius">
          Радиус поиска:
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            disabled={loading}
          >
            <option value={1}>1 км</option>
            <option value={3}>3 км</option>
            <option value={5}>5 км</option>
            <option value={10}>10 км</option>
            <option value={20}>20 км</option>
          </select>
        </label>
        <Button
          type="button"
          mode="primary"
          location="map-toolbar"
          label={loading ? 'Поиск...' : 'Обновить'}
          onClick={loadCars}
          disabled={loading}
        />
      </div>

      {loading && <p className="map__status">Ищем ближайшие автомобили...</p>}
      {error && (
        <div className="map__alert map__status--error">
          <p className="map__alert-text">{error}</p>
          <Button
            type="button"
            mode="primary"
            location="map-retry"
            label="Повторить"
            onClick={loadCars}
            disabled={loading}
          />
        </div>
      )}

      <YMaps query={{ apikey: apiKey, lang: 'ru_RU' }}>
        <div className="map__container">
          <Map
            key={`${mapCenter[0]}-${mapCenter[1]}-${radiusKm}`}
            defaultState={{ center: mapCenter, zoom: 12 }}
            width="100%"
            height="100%"
          >
            {userCenter && (
              <Placemark
                geometry={userCenter}
                options={{ preset: 'islands#greenCircleDotIcon' }}
                properties={{ hintContent: 'Вы здесь', balloonContent: 'Ваше местоположение' }}
              />
            )}
            {placemarks.map((mark) => (
              <Placemark
                key={mark.id}
                geometry={mark.coords}
                options={{ preset: 'islands#blueAutoIcon' }}
                properties={{
                  hintContent: `${mark.car.brand} ${mark.car.model}`,
                  balloonContent:
                    mark.car.distance != null ? `≈ ${formatDistance(mark.car.distance)}` : '',
                }}
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
                {detailLoading ? (
                  <p className="map__status">Загрузка карточки...</p>
                ) : (
                  <CarCard car={selectedCar} onRented={handleRented} className="car-card--map" />
                )}
              </div>
            </>
          )}
        </div>
      </YMaps>

      {!loading && !error && userCenter && (
        <p className="map__legend">
          В радиусе {radiusKm} км от вас: {placemarks.length}{' '}
          {placemarks.length === 1 ? 'автомобиль' : 'автомобилей'} · нажмите на метку
          {isAuthenticated && user?.license_category && ` · права: ${user.license_category}`}
        </p>
      )}
    </div>
  );
};

export default YandexMap;
