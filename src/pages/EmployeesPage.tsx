import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Users } from 'lucide-react';
import { getEmployees } from '../api/employees.api';
import type { Employee } from '../types/employee.types';
import '../styles/employees.css';

export function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEmployees = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch {
      setError(
        'No fue posible cargar los colaboradores.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  return (
    <section className="employees-page">
      <div className="employees-heading">
        <div>
          <span className="eyebrow">Gestión de personal</span>
          <h1>Colaboradores</h1>
          <p>
            Consulta y administra las personas registradas
            en la empresa.
          </p>
        </div>

        <button className="primary-action" onClick={() => navigate('/employees/new')}>
          <Plus size={19} />
          Nuevo colaborador
        </button>
      </div>

      <div className="employees-toolbar">
        <div className="employees-summary">
          <Users size={20} />
          <span>
            {employees.length} colaborador
            {employees.length === 1 ? '' : 'es'}
          </span>
        </div>

        <button
          className="secondary-action"
          onClick={() => void loadEmployees()}
          disabled={isLoading}
        >
          <RefreshCw
            size={18}
            className={isLoading ? 'spin' : ''}
          />
          Actualizar
        </button>
      </div>

      <div className="employees-panel">
        {isLoading && (
          <div className="employees-state">
            Cargando colaboradores...
          </div>
        )}

        {!isLoading && error && (
          <div className="employees-state error-state">
            {error}
          </div>
        )}

        {!isLoading &&
          !error &&
          employees.length === 0 && (
            <div className="employees-state">
              <Users size={42} />
              <strong>
                No hay colaboradores registrados
              </strong>
              <p>
                Registra el primero para comenzar a gestionar
                la nómina.
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          employees.length > 0 && (
            <div className="employees-table-wrapper">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Cargo</th>
                    <th>Contrato</th>
                    <th>Salario base</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <strong>
                          {employee.firstName}{' '}
                          {employee.lastName}
                        </strong>
                        <span>
                          {employee.email || 'Sin correo'}
                        </span>
                      </td>

                      <td>
                        {employee.documentType}{' '}
                        {employee.documentNumber}
                      </td>

                      <td>
                        <strong>{employee.position}</strong>
                        <span>
                          {employee.department ||
                            'Sin departamento'}
                        </span>
                      </td>

                      <td>{employee.contractType}</td>

                      <td>
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0,
                        }).format(
                          Number(employee.baseSalary),
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-pill ${
                            employee.status === 'ACTIVE'
                              ? 'active-status'
                              : 'inactive-status'
                          }`}
                        >
                          {employee.status === 'ACTIVE'
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </section>
  );
}

