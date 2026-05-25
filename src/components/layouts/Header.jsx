import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const headerLinks = [
  {
    mode: 'transparent',
    href: '/catalog',
    label: 'Все машины',
  },
  {
    mode: 'transparent',
    href: '/my-rents',
    label: 'Мои аренды',
  },
];

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  const headerButtons = [
    {
      href: '/map',
      mode: 'transparent--border',
      ariaLabel: 'Карта',
      iconName: 'map',
    },
    {
      href: '/settings',
      mode: 'transparent--border',
      ariaLabel: 'Настройки',
      iconName: 'settings',
    },
    isAuthenticated
      ? {
          mode: 'transparent--border',
          label: 'Выйти',
          location: 'header--login',
          onClick: logout,
        }
      : {
          mode: 'transparent--border',
          href: '/login',
          label: 'Войти',
          location: 'header--login',
        },
  ];

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo">
          Morent
        </Link>
        <nav className="header__navigation">
          <ul className="header__navigation-list">
            {headerLinks.map(({ href, iconName, ariaLabel, label, mode, location }, index) => (
              <li key={index}>
                <Button
                  href={href}
                  iconName={iconName}
                  ariaLabel={ariaLabel}
                  label={label}
                  mode={mode}
                  location={location ?? 'header'}
                  iconSize={36}
                  iconPosition="before"
                />
              </li>
            ))}
          </ul>
          <ul className="header__navigation-list">
            {headerButtons.map(
              ({ href, iconName, ariaLabel, label, mode, location, onClick }, index) => (
                <li key={index}>
                  <Button
                    href={href}
                    iconName={iconName}
                    ariaLabel={ariaLabel}
                    label={label}
                    mode={mode}
                    location={location ?? 'header'}
                    iconSize={36}
                    iconPosition="before"
                    onClick={onClick}
                  />
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
