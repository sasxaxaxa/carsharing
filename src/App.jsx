import './styles/_reset.scss';
import './styles/_global.scss';
import './styles/_main.scss';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/home" element={<HomePage />}/>
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
