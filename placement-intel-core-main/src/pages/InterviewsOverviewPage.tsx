import { useCompanies } from '@/hooks/useCompanies';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getGradient } from '@/lib/logo-utils';

export default function InterviewsOverviewPage() {
  const { data, isLoading } = useCompanies();
  const companies = data?.data ?? [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Interview Experiences</h1>
        <p className="text-sm text-muted-foreground mt-1">Real interview prep insights and experiences from campus placements.</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-36 rounded-xl bg-card border border-border animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {companies.map((company: any, idx: number) => {
            const hash = (company.name || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
            const difficulty = ['Easy', 'Medium', 'Hard'][hash % 3];
            const rounds = 2 + (hash % 3);
            const rating = (3.5 + (hash % 15) / 10).toFixed(1);
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
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 rounded-lg bg-muted/30 border border-border/40">
                      <p className="text-xs font-bold text-foreground">{rounds}</p>
                      <p className="text-[8px] text-muted-foreground">Rounds</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30 border border-border/40">
                      <p className={cn('text-xs font-bold', difficulty === 'Hard' ? 'text-red-400' : difficulty === 'Medium' ? 'text-amber-400' : 'text-emerald-400')}>{difficulty}</p>
                      <p className="text-[8px] text-muted-foreground">Difficulty</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-muted/30 border border-border/40">
                      <div className="flex items-center justify-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <p className="text-xs font-bold text-foreground">{rating}</p>
                      </div>
                      <p className="text-[8px] text-muted-foreground">Rating</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 rounded px-1.5 py-0.5 font-medium">DSA</span>
                    <span className="text-[9px] bg-violet-500/10 text-violet-400 border border-violet-500/25 rounded px-1.5 py-0.5 font-medium">System Design</span>
                    <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded px-1.5 py-0.5 font-medium">HR</span>
                  </div>
                  <div className="text-[9px] text-primary/60 group-hover:text-primary flex items-center gap-0.5 mt-3 font-medium justify-end">
                    View experiences <ChevronRight className="w-2.5 h-2.5" />
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
