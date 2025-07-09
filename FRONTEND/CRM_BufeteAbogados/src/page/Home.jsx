import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; 
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>CRM Bufete Abogados</h1>
        <p>Gestione fácilmente sus clientes con un estilo clásico y cómodo</p>
      </header>

      <main className="home-main">
        <button
          className="home-button"
          onClick={() => navigate('/clientes')}
        >
          ➕ Ingresar Nuevo Cliente
        </button>

        <button
          className="home-button"
          disabled
        >
          📋 Ver Lista de Clientes (próximamente)
        </button>

        <button
          className="home-button"
          disabled
        >
          ⚙️ Ajustes del Sistema (próximamente)
        </button>
      </main>

      <footer className="home-footer">
        <p>© 2025 Bufete Abogados CRM - Interfaz clásica para un manejo moderno</p>
      </footer>
    </div>
  );
}
