import { Plus, RefreshCw, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getEmployees } from '../api/employees.api';
import '../styles/employees.css';

export function EmployeesPage() {
  const navigate = useNavigate();

  const employeesQuery = useQuery({
    queryKey: ['employees', 'list', 1, 20],
    queryFn: () => getEmployees(1, 20),
  });

  const employees = employeesQuery.data?.data ?? [];
  const total = employeesQuery.data?.total ?? 0;

  return (
    <section className="employees-page">
      <div className="employees-heading">
        <div>
          <span className="eyebrow">
            Gestión de personal
          </span>

          <h1>Colaboradores</h1>

          <p>
            Consulta y administra las personas registradas
            en la empresa.
          </p>
        </div>

        <button
          type="button"
          className="primary-action"
          onClick={() => navigate('/employees/new')}
        >
          <Plus size={19} />
          Nuevo colaborador
        </button>
      </div>

      <div className="employees-toolbar">
        <div className="employees-summary">
          <Users size={20} />

          <span>
            {total} colaborador{total === 1 ? '' : 'es'}
          </span>
        </div>

        <button
          type="button"
          className="secondary-action"
          onClick={() => void employeesQuery.refetch()}
          disabled={employeesQuery.isFetching}
        >
          <RefreshCw
            size={18}
            className={
              employeesQuery.isFetching ? 'spin' : ''
            }
          />

          Actualizar
        </button>
      </div>

      <div className="employees-panel">
        {employeesQuery.isPending && (
          <div className="employees-state">
            Cargando colaboradores...
          </div>
        )}

        {employeesQuery.isError && (
          <div className="employees-state error-state">
            No fue posible cargar los colaboradores.
          </div>
        )}

        {!employeesQuery.isPending &&
          !employeesQuery.isError &&
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

        {!employeesQuery.isPending &&
          !employeesQuery.isError &&
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