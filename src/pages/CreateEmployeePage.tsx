import { useState } from 'react';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { createEmployee } from '../api/employees.api';
import '../styles/employee-form.css';
import { useQueryClient } from '@tanstack/react-query'; 

const employeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres.'),

  lastName: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres.'),

  documentType: z
    .string()
    .min(1, 'Selecciona el tipo de documento.'),

  documentNumber: z
    .string()
    .trim()
    .min(5, 'Ingresa un número de documento válido.'),

  email: z
    .string()
    .trim()
    .email('Ingresa un correo válido.')
    .or(z.literal('')),

  phone: z.string().trim(),

  position: z
    .string()
    .trim()
    .min(2, 'El cargo es obligatorio.'),

  department: z.string().trim(),

  contractType: z
    .string()
    .min(1, 'Selecciona el tipo de contrato.'),

  baseSalary: z
    .number({
      error: 'Ingresa un salario válido.',
    })
    .positive('El salario debe ser mayor que cero.'),

  startDate: z
    .string()
    .min(1, 'La fecha de ingreso es obligatoria.'),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export function CreateEmployeePage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      documentType: 'CC',
      documentNumber: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      contractType: 'INDEFINITE',
      baseSalary: 0,
      startDate: '',
    },
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    setServerError('');

    try {
      await createEmployee({
        firstName: values.firstName,
        lastName: values.lastName,
        documentType: values.documentType,
        documentNumber: values.documentNumber,
        email: values.email || null,
        phone: values.phone || null,
        position: values.position,
        department: values.department || null,
        contractType: values.contractType,
        baseSalary: values.baseSalary,
        startDate: new Date(
          `${values.startDate}T00:00:00`,
        ).toISOString(),
      });

      await queryClient.invalidateQueries({
       queryKey: ['employees'],
      });

      navigate('/employees', {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

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
        'No fue posible registrar el colaborador. Revisa la información e intenta nuevamente.',
      );
    }
  };

  return (
    <section className="employee-form-page">
      <div className="employee-form-heading">
        <button
          className="back-button"
          type="button"
          onClick={() => navigate('/employees')}
        >
          <ArrowLeft size={19} />
          Volver
        </button>

        <div>
          <span className="eyebrow">
            Gestión de personal
          </span>

          <h1>Nuevo colaborador</h1>

          <p>
            Registra la información laboral y personal
            necesaria para gestionar su nómina.
          </p>
        </div>
      </div>

      <form
        className="employee-form-card"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="form-section-heading">
          <UserPlus size={22} />

          <div>
            <h2>Información del colaborador</h2>
            <p>
              Los campos marcados como obligatorios deben
              completarse.
            </p>
          </div>
        </div>

        <div className="employee-form-grid">
          <div className="form-field">
            <label htmlFor="firstName">
              Nombres *
            </label>

            <input
              id="firstName"
              placeholder="Ej. Carlos Andrés"
              {...register('firstName')}
            />

            {errors.firstName && (
              <span className="field-error">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="lastName">
              Apellidos *
            </label>

            <input
              id="lastName"
              placeholder="Ej. Gómez Pérez"
              {...register('lastName')}
            />

            {errors.lastName && (
              <span className="field-error">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="documentType">
              Tipo de documento *
            </label>

            <select
              id="documentType"
              {...register('documentType')}
            >
              <option value="CC">
                Cédula de ciudadanía
              </option>
              <option value="CE">
                Cédula de extranjería
              </option>
              <option value="TI">
                Tarjeta de identidad
              </option>
              <option value="PASSPORT">
                Pasaporte
              </option>
            </select>

            {errors.documentType && (
              <span className="field-error">
                {errors.documentType.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="documentNumber">
              Número de documento *
            </label>

            <input
              id="documentNumber"
              placeholder="Ej. 1030123456"
              {...register('documentNumber')}
            />

            {errors.documentNumber && (
              <span className="field-error">
                {errors.documentNumber.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="colaborador@empresa.com"
              {...register('email')}
            />

            {errors.email && (
              <span className="field-error">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="phone">
              Teléfono
            </label>

            <input
              id="phone"
              placeholder="Ej. 3001234567"
              {...register('phone')}
            />
          </div>

          <div className="form-field">
            <label htmlFor="position">
              Cargo *
            </label>

            <input
              id="position"
              placeholder="Ej. Auxiliar administrativo"
              {...register('position')}
            />

            {errors.position && (
              <span className="field-error">
                {errors.position.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="department">
              Área o departamento
            </label>

            <input
              id="department"
              placeholder="Ej. Gestión humana"
              {...register('department')}
            />
          </div>

          <div className="form-field">
            <label htmlFor="contractType">
              Tipo de contrato *
            </label>

            <select
              id="contractType"
              {...register('contractType')}
            >
              <option value="INDEFINITE">
                Término indefinido
              </option>
              <option value="FIXED_TERM">
                Término fijo
              </option>
              <option value="SERVICE">
                Prestación de servicios
              </option>
              <option value="APPRENTICESHIP">
                Aprendizaje
              </option>
            </select>

            {errors.contractType && (
              <span className="field-error">
                {errors.contractType.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="baseSalary">
              Salario base *
            </label>

            <input
              id="baseSalary"
              type="number"
              min="1"
              step="1"
              placeholder="Ej. 1800000"
              {...register('baseSalary', { valueAsNumber: true })}
            />

            {errors.baseSalary && (
              <span className="field-error">
                {errors.baseSalary.message}
              </span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="startDate">
              Fecha de ingreso *
            </label>

            <input
              id="startDate"
              type="date"
              {...register('startDate')}
            />

            {errors.startDate && (
              <span className="field-error">
                {errors.startDate.message}
              </span>
            )}
          </div>
        </div>

        {serverError && (
          <div className="form-server-error">
            {serverError}
          </div>
        )}

        <div className="employee-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/employees')}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="save-button"
            disabled={isSubmitting}
          >
            <Save size={19} />

            {isSubmitting
              ? 'Guardando...'
              : 'Guardar colaborador'}
          </button>
        </div>
      </form>
    </section>
  );
}



