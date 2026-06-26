import type { Employee } from './employee.types';

export type PayrollNoveltyType =
  | 'OVERTIME'
  | 'NIGHT_SURCHARGE'
  | 'SUNDAY_SURCHARGE'
  | 'HOLIDAY_SURCHARGE'
  | 'BONUS'
  | 'DEDUCTION'
  | 'ABSENCE'
  | 'VACATION'
  | 'SICK_LEAVE';

export interface PayrollNovelty {
  id: string;
  companyId: string;
  employeeId: string;
  type: PayrollNoveltyType;
  quantity?: string | number | null;
  amount?: string | number | null;
  description?: string | null;
  periodYear: number;
  periodMonth: number;
  createdAt: string;
  employee: Employee;
}

export interface PayrollNoveltyListResponse {
  data: PayrollNovelty[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreatePayrollNoveltyPayload {
  employeeId: string;
  type: PayrollNoveltyType;
  quantity?: number;
  amount?: number;
  description?: string;
  periodYear: number;
  periodMonth: number;
}
