import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ClipboardPlus,
  Save,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { getEmployees } from '../api/employees.api';
import { createPayrollNovelty } from '../api/payroll-novelties.api';
import type { Employee } from '../types/employee.types';
import type { PayrollNoveltyType } from '../types/payroll-novelty.types';
import '../styles/payroll-novelty-form.css';

const currentDate = new Date();

const noveltyTypes: Array<{
  value: PayrollNoveltyType;
  label: string;
}> = [
  {
    value: 'OVERTIME',
    label: 'Hora extra',
  },
  {
    value: 'NIGHT_SURCHARGE',
    label: 'Recargo nocturno',
  },
  {
    value: 'SUNDAY_SURCHARGE',
    label: 'Recargo dominical',
  },
  {
    value: 'HOLIDAY_SURCHARGE',
    label: 'Recargo festivo',
  },
  {
    value: 'BONUS',
    label: 'Bonificación',
  },
  {
    value: 'DEDUCTION',
    label: 'Descuento',
  },
  {
    value: 'ABSENCE',
    label: 'Ausencia',
  },
  {
    value: 'VACATION',
    label: 'Vacaciones',
  },
  {
    value: 'SICK_LEAVE',
    label: 'Incapacidad',
  },
];

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

const noveltySchema = z
  .object({
    employeeId: z
      .string()
      .min(1, 'Selecciona un colaborador.'),

    type: z
      .string()
      .min(1, 'Selecciona el tipo de novedad.'),

    quantity: z.string().trim(),

    amount: z.string().trim(),

    description: z
      .string()
      .trim()
      .max(
        500,
        'La descripción no puede superar 500 caracteres.',
      ),

    periodYear: z
      .string()
      .min(1, 'El año es obligatorio.'),

    periodMonth: z
      .string()
      .min(1, 'El mes es obligatorio.'),
  })
  .superRefine((values, context) => {
    if (!values.quantity && !values.amount) {
      context.addIssue({
        code: 'custom',
        path: ['quantity'],
        message:
          'Ingresa una cantidad o un valor monetario.',
      });
    }

    if (
      values.quantity &&
      (!Number.isFinite(Number(values.quantity)) ||
        Number(values.quantity) <= 0)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['quantity'],
        message: 'La cantidad debe ser mayor que cero.',
      });
    }

    if (
      values.amount &&
      (!Number.isFinite(Number(values.amount)) ||
        Number(values.amount) <= 0)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['amount'],
        message: 'El valor debe ser mayor que cero.',
      });
    }

    const year = Number(values.periodYear);
    const month = Number(values.periodMonth);

    if (!Number.isInteger(year) || year < 2024) {
      context.addIssue({
        code: 'custom',
        path: ['periodYear'],
        message: 'El año debe ser igual o superior a 2024.',
      });
    }

    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      context.addIssue({
        code: 'custom',
        path: ['periodMonth'],
        message: 'Selecciona un mes válido.',
      });
    }
  });

type NoveltyFormValues = z.infer<
  typeof noveltySchema
>;

export function CreatePayrollNoveltyPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<
    Employee[]
  >([]);
  const [isLoadingEmployees, setIsLoadingEmployees] =
    useState(true);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<NoveltyFormValues>({
    resolver: zodResolver(noveltySchema),
    defaultValues: {
      employeeId: '',
      type: 'OVERTIME',
      quantity: '',
      amount: '',
      description: '',
      periodYear: String(
        currentDate.getFullYear(),
      ),
      periodMonth: String(
        currentDate.getMonth() + 1,
      ),
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await getEmployees(1, 100);
        setEmployees(
          response.data.filter(
            (employee) =>
              employee.status === 'ACTIVE',
          ),
        );
      } catch {
        setServerError(
          'No fue posible cargar los colaboradores activos.',
        );
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    void loadEmployees();
  }, []);

  const onSubmit = async (
    values: NoveltyFormValues,
  ) => {
    setServerError('');

    try {
      await createPayrollNovelty({
        employeeId: values.employeeId,
        type: values.type as PayrollNoveltyType,
        quantity: values.quantity
          ? Number(values.quantity)
          : undefined,
        amount: values.amount
          ? Number(values.amount)
          : undefined,
        description:
          values.description || undefined,
        periodYear: Number(values.periodYear),
        periodMonth: Number(values.periodMonth),
      });

      navigate(
        `/payroll-novelties?year=${values.periodYear}&month=${values.periodMonth}`,
        {
          replace: true,
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message;

        if (Array.isArray(message)) {
          setServerError(message.join(' '));
          return;
        }

        if (typeof message === 'string') {
          setServerError(message);
          return;
        }
      }

      setServerError(
        'No fue posible registrar la novedad. Revisa los datos e intenta nuevamente.',
      );
    }
  };

  const usesQuantity = [
    'OVERTIME',
    'NIGHT_SURCHARGE',
    'SUNDAY_SURCHARGE',
    'HOLIDAY_SURCHARGE',
    'ABSENCE',
    'VACATION',
    'SICK_LEAVE',
  ].includes(selectedType);

  return (
    <section className="novelty-form-page">
      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate('/payroll-novelties')
        }
      >
        <ArrowLeft size={19} />
        Volver a novedades
      </button>

      <div className="novelty-form-heading">
        <span className="eyebrow">
          Gestión de nómina
        </span>

        <h1>Nueva novedad</h1>

        <p>
          Registra una novedad para incluirla en el
          periodo de nómina correspondiente.
        </p>
      </div>

      <form
        className="novelty-form-card"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="form-section-heading">
          <ClipboardPlus size={23} />

          <div>
            <h2>Información de la novedad</h2>
            <p>
              Selecciona el colaborador, el concepto y el
              periodo.
            </p>
          </div>
        </div>

        <div className="novelty-form-grid">
          <div className="form-field full-width">
            <label htmlFor="employeeId">
              Colaborador *
            </label>

            <select
              id="employeeId"
              disabled={isLoadingEmployees}
              {...register('employeeId')}
            >
              <option value="">
                {isLoadingEmployees
                  ? 'Cargando colaboradores...'
                  : 'Selecciona un colaborador'}
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.firstName}{' '}
                  {employee.lastName} —{' '}
                  {employee.documentNumber}
                </option>
              ))}
            </select>

            {errors.employeeId && (
              <span className="field-error">
                {errors.employeeId.message}
              </span>
            )}

            {!isLoadingEmployees &&
              employees.length === 0 && (
                <span className="form-help warning-help">
                  No hay colaboradores activos disponibles.
                </span>
              )}
          </div>

          <div className="form-field">
            <label htmlFor="type">
              Tipo de novedad *
            </label>

            <select
              id="type"
              {...register('type')}
            >
              {noveltyTypes.map((novelty) => (
                <option
                  key={novelty.value}
                  value={novelty.value}
                >
                  {novelty.label}
                </option>
              ))}
            </select>

            {errors.type && (
              <span className="field-error">
                {errors.type.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="quantity">
              {usesQuantity
                ? 'Cantidad u horas'
                : 'Cantidad'}
            </label>

            <input
              id="quantity"
              type="number"
              min="0"
              step="0.01"
              placeholder={
                usesQuantity
                  ? 'Ej. 4.5'
                  : 'Opcional'
              }
              {...register('quantity')}
            />

            {errors.quantity && (
              <span className="field-error">
                {errors.quantity.message}
              </span>
            )}

            <span className="form-help">
              Puede representar horas, días o unidades.
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="amount">
              Valor monetario
            </label>

            <input
              id="amount"
              type="number"
              min="0"
              step="1"
              placeholder="Ej. 150000"
              {...register('amount')}
            />

            {errors.amount && (
              <span className="field-error">
                {errors.amount.message}
              </span>
            )}

            <span className="form-help">
              Déjalo vacío cuando el valor se calcule
              posteriormente.
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="periodYear">
              Año del periodo *
            </label>

            <input
              id="periodYear"
              type="number"
              min="2024"
              max="2100"
              {...register('periodYear')}
            />

            {errors.periodYear && (
              <span className="field-error">
                {errors.periodYear.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="periodMonth">
              Mes del periodo *
            </label>

            <select
              id="periodMonth"
              {...register('periodMonth')}
            >
              {monthNames.map((month, index) => (
                <option
                  key={month}
                  value={String(index + 1)}
                >
                  {month}
                </option>
              ))}
            </select>

            {errors.periodMonth && (
              <span className="field-error">
                {errors.periodMonth.message}
              </span>
            )}
          </div>

          <div className="form-field full-width">
            <label htmlFor="description">
              Descripción
            </label>

            <textarea
              id="description"
              rows={4}
              placeholder="Agrega información adicional sobre la novedad."
              {...register('description')}
            />

            {errors.description && (
              <span className="field-error">
                {errors.description.message}
              </span>
            )}
          </div>
        </div>

        {serverError && (
          <div className="form-server-error">
            {serverError}
          </div>
        )}

        <div className="novelty-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate('/payroll-novelties')
            }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="save-button"
            disabled={
              isSubmitting ||
              isLoadingEmployees ||
              employees.length === 0
            }
          >
            <Save size={19} />

            {isSubmitting
              ? 'Guardando...'
              : 'Guardar novedad'}
          </button>
        </div>
      </form>
    </section>
  );
}
