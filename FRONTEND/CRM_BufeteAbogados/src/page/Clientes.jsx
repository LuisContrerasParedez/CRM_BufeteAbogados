import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClientes,
  createCliente,
  deleteCliente,
} from '../store/clientes';
import { useNavigate } from 'react-router-dom';
import '../styles/Clientes.css';

export default function Clientes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientes, loading } = useSelector((state) => state.cliente);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  });

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const manejarEnvio = (e) => {
    e.preventDefault();
    dispatch(createCliente({ ...nuevo, telefono: +nuevo.telefono }));
    setNuevo({ nombre: '', apellido: '', telefono: '' });
  };

  return (
    <div className="clientes-container">
      <div className="clientes-content">
        <header className="clientes-header">
          <h1>Gestión de Clientes</h1>
          <p>Registre y administre sus clientes fácilmente</p>
        </header>

        <form className="clientes-form" onSubmit={manejarEnvio}>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apellido"
            value={nuevo.apellido}
            onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
          />
          <input
            type="number"
            placeholder="Teléfono"
            value={nuevo.telefono}
            onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
          />
          <button type="submit">➕ Crear Cliente</button>
        </form>

        <section className="clientes-lista">
          {loading ? (
            <p className="clientes-cargando">Cargando clientes...</p>
          ) : clientes.length === 0 ? (
            <p>No hay clientes registrados.</p>
          ) : (
            <ul>
              {clientes.map((c) => (
                <li key={c.id}>
                  <span>{c.nombre} {c.apellido} - {c.telefono}</span>
                  <button onClick={() => dispatch(deleteCliente(c.id))}>
                    ❌ Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <button className="clientes-volver" onClick={() => navigate('/')}>
          ⬅️ Volver al Inicio
        </button>

        <footer className="clientes-footer">
          <p>© 2025 Bufete Abogados CRM</p>
        </footer>
      </div>
    </div>
  );
}
