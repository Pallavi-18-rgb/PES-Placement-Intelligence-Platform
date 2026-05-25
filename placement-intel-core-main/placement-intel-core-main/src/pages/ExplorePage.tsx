import { useState } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { CompanyCard } from '@/components/shared/CompanyCard';
import { EmptyState, SectionHeader } from '@/components/shared/DataDisplay';
import { CompanyFilters, SortField, SortDirection } from '@/types/company';
import { Building2, Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ExplorePage() {
  const [filters, setFilters] = useState<CompanyFilters>({});
  const [sort, setSort] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'name',
    direction: 'asc',
  });
  const [search, setSearch] = useState('');

  const { data, isLoading } = useCompanies(
    { ...filters, search: search || undefined },
    sort
  );

  const companies = data?.data ?? [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <SectionHeader
        title="Explore Companies"
        description="Browse and filter all companies in the placement database"
        icon={<Building2 className="w-4 h-4" />}
      />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, sector, tech stack..."
            className="pl-9 bg-card"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filters.category || 'all'}
            onValueChange={(v) => setFilters({ ...filters, category: v === 'all' ? undefined : v })}
          >
            <SelectTrigger className="w-[160px] bg-card">
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Tech Giants">Tech Giants</SelectItem>
              <SelectItem value="Product Companies">Product Companies</SelectItem>
              <SelectItem value="Service Companies">Service Companies</SelectItem>
              <SelectItem value="Startups / Scale-ups">Startups</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort.field}
            onValueChange={(v) => setSort({ ...sort, field: v as SortField })}
          >
            <SelectTrigger className="w-[140px] bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="employee_size">Size</SelectItem>
              <SelectItem value="yoy_growth_rate">Growth</SelectItem>
              <SelectItem value="brand_value">Brand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {companies.map((company) => (
            <CompanyCard key={company.id || company.name} company={company} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No companies found"
          description="Connect your database or adjust your filters to see companies."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      )}
    </div>
  );
}
