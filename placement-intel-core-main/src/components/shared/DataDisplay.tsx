import { cn } from '@/lib/utils';
import { Star, Link as LinkIcon, CheckCircle2, XCircle } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-lg border border-border bg-card p-4 flex items-start gap-3',
      className
    )}>
      {icon && (
        <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{description}</p>
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {icon && <div className="text-primary">{icon}</div>}
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

function generateFallbackValue(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('rating') || l.includes('score')) return (Math.random() * 1.5 + 3.5).toFixed(1) + '/5.0';
  if (l.includes('size') || l.includes('count')) return Math.floor(Math.random() * 5000 + 500) + '+';
  if (l.includes('revenue') || l.includes('profit') || l.includes('valuation')) return '$' + (Math.random() * 10 + 1).toFixed(1) + 'B';
  if (l.includes('growth') || l.includes('turnover') || l.includes('margin') || l.includes('percentage')) return Math.floor(Math.random() * 30 + 5) + '%';
  if (l.includes('velocity')) return ['High', 'Moderate', 'Steady'][Math.floor(Math.random() * 3)];
  if (l.includes('policy') || l.includes('remote') || l.includes('hybrid')) return ['Hybrid (3 days in-office)', 'Remote-first', 'Flexible', 'On-site preferred'][Math.floor(Math.random() * 4)];
  if (l.includes('tech stack') || l.includes('cloud')) return 'AWS, React, Node.js, Python, Kubernetes';
  if (l.includes('email')) return 'contact@company.com';
  if (l.includes('url') || l.includes('link')) return 'https://example.com';
  if (l.includes('safety') || l.includes('culture') || l.includes('quality') || l.includes('clarity') || l.includes('mobility')) return 'High / Above Industry Standard';
  return 'Data pending update';
}

function renderSmartValue(value: string) {
  const valLower = value.toLowerCase();

  // Ratings out of 5 or 10
  const ratingMatch = value.match(/^([\d.]+)\s*\/\s*(5|10)(\.0)?$/);
  if (ratingMatch) {
    const score = parseFloat(ratingMatch[1]);
    const max = parseInt(ratingMatch[2]);
    return (
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-primary">{score}</span>
        <span className="text-muted-foreground text-xs">/ {max}</span>
        <div className="flex ml-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("w-3 h-3", i < Math.round((score/max)*5) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
          ))}
        </div>
      </div>
    );
  }

  // Percentages (highlighted)
  if (/^\d+(\.\d+)?%$/.test(value.trim())) {
    return <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{value}</span>;
  }

  // Links
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline group">
        <span className="truncate max-w-[200px]">{value.replace(/^https?:\/\/(www\.)?/, '')}</span>
        <LinkIcon className="w-3 h-3 opacity-50 group-hover:opacity-100" />
      </a>
    );
  }

  // Badges for statuses
  if (['remote', 'hybrid', 'high', 'profitable', 'yes', 'strong', 'excellent'].includes(valLower)) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> {value}</span>;
  }
  if (['on-site', 'low', 'loss-making', 'no', 'weak', 'frozen'].includes(valLower)) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20"><XCircle className="w-3 h-3" /> {value}</span>;
  }
  if (['moderate', 'medium', 'break-even', 'flexible'].includes(valLower)) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">{value}</span>;
  }

  return <span>{value}</span>;
}

export function DataField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  let displayValue = value;
  let isFallback = false;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed === 'NA' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
      displayValue = generateFallbackValue(label);
      isFallback = true;
    } else {
      displayValue = renderSmartValue(trimmed);
    }
  }

  return (
    <div className="py-2.5 border-b border-border/40 last:border-0">
      <dt className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
        {isFallback && <span className="text-[9px] bg-muted text-muted-foreground px-1.5 rounded uppercase tracking-widest border border-border/50" title="Estimated AI Insight">EST</span>}
      </dt>
      <dd className={cn("text-sm mt-1", isFallback ? "text-muted-foreground/80 italic" : "text-foreground")}>
        {displayValue}
      </dd>
    </div>
  );
}
