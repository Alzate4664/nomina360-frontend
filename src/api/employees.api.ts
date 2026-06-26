import { api } from '../api/api';
import type {
  Employee,
  EmployeeListResponse,
} from '../types/employee.types';

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
  employee: Omit<
    Employee,
    'id' | 'companyId' | 'createdAt' | 'updatedAt'
  >,
): Promise<Employee> {
  const response = await api.post<Employee>(
    '/employees',
    employee,
  );

  return response.data;
}
