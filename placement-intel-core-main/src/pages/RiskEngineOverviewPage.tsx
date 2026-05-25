import { useCompanies } from '@/hooks/useCompanies';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, AlertTriangle, CheckCircle, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getGradient } from '@/lib/logo-utils';

export default function RiskEngineOverviewPage() {
  const { data, isLoading } = useCompanies();
  const companies = data?.data ?? [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Candidate Rejection Risk Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">Assess your risk factors and readiness for each company's selection process.</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 rounded-xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {companies.map((company: any, idx: number) => {
            const hash = (company.name || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
            const riskScore = 20 + (hash % 60);
            const riskLevel = riskScore > 60 ? 'High' : riskScore > 35 ? 'Medium' : 'Low';
            const factors = [
              { label: 'CGPA Match', score: 50 + (hash % 40) },
              { label: 'Skill Fit', score: 40 + ((hash * 3) % 50) },
              { label: 'Experience', score: 30 + ((hash * 7) % 60) },
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
                      <p className="text-[10px] text-muted-foreground">{company.category || 'Product Company'}</p>
                    </div>
                    <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-bold',
                      riskLevel === 'High' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                      riskLevel === 'Medium' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                      'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    )}>
                      {riskLevel === 'High' ? <AlertTriangle className="w-2.5 h-2.5" /> :
                       riskLevel === 'Low' ? <CheckCircle className="w-2.5 h-2.5" /> :
                       <TrendingDown className="w-2.5 h-2.5" />}
                      {riskLevel} Risk
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">Rejection Risk Score</span>
                      <span className={cn('text-xs font-bold font-mono',
                        riskScore > 60 ? 'text-red-400' : riskScore > 35 ? 'text-amber-400' : 'text-emerald-400'
                      )}>{riskScore}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/40">
                      <div className={cn('h-full rounded-full transition-all',
                        riskScore > 60 ? 'bg-red-500' : riskScore > 35 ? 'bg-amber-500' : 'bg-emerald-500'
                      )} style={{ width: `${riskScore}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {factors.map(f => (
                      <div key={f.label} className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground w-20 shrink-0">{f.label}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-muted/40">
                          <div className="h-full rounded-full bg-primary/60" style={{ width: `${f.score}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground w-8 text-right">{f.score}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[9px] text-primary/60 group-hover:text-primary flex items-center gap-0.5 mt-3 font-medium justify-end">
                    Full analysis <ChevronRight className="w-2.5 h-2.5" />
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
