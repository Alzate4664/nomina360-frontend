import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  deletePayrollNovelty,
  getPayrollNovelties,
} from '../api/payroll-novelties.api';
import type {
  PayrollNovelty,
  PayrollNoveltyType,
} from '../types/payroll-novelty.types';
import '../styles/payroll-novelties.css';

const noveltyLabels: Record<
  PayrollNoveltyType,
  string
> = {
  OVERTIME: 'Hora extra',
  NIGHT_SURCHARGE: 'Recargo nocturno',
  SUNDAY_SURCHARGE: 'Recargo dominical',
  HOLIDAY_SURCHARGE: 'Recargo festivo',
  BONUS: 'Bonificación',
  DEDUCTION: 'Descuento',
  ABSENCE: 'Ausencia',
  VACATION: 'Vacaciones',
  SICK_LEAVE: 'Incapacidad',
};

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const currentDate = new Date();

function formatCurrency(value?: string | number | null) {
  if (value === null || value === undefined) {
    return '—';
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function PayrollNoveltiesPage() {
  const navigate = useNavigate();

  const [novelties, setNovelties] = useState<
    PayrollNovelty[]
  >([]);
  const [year, setYear] = useState(
    currentDate.getFullYear(),
  );
  const [month, setMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);

  const loadNovelties = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getPayrollNovelties({
        year,
        month,
        search: search.trim(),
        page: 1,
        limit: 20,
      });

      setNovelties(response.data);
      setTotal(response.total);
    } catch {
      setError(
        'No fue posible cargar las novedades de nómina.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [month, search, year]);

  useEffect(() => {
    void loadNovelties();
  }, [loadNovelties]);

  const handleDelete = async (
    novelty: PayrollNovelty,
  ) => {
    const employeeName =
      `${novelty.employee.firstName} ` +
      novelty.employee.lastName;

    const confirmed = window.confirm(
      `¿Deseas eliminar la novedad de ${employeeName}?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(novelty.id);
    setError('');

    try {
      await deletePayrollNovelty(novelty.id);
      await loadNovelties();
    } catch {
      setError(
        'No fue posible eliminar la novedad.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="novelties-page">
      <div className="novelties-heading">
        <div>
          <span className="eyebrow">
            Gestión de nómina
          </span>

          <h1>Novedades de nómina</h1>

          <p>
            Registra horas extra, recargos,
            ausencias, bonificaciones y descuentos.
          </p>
        </div>

        <button
          className="primary-action"
          onClick={() =>
            navigate('/payroll-novelties/new')
          }
        >
          <Plus size={19} />
          Nueva novedad
        </button>
      </div>

      <div className="novelties-filters">
        <div className="novelty-filter">
          <label htmlFor="noveltyYear">
            Año
          </label>

          <input
            id="noveltyYear"
            type="number"
            min="2024"
            max="2100"
            value={year}
            onChange={(event) =>
              setYear(Number(event.target.value))
            }
          />
        </div>

        <div className="novelty-filter">
          <label htmlFor="noveltyMonth">
            Mes
          </label>

          <select
            id="noveltyMonth"
            value={month}
            onChange={(event) =>
              setMonth(Number(event.target.value))
            }
          >
            {monthNames.map((name, index) => (
              <option
                key={name}
                value={index + 1}
              >
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="novelty-search">
          <label htmlFor="noveltySearch">
            Buscar
          </label>

          <div>
            <Search size={18} />

            <input
              id="noveltySearch"
              value={search}
              placeholder="Nombre, documento o tipo"
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        <button
          className="secondary-action novelty-refresh"
          onClick={() => void loadNovelties()}
          disabled={isLoading}
        >
          <RefreshCw
            size={18}
            className={isLoading ? 'spin' : ''}
          />
          Actualizar
        </button>
      </div>

      <div className="novelties-count">
        <ClipboardList size={20} />

        <span>
          {total} novedad{total === 1 ? '' : 'es'}
        </span>
      </div>

      {error && (
        <div className="novelties-error">
          {error}
        </div>
      )}

      <div className="novelties-panel">
        {isLoading && (
          <div className="novelties-state">
            Cargando novedades...
          </div>
        )}

        {!isLoading &&
          !error &&
          novelties.length === 0 && (
            <div className="novelties-state">
              <ClipboardList size={44} />

              <strong>
                No hay novedades registradas
              </strong>

              <p>
                No se encontraron novedades para{' '}
                {monthNames[month - 1]} de {year}.
              </p>
            </div>
          )}

        {!isLoading &&
          novelties.length > 0 && (
            <div className="novelties-table-wrapper">
              <table className="novelties-table">
                <thead>
                  <tr>
                    <th>Colaborador</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Valor</th>
                    <th>Periodo</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {novelties.map((novelty) => (
                    <tr key={novelty.id}>
                      <td>
                        <strong>
                          {novelty.employee.firstName}{' '}
                          {novelty.employee.lastName}
                        </strong>

                        <span>
                          {
                            novelty.employee
                              .documentNumber
                          }
                        </span>
                      </td>

                      <td>
                        <span className="novelty-type">
                          {noveltyLabels[
                            novelty.type
                          ]}
                        </span>
                      </td>

                      <td>
                        {novelty.quantity ?? '—'}
                      </td>

                      <td>
                        {formatCurrency(
                          novelty.amount,
                        )}
                      </td>

                      <td>
                        {monthNames[
                          novelty.periodMonth - 1
                        ]}{' '}
                        {novelty.periodYear}
                      </td>

                      <td>
                        {novelty.description || '—'}
                      </td>

                      <td>
                        <button
                          className="delete-novelty-button"
                          onClick={() =>
                            void handleDelete(novelty)
                          }
                          disabled={
                            deletingId === novelty.id
                          }
                          aria-label="Eliminar novedad"
                        >
                          <Trash2 size={17} />
                        </button>
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
