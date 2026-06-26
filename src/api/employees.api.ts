import { api } from '../api/api';
import type {
  Employee,
  EmployeeListResponse,
} from '../types/employee.types';

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email?: string | null;
  phone?: string | null;
  position: string;
  department?: string | null;
  contractType: string;
  baseSalary: number;
  startDate: string;
}

export async function getEmployees(
  page = 1,
  limit = 20,
): Promise<EmployeeListResponse> {
  const response = await api.get<EmployeeListResponse>(
    '/employees',
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data;
}

export async function createEmployee(
  employee: CreateEmployeePayload,
): Promise<Employee> {
  const response = await api.post<Employee>(
    '/employees',
    employee,
  );

  return response.data;
}
