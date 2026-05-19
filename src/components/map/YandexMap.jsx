import { useEffect, useMemo, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { getAllCars } from '../../api/cars.js';

const DEFAULT_CENTER = [55.751574, 37.573856];

function getCarCoords(car) {
  const lat = parseFloat(car?.location?.latitude);
  const lon = parseFloat(car?.location?.longitude);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return [lat, lon];
}

const YandexMap = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

  useEffect(() => {
    let cancelled = false;

    getAllCars()
      .then((data) => {
        if (!cancelled) setCars(data);
      })
      .catch(() => {
        if (!cancelled) setError('Не удалось загрузить автомобили');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const placemarks = useMemo(
    () =>
      cars
        .map((car) => {
          const coords = getCarCoords(car);
          if (!coords) return null;
          const tag = car.tags?.[0]?.name ?? '';
          return {
            id: car.id,
            coords,
            balloon: `${car.brand} ${car.model}<br/>${car.plate_number}<br/>${car.price_per_minute} ₽/мин${tag ? `<br/>${tag}` : ''}`,
          };
        })
        .filter(Boolean),
    [cars],
  );

  const mapCenter = placemarks[0]?.coords ?? DEFAULT_CENTER;

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
                properties={{ balloonContent: mark.balloon }}
              />
            ))}
          </Map>
        </div>
      </YMaps>

      {!loading && !error && (
        <p className="map__legend">На карте: {placemarks.length} автомобилей</p>
      )}
    </div>
  );
};

export default YandexMap;
