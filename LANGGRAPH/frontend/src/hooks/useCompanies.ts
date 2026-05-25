import { useQuery } from '@tanstack/react-query';
import { CompanyFilters, SortField, SortDirection } from '@/types/company';
import {
  fetchCompanies,
  fetchCompanyById,
  fetchCompanyCategories,
  fetchCompanyStats,
} from '@/services/companyService';

export function useCompanies(
  filters?: CompanyFilters,
  sort?: { field: SortField; direction: SortDirection },
  limit?: number,
  offset?: number
) {
  return useQuery({
    queryKey: ['companies', filters, sort, limit, offset],
    queryFn: () => fetchCompanies(filters, sort, limit, offset),
  });
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompanyById(id!),
    enabled: !!id,
  });
}

export function useCompanyCategories() {
  return useQuery({
    queryKey: ['company-categories'],
    queryFn: fetchCompanyCategories,
  });
}

export function useCompanyStats() {
  return useQuery({
    queryKey: ['company-stats'],
    queryFn: fetchCompanyStats,
  });
}
