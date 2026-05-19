import Header from '../components/layouts/Header.jsx';
import CarCardList from '../components/groups/CarCardList.jsx';

const CatalogPage = () => {
  return (
    <>
      <Header />
      <div className="page-container">
        <CarCardList />
      </div>
    </>
  );
};

export default CatalogPage;
