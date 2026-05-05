import CarCard from "../ui/CarCard.jsx";

const CarCardList = () => {
  return (
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
  )
}

export default CarCardList;