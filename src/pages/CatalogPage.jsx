import Header from "../components/layouts/Header.jsx";
import CarCard from "../components/ui/CarCard.jsx";

const CatalogPage = () => {
  return (
    <>
      <Header/>
      <div className="page-container">
        <div className="catalog">
          <div className="catalog__list">
            <ul>
              <li>
                <CarCard/>
              </li>
              <li>
                <CarCard/>
              </li>
              <li>
                <CarCard/>
              </li>
              <li>
                <CarCard/>
              </li>
              <li>
                <CarCard/>
              </li>
              <li>
                <CarCard/>
              </li>
              <li>
                <CarCard/>
              </li>
              <li>
                <CarCard/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
export default CatalogPage;