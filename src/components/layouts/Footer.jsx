const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">Morent — каршеринг</p>
        <p className="footer__copy">© {new Date().getFullYear()} Учебный проект, 4 курс</p>
        <nav className="footer__nav">
          <a href="/">Карта</a>
          <a href="/catalog">Каталог</a>
          <a href="/my-rents">Мои аренды</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
