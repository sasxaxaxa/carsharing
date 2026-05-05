import Button from "../ui/Button.jsx";
const headerLinks = [
  {
    mode: "transparent",
    href: "/catalog",
    label: "Все машины"
  },
  {
    mode: "transparent",
    href: "/my-rents",
    label: "Мои аренды"
  }
]
const headerButtons = [

  {
    href: "/map",
    mode: "transparent--border",
    ariaLabel: "Карта",
    iconName: "map",
  },
  {
    href: "/settings",
    mode: "transparent--border",
    ariaLabel: "Настройки",
    iconName: "settings",
  },
  {
    mode: "transparent--border",
    href: "/register",
    label: "Войти",
    location: "header--login"
  },
]

const Header = () => {
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="/" className="header__logo">
          Morent
        </a>
        <nav className="header__navigation">
          <ul className="header__navigation-list">
            {headerLinks.map(({href, iconName, ariaLabel, label, mode, location}, index) => (
              <li key={index}>
                <Button
                  href={href}
                  iconName={iconName}
                  ariaLabel={ariaLabel}
                  label={label}
                  mode={mode}
                  location={location ? location : "header"}
                  iconSize={36}
                  iconPosition="before"
                />
              </li>
            ))}
          </ul>
          <ul className="header__navigation-list">
            {headerButtons.map(({href, iconName, ariaLabel, label, mode, location}, index) => (
              <li key={index}>
                <Button
                  href={href}
                  iconName={iconName}
                  ariaLabel={ariaLabel}
                  label={label}
                  mode={mode}
                  location={location ? location : "header"}
                  iconSize={36}
                  iconPosition="before"
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header;