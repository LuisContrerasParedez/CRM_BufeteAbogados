import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Clientes from './page/Clientes';
import Login from './page/Login';
import RutaProtegida from './components/RutaProtegida';
import Cuenta from './page/Cuenta';
import Pagos from './page/Pagos'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RutaProtegida>
              <Home />
            </RutaProtegida>
          }
        />
        <Route
          path="/clientes"
          element={
            <RutaProtegida>
              <Clientes />
            </RutaProtegida>
          }
        />
        <Route
          path="/cuenta"
          element={
            <RutaProtegida>
              <Cuenta />
            </RutaProtegida>
          }
        />
        <Route
          path="/pagos"
          element={
            <RutaProtegida>
              <Pagos />
            </RutaProtegida>
          }
        />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
