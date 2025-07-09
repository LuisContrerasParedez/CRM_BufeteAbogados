import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home';
import Clientes from './page/Clientes'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
