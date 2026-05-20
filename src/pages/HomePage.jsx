import PageLayout from '../components/layouts/PageLayout.jsx';
import YandexMap from '../components/map/YandexMap.jsx';

const HomePage = () => {
  return (
    <PageLayout>
      <section className="home">
        <h1 className="home__title">Автомобили рядом с вами</h1>
        <p className="home__subtitle">Выберите машину на карте или в каталоге</p>
        <YandexMap />
      </section>
    </PageLayout>
  );
};

export default HomePage;
