import PageLayout from '../components/layouts/PageLayout.jsx';
import YandexMap from '../components/map/YandexMap.jsx';

const MapPage = () => {
  return (
    <PageLayout>
      <section className="map-page">
        <YandexMap />
      </section>
    </PageLayout>
  );
};

export default MapPage;
