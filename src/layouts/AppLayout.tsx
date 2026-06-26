import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Building2,
  Calculator,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import '../styles/app-layout.css';

const menuItems = [
  {
    label: 'Inicio',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Colaboradores',
    path: '/employees',
    icon: Users,
  },
  {
    label: 'Novedades',
    path: '/payroll-novelties',
    icon: ClipboardList,
  },
  {
    label: 'Liquidación',
    path: '/payroll',
    icon: Calculator,
  },
  {
    label: 'Reportes',
    path: '/reports',
    icon: FileSpreadsheet,
  },
  {
    label: 'Auditoría',
    path: '/audit',
    icon: ShieldCheck,
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedUser = sessionStorage.getItem('authUser');

  const user = storedUser
    ? JSON.parse(storedUser)
    : {
        name: 'Administrador',
        role: 'OWNER',
      };

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">N360</span>

            <div>
              <strong>Nómina360</strong>
              <span>Gestión empresarial</span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <div className="company-card">
          <Building2 size={20} />

          <div>
            <span>Empresa activa</span>
            <strong>Nomina360 Demo SAS</strong>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-link active'
                    : 'sidebar-link'
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-summary">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>

            <div>
              <strong>{user.name || 'Administrador'}</strong>
              <span>{user.role || 'OWNER'}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        />
      )}

      <div className="main-area">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={23} />
          </button>

          <div>
            <span className="topbar-subtitle">
              Panel administrativo
            </span>
            <strong>Nómina360</strong>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            Sistema operativo
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


