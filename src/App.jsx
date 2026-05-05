import './styles/_reset.scss';
import './styles/_global.scss';
import './styles/_main.scss';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import MyRentsPage from "./pages/MyRentsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/my-rents" element={<MyRentsPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        </BrowserRouter>
    </>
  );
}

export default App;
