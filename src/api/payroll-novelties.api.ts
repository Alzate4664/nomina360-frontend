import { api } from './api';
import type {
  CreatePayrollNoveltyPayload,
  PayrollNovelty,
  PayrollNoveltyListResponse,
} from '../types/payroll-novelty.types';

export interface PayrollNoveltyFilters {
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export async function getPayrollNovelties(
  filters: PayrollNoveltyFilters = {},
): Promise<PayrollNoveltyListResponse> {
  const response =
    await api.get<PayrollNoveltyListResponse>(
      '/payroll-novelties',
      {
        params: {
          year: filters.year,
          month: filters.month,
          page: filters.page ?? 1,
          limit: filters.limit ?? 20,
          search: filters.search || undefined,
        },
      },
    );

  return response.data;
}

export async function createPayrollNovelty(
  payload: CreatePayrollNoveltyPayload,
): Promise<PayrollNovelty> {
  const response = await api.post<PayrollNovelty>(
    '/payroll-novelties',
    payload,
  );

  return response.data;
}

export async function deletePayrollNovelty(
  id: string,
): Promise<void> {
  await api.delete(`/payroll-novelties/${id}`);
}
