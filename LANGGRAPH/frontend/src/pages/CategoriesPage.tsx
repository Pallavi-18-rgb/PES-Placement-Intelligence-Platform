import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useCompanies, useCompanyCategories } from '@/hooks/useCompanies';
import { CompanyCard } from '@/components/shared/CompanyCard';
import { EmptyState, SectionHeader } from '@/components/shared/DataDisplay';
import { LayoutGrid, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultCategories = [
  'Tech Giants',
  'Product Companies',
  'Service Companies',
  'Startups / Scale-ups',
];

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const { data: categories } = useCompanyCategories();
  const { data, isLoading } = useCompanies(
    activeCategory ? { category: activeCategory } : undefined
  );

  const categoryList = categories && categories.length > 0
    ? categories.map((c) => c.category)
    : defaultCategories;

  const companies = data?.data ?? [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <SectionHeader
        title="Categories"
        description="Browse companies by category"
        icon={<LayoutGrid className="w-4 h-4" />}
      />

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSearchParams({})}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            !activeCategory
              ? 'bg-primary/15 text-primary border-primary/30'
              : 'bg-card text-muted-foreground border-border hover:border-primary/30'
          )}
        >
          All
        </button>
        {categoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => setSearchParams({ category: cat })}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              activeCategory === cat
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:border-primary/30'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Companies */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {companies.map((c) => (
            <CompanyCard key={c.id || c.name} company={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={activeCategory ? `No ${activeCategory} companies` : 'No companies yet'}
          description="Connect your Supabase table to populate company data."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      )}
    </div>
  );
}
