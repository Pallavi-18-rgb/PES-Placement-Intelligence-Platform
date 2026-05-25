import { Link } from 'react-router-dom';
import { Company } from '@/types/company';
import { Users, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanyLogo } from './CompanyLogo';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  return (
    <Link
      to={`/company/${company.id || company.short_name}`}
      className={cn(
        'block rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:glow-cyan group',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <CompanyLogo
          logoUrl={company.logo_url}
          name={company.name}
          className="w-10 h-10 text-xs"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {company.name}
          </h3>
          {company.short_name && (
            <p className="text-[11px] text-muted-foreground">{company.short_name}</p>
          )}
        </div>
        {company.category && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
            {company.category}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{company.employee_size || '—'}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Zap className="w-3 h-3" />
          <span>{company.hiring_velocity || '—'}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>{company.profitability_status || '—'}</span>
        </div>
      </div>
    </Link>
  );
}
