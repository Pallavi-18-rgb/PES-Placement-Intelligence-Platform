import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Company } from '@/types/company';
import { cn } from '@/lib/utils';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

import { getInitials, getGradient } from '@/lib/logo-utils';

export function CompanyCard({ company, className }: CompanyCardProps) {
  const [imgError, setImgError] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Admin toggle (placeholder, assume true for demo)
  const isAdmin = true;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };
  const initials = getInitials(company.name);
  const gradient = getGradient(company.name);

  // Hiring Status visual colors
  let statusColor = 'bg-muted text-muted-foreground border-muted-foreground/20';
  if (company.hiring_status === 'Actively Hiring') {
    statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_-4px_rgba(16,185,129,0.4)]';
  } else if (company.hiring_status === 'Registration Open') {
    statusColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_12px_-4px_rgba(59,130,246,0.4)]';
  } else if (company.hiring_status === 'Scheduled') {
    statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (company.hiring_status === 'Closed') {
    statusColor = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  }

  return (
    <Link
      to={`/company/${company.id || company.short_name}`}
      className={cn(
        'block rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:glow-cyan hover:-translate-y-0.5 group relative overflow-hidden',
        className
      )}
    >
      {/* Glow highlight line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start gap-3">
        {company.logo_url && !imgError && !logoPreview ? (
          <img
            src={company.logo_url}
            alt={company.name}
            onError={() => setImgError(true)}
            className="w-14 h-14 rounded-lg object-contain bg-muted"
          />
        ) : logoPreview ? (
          <img
            src={logoPreview}
            alt="Uploaded logo"
            className="w-14 h-14 rounded-lg object-contain bg-muted"
          />
        ) : (
          <div className={cn("w-14 h-14 rounded-lg bg-gradient-to-br flex items-center justify-center font-bold text-lg shrink-0 tracking-wider shadow-sm border", gradient)}>
            {initials}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {company.name}
          </h3>
          {company.short_name && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {company.short_name} · {company.category}
            </p>
          )}
        </div>
      </div>

      {/* Role & Package Parameters */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/55">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">Role</span>
          <span className="text-xs font-semibold text-foreground block truncate mt-0.5">
            {company.role || 'Graduate Engineer Trainee'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">Package</span>
          <span className="text-xs font-bold text-primary block mt-0.5">
            {company.package || '—'}
          </span>
        </div>
      </div>

      {/* Eligibility & Hiring Status */}
      <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground/80 truncate block">
          {company.eligibility_details || 'CGPA ≥ 6.0 · All Branches'}
        </span>
        <span className={cn("text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border uppercase shrink-0", statusColor)}>
          {company.hiring_status || '—'}
        </span>
      </div>
    </Link>
  );
}

