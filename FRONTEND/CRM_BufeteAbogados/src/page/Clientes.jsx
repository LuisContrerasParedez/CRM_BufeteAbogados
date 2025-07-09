import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClientes,
  createCliente,
  deleteCliente,
} from '../store/clientes';

export default function Clientes() {
  const dispatch = useDispatch();
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
    <div style={{ padding: 20 }}>
      <h2>Lista de Clientes</h2>

      <form onSubmit={manejarEnvio} style={{ marginBottom: 20 }}>
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
        <button type="submit">Crear</button>
      </form>

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <ul>
          {clientes.map((c) => (
            <li key={c.id}>
              {c.nombre} {c.apellido} - {c.telefono}
              <button onClick={() => dispatch(deleteCliente(c.id))}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
