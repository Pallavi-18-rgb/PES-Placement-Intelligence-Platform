import { useCompanies } from '@/hooks/useCompanies';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Play, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getGradient } from '@/lib/logo-utils';
import { useState } from 'react';

const deriveHiringStatus = (velocity = '') => {
  const v = (velocity || '').trim().toLowerCase();
  if (v === 'moderate' || v === 'medium') return 'Scheduled';
  if (v === 'low' || v === 'stagnant') return 'Closed';
  return 'Actively Hiring';
};

export default function TimelineOverviewPage() {
  const { data, isLoading } = useCompanies();
  const companies = data?.data ?? [];
  const [filter, setFilter] = useState<string>('all');

  const enriched = companies.map((c: any) => ({ ...c, hiringStatus: deriveHiringStatus(c.hiring_velocity) }));
  const filtered = filter === 'all' ? enriched : enriched.filter((c: any) => c.hiringStatus === filter);

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Placement Timeline Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Track hiring stages across all campus recruiting companies.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'Actively Hiring', 'Scheduled', 'Closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              filter === f ? 'bg-primary/15 text-primary border-primary/30' : 'bg-card text-muted-foreground border-border hover:border-primary/30'
            )}>{f === 'all' ? 'All Companies' : f}</button>
        ))}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((company: any, idx: number) => {
            const companyIdStr = String(company.company_id || company.id || "1");
            const id = companyIdStr.charCodeAt(0) + (companyIdStr.charCodeAt(companyIdStr.length - 1) || 0);
            const baseMonth = 7 + (id % 6);
            const year = baseMonth > 11 ? 2027 : 2026;
            const month = baseMonth > 11 ? baseMonth - 12 : baseMonth;
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const dayOffset = ((id * 7) % 20) + 3;
            const startDay = Math.min(dayOffset, 28);
            const startDate = `${months[month]} ${String(startDay).padStart(2,'0')}, ${year}`;
            const steps = [
              { label: 'Reg', status: company.hiringStatus === 'Actively Hiring' ? 'active' : 'done' },
              { label: 'Apt', status: company.hiringStatus === 'Actively Hiring' ? 'pending' : company.hiringStatus === 'Scheduled' ? 'active' : 'done' },
              { label: 'Tech', status: company.hiringStatus === 'Closed' ? 'done' : 'pending' },
              { label: 'HR', status: company.hiringStatus === 'Closed' ? 'done' : 'pending' },
              { label: 'Result', status: company.hiringStatus === 'Closed' ? 'done' : 'pending' },
            ];
            return (
              <motion.div key={company.id || idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}>
                <Link to={`/company/${company.company_id || company.id}`}
                  className="block rounded-xl border border-border bg-card hover:border-primary/30 p-4 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-[10px] font-bold shrink-0", getGradient(company.name))}>
                      {getInitials(company.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{company.short_name || company.name}</p>
                      <p className="text-[10px] text-muted-foreground">Starts: {startDate}</p>
                    </div>
                    <span className={cn('text-[8px] font-bold px-1.5 py-0.5 rounded-full border uppercase',
                      company.hiringStatus === 'Actively Hiring' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                      company.hiringStatus === 'Scheduled' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                      'text-zinc-400 border-zinc-500/20 bg-zinc-500/10'
                    )}>{company.hiringStatus}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {steps.map((s, si) => (
                      <div key={si} className="flex items-center flex-1">
                        <div className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                          s.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                          s.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        )}>
                          {s.status === 'done' ? <CheckCircle2 className="w-2.5 h-2.5" /> :
                           s.status === 'active' ? <Play className="w-2 h-2 fill-current" /> :
                           <Clock className="w-2.5 h-2.5" />}
                        </div>
                        {si < steps.length - 1 && <div className={cn('flex-1 h-[2px] mx-0.5', s.status === 'done' ? 'bg-emerald-500/40' : 'bg-border/40')} />}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 mt-1">
                    {steps.map((s, si) => <span key={si} className="text-[7px] text-muted-foreground flex-1 text-center">{s.label}</span>)}
                  </div>
                  <div className="text-[9px] text-primary/60 group-hover:text-primary flex items-center gap-0.5 mt-2 font-medium justify-end">
                    View full timeline <ChevronRight className="w-2.5 h-2.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
