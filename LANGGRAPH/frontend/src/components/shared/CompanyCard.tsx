import { Link, useNavigate } from 'react-router-dom';
import { Company } from '@/types/company';
import { Building2, Users, TrendingUp, Zap, CalendarDays, Briefcase, Shield } from 'lucide-react';
import { EnhancedCard } from './EnhancedCard';
import { EnhancedBadge } from './EnhancedBadge';
import { ProgressIcon } from './ProgressIcon';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  const companyPath = `/company/${company.id || company.short_name}`;
  const navigate = useNavigate();

  const getStatusIcon = (status?: string) => {
    if (!status) return 'pending';
    if (status.toLowerCase().includes('high')) return 'completed';
    if (status.toLowerCase().includes('medium')) return 'in-progress';
    return 'warning';
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(companyPath)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(companyPath); }}
      className="block group cursor-pointer"
    >
      <EnhancedCard
        variant="elevated"
        className={cn('hover:scale-105 cursor-pointer h-full', className)}
        headerClassName="flex-row gap-3 items-center"
        icon={
          <img
            src={company.logo_url}
            alt={company.name}
            className="w-12 h-12 rounded-md object-contain bg-white p-1 shrink-0 border border-border"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              const initials = String(company.name || '')
                .split(' ')
                .map((s) => s.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase() || '?';
              const svg = encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='100%' height='100%' fill='%23ffffff'/><text x='50%' y='50%' font-size='48' text-anchor='middle' dominant-baseline='central' fill='%236b7280' font-family='Segoe UI, Roboto, Arial'>${initials}</text></svg>`
              );
              target.onerror = null;
              target.src = `data:image/svg+xml;utf8,${svg}`;
            }}
          />
        }
        title={company.name}
        description={company.short_name}
      >
        <div className="space-y-3">
          {company.category && (
            <div className="flex gap-1.5 flex-wrap">
              <EnhancedBadge
                label={company.category}
                variant="primary"
                size="sm"
                icon={false}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 bg-muted/50 rounded-lg p-2">
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground mb-1">Size</div>
              <div className="text-xs font-semibold text-foreground">{company.employee_size || '—'}</div>
            </div>
            <div className="text-center border-l border-r border-border/30">
              <div className="text-[10px] text-muted-foreground mb-1">Hiring</div>
              <div className="text-xs font-semibold text-primary">{company.hiring_velocity || '—'}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground mb-1">Status</div>
              <div className="text-xs font-semibold text-success">{company.profitability_status || '—'}</div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-3 flex gap-2 flex-wrap">
            <Link
              to={`${companyPath}/timeline`}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Timeline
            </Link>
            <Link
              to={`${companyPath}/experiences`}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
            >
              Experiences
            </Link>
            <Link
              to={`${companyPath}/rejection`}
              className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
            >
              Risks
            </Link>
          </div>
        </div>
      </EnhancedCard>
    </div>
  );
}
