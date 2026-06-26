import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const summaryCards = [
  {
    title: 'Colaboradores activos',
    value: '0',
    description: 'Registrados en la empresa',
    icon: Users,
    className: 'blue-card',
  },
  {
    title: 'Novedades pendientes',
    value: '0',
    description: 'Por incluir en nómina',
    icon: ClipboardList,
    className: 'orange-card',
  },
  {
    title: 'Nóminas procesadas',
    value: '0',
    description: 'Durante el mes actual',
    icon: Calculator,
    className: 'green-card',
  },
  {
    title: 'Reportes generados',
    value: '0',
    description: 'Disponibles para descargar',
    icon: FileSpreadsheet,
    className: 'purple-card',
  },
];

const quickActions = [
  {
    title: 'Registrar colaborador',
    description:
      'Agrega una nueva persona a la empresa.',
    path: '/employees',
    icon: Users,
  },
  {
    title: 'Crear novedad',
    description:
      'Registra horas extra, ausencias o recargos.',
    path: '/payroll-novelties',
    icon: ClipboardList,
  },
  {
    title: 'Liquidar nómina',
    description:
      'Calcula los pagos del periodo actual.',
    path: '/payroll',
    icon: Calculator,
  },
  {
    title: 'Generar reporte',
    description:
      'Exporta información financiera y laboral.',
    path: '/reports',
    icon: FileSpreadsheet,
  },
];

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <section className="dashboard-heading">
        <div>
          <span className="eyebrow">
            Resumen general
          </span>

          <h1>Bienvenido a Nómina360</h1>

          <p>
            Administra colaboradores, novedades,
            liquidaciones y reportes desde un solo lugar.
          </p>
        </div>

        <div className="system-badge">
          <CheckCircle2 size={20} />
          Backend conectado
        </div>
      </section>

      <section className="summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className={`summary-card ${card.className}`}
            >
              <div className="summary-icon">
                <Icon size={24} />
              </div>

              <div>
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <p>{card.description}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Acciones rápidas</h2>
            <p>
              Accede a las funciones principales del sistema.
            </p>
          </div>
        </div>

        <div className="quick-actions-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="quick-action-card"
              >
                <div className="quick-action-icon">
                  <Icon size={22} />
                </div>

                <div>
                  <strong>{action.title}</strong>
                  <p>{action.description}</p>
                </div>

                <ArrowRight
                  className="quick-action-arrow"
                  size={20}
                />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-heading">
          <div>
            <h2>Estado del periodo</h2>
            <p>
              Información preliminar del proceso de nómina.
            </p>
          </div>
        </div>

        <div className="period-status">
          <div>
            <span>Periodo actual</span>
            <strong>Pendiente de configurar</strong>
          </div>

          <div>
            <span>Estado de nómina</span>
            <strong className="pending-status">
              Sin liquidar
            </strong>
          </div>

          <div>
            <span>Última actualización</span>
            <strong>Sin actividad registrada</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
