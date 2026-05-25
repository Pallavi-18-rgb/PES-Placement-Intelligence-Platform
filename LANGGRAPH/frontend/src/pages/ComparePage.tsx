import { useState } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/types/company';
import { DataField, SectionHeader, EmptyState } from '@/components/shared/DataDisplay';
import { GitCompare, Building2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const compareGroups = [
  {
    title: 'Culture & People',
    fields: ['work_culture_summary', 'hiring_velocity', 'employee_turnover', 'avg_retention_tenure', 'diversity_inclusion_score', 'burnout_risk'],
  },
  {
    title: 'Compensation',
    fields: ['fixed_vs_variable_pay', 'bonus_predictability', 'esops_incentives', 'family_health_insurance', 'lifestyle_benefits'],
  },
  {
    title: 'Learning & Growth',
    fields: ['training_spend', 'learning_culture', 'mentorship_availability', 'promotion_clarity', 'exit_opportunities', 'skill_relevance'],
  },
  {
    title: 'Financials',
    fields: ['annual_revenue', 'profitability_status', 'yoy_growth_rate', 'valuation', 'runway_months'],
  },
  {
    title: 'Technology',
    fields: ['tech_stack', 'ai_ml_adoption_level', 'tech_adoption_rating', 'cybersecurity_posture'],
  },
  {
    title: 'Career Signal',
    fields: ['exposure_quality', 'network_strength', 'global_exposure', 'external_recognition', 'early_ownership'],
  },
];

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<[string?, string?]>([]);
  const { data } = useCompanies();
  const companies = data?.data ?? [];

  const companyA = companies.find((c) => (c.id || c.name) === selectedIds[0]);
  const companyB = companies.find((c) => (c.id || c.name) === selectedIds[1]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <SectionHeader
        title="Compare Companies"
        description="Side-by-side structured comparison across key dimensions"
        icon={<GitCompare className="w-4 h-4" />}
      />

      {/* Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CompanySelector
          label="Company A"
          companies={companies}
          selected={selectedIds[0]}
          onSelect={(id) => setSelectedIds([id, selectedIds[1]])}
        />
        <CompanySelector
          label="Company B"
          companies={companies}
          selected={selectedIds[1]}
          onSelect={(id) => setSelectedIds([selectedIds[0], id])}
        />
      </div>

      {companies.length === 0 ? (
        <EmptyState
          title="No companies to compare"
          description="Connect your database to start comparing companies."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      ) : companyA && companyB ? (
        <div className="space-y-4">
          {compareGroups.map((group) => (
            <div key={group.title} className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">{group.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium w-1/3">Parameter</th>
                      <th className="text-left py-2 text-primary font-medium w-1/3">{companyA.name}</th>
                      <th className="text-left py-2 text-primary font-medium w-1/3">{companyB.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.fields.map((field) => (
                      <tr key={field} className="border-b border-border last:border-0">
                        <td className="py-2 text-muted-foreground">{formatLabel(field)}</td>
                        <td className="py-2 text-foreground">{String(companyA[field] || '—')}</td>
                        <td className="py-2 text-foreground">{String(companyB[field] || '—')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Select two companies above to begin comparison
        </div>
      )}
    </div>
  );
}

function CompanySelector({
  label,
  companies,
  selected,
  onSelect,
}: {
  label: string;
  companies: Company[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-7 h-8 text-xs bg-card"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="max-h-40 overflow-y-auto scrollbar-thin space-y-0.5">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <button
              key={c.id ?? c.short_name ?? c.name}
              onClick={() => onSelect(c.id ?? c.short_name ?? c.name)}
              className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                selected === (c.id || c.name) ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-secondary'
              }`}
            >
              {c.name}
            </button>
          ))
        ) : (
          <p className="text-[11px] text-muted-foreground py-2 text-center italic">No companies available</p>
        )}
      </div>
    </div>
  );
}

function formatLabel(field: string): string {
  return field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
