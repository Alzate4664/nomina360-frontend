import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { login } from '../auth/auth.service';
import '../styles/login.css';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio.')
    .email('Ingresa un correo válido.'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria.')
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError('');

    try {
      const response = await login(values);

      sessionStorage.setItem(
        'accessToken',
        response.accessToken,
      );

      if (response.user) {
        sessionStorage.setItem(
          'authUser',
          JSON.stringify(response.user),
        );
      }

      navigate('/dashboard');
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
        'No fue posible iniciar sesión. Revisa tus datos e intenta nuevamente.',
      );
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <span className="brand-badge">N360</span>

          <div>
            <h1>Nómina360</h1>
            <p>Gestión de nómina empresarial</p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Iniciar sesión</h2>
          <p>
            Ingresa con las credenciales de tu empresa.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label htmlFor="email">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@empresa.com"
            {...register('email')}
          />

          {errors.email && (
            <span className="field-error">
              {errors.email.message}
            </span>
          )}

          <label htmlFor="password">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            {...register('password')}
          />

          {errors.password && (
            <span className="field-error">
              {errors.password.message}
            </span>
          )}

          {serverError && (
            <div className="server-error">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Ingresando...'
              : 'Ingresar'}
          </button>
        </form>

        <p className="login-footer">
          Plataforma administrativa Nómina360
        </p>
      </section>
    </main>
  );
}
