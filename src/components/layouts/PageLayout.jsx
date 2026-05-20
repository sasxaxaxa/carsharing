import Header from './Header.jsx';
import Footer from './Footer.jsx';

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="page-container page-content">{children}</div>
      <Footer />
    </>
  );
};

export default PageLayout;
