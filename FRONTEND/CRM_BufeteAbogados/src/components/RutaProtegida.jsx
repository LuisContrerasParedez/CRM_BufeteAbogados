import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RutaProtegida({ children }) {
  const token = useSelector((state) => state.login.token) || localStorage.getItem('token');

  return token ? children : <Navigate to="/login" replace />;
}
