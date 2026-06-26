export interface Employee {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  email?: string | null;
  phone?: string | null;
  position: string;
  department?: string | null;
  contractType: string;
  baseSalary: string | number;
  startDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeListResponse {
  data: Employee[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
