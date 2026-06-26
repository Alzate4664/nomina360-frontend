import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <main style={{ padding: '40px' }}>
      <h1>Panel principal de Nómina360</h1>

      <p>
        Inicio de sesión realizado correctamente.
      </p>

      <button onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  );
}
