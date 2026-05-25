import PageLayout from '../components/layouts/PageLayout.jsx';
import YandexMap from '../components/map/YandexMap.jsx';
import CarCardList from '../components/groups/CarCardList.jsx';
import MyRentsSection from '../components/rentals/MyRentsSection.jsx';

const HomePage = () => {
  return (
    <PageLayout>
      <section className="home">
        <h1 className="home__title">Автомобили рядом с вами</h1>
        <p className="home__subtitle">Выберите машину на карте или в каталоге ниже</p>
        <YandexMap />
      </section>

      <section className="home__section">
        <CarCardList />
      </section>

      <section className="home__section">
        <MyRentsSection />
      </section>
    </PageLayout>
  );
};

export default HomePage;
