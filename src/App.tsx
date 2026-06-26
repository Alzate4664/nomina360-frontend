import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { LoginPage } from './pages/LoginPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { CreateEmployeePage } from './pages/CreateEmployeePage';
import { PayrollNoveltiesPage } from './pages/PayrollNoveltiesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/employees"
              element={<EmployeesPage />}
            />
            
            <Route
            path="/employees/new"
            element={<CreateEmployeePage />}
            />

            <Route
            path="/payroll-novelties"
            element={<PayrollNoveltiesPage />}
            />

            <Route
            path="/payroll-novelties/new"
            element={
              <PlaceholderPage
               title="Nueva novedad"
               description="Aquí construiremos el formulario de creación."
              />
           }
           />

            <Route
              path="/payroll"
              element={
                <PlaceholderPage
                  title="Liquidación de nómina"
                  description="Aquí se procesarán y consultarán las liquidaciones."
                />
              }
            />

            <Route
              path="/reports"
              element={
                <PlaceholderPage
                  title="Reportes"
                  description="Aquí se generarán reportes de nómina y colaboradores."
                />
              }
            />

            <Route
              path="/audit"
              element={
                <PlaceholderPage
                  title="Auditoría"
                  description="Aquí se consultará el historial de acciones realizadas."
                />
              }
            />
          </Route>
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
