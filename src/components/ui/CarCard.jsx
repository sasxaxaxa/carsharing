const CarCard = () => {
  return (
    <>
      <div className="car-card">
        <h3 className="car-card__model">Koenigsegg</h3>

        <div className="car-card__info-row">
          <span className="car-card__tag">Sport</span>
          <time className="car-card__year" dateTime="2024">2024</time>
        </div>

        <img className="car-card__image" src="/src/assets/img/card.jpg" alt="Говновоз"/>

        <p className="car-card__number">
          M212MM
          <span className="region">152</span>
        </p>

        <div className="car-card__action-row">
          <span className="car-card__price">
            1990 ₽ /
            <span className="period"> час</span>
          </span>
          <button className="car-card__button">Арендовать</button>
        </div>
      </div>
    </>
  )
}

export default CarCard;