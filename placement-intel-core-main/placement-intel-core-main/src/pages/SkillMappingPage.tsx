import { useState } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/types/company';
import { SectionHeader, EmptyState } from '@/components/shared/DataDisplay';
import { BrainCircuit, Building2, Plus, X, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FitLevel = 'high' | 'moderate' | 'low';

interface SkillMatch {
  company: Company;
  fit: FitLevel;
  matched: string[];
  gaps: string[];
}

export default function SkillMappingPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const { data } = useCompanies();
  const companies = data?.data ?? [];

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setInput('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));

  // Rule-based matching
  const matches: SkillMatch[] = skills.length > 0
    ? companies.map((company) => {
        const companySkills = [
          company.tech_stack,
          company.ai_ml_adoption_level,
          company.automation_level,
          company.skill_relevance,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        const matched = skills.filter((s) => companySkills.includes(s.toLowerCase()));
        const gaps = skills.filter((s) => !companySkills.includes(s.toLowerCase()));
        const ratio = matched.length / skills.length;
        const fit: FitLevel = ratio >= 0.5 ? 'high' : ratio >= 0.2 ? 'moderate' : 'low';

        return { company, fit, matched, gaps };
      }).sort((a, b) => {
        const order: Record<FitLevel, number> = { high: 0, moderate: 1, low: 2 };
        return order[a.fit] - order[b.fit];
      })
    : [];

  const fitColors: Record<FitLevel, string> = {
    high: 'text-success bg-success/10 border-success/30',
    moderate: 'text-warning bg-warning/10 border-warning/30',
    low: 'text-destructive bg-destructive/10 border-destructive/30',
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
      <SectionHeader
        title="Skill Mapping"
        description="Enter your skills to find best-fit companies and identify gaps"
        icon={<BrainCircuit className="w-4 h-4" />}
      />

      {/* Skill input */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Your Skills</p>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="e.g. Python, React, Machine Learning..."
            className="bg-background text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button size="sm" onClick={addSkill} className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
              {s}
              <button onClick={() => removeSkill(s)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-muted-foreground italic">Add skills above to start matching</p>
          )}
        </div>
      </div>

      {/* Results */}
      {companies.length === 0 ? (
        <EmptyState
          title="No companies loaded"
          description="Connect your database to map skills against companies."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      ) : skills.length > 0 && matches.length > 0 ? (
        <div className="space-y-2">
          {matches.map(({ company, fit, matched, gaps }) => (
            <div key={company.id || company.name} className="rounded-lg border border-border bg-card p-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{company.name}</h3>
                <p className="text-[11px] text-muted-foreground">{company.category} · {company.employee_size}</p>
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-semibold border', fitColors[fit])}>
                {fit === 'high' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {fit === 'moderate' && <Zap className="w-3 h-3 inline mr-1" />}
                {fit === 'low' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                {fit.toUpperCase()} FIT
              </span>
              <div className="text-xs space-y-0.5 md:text-right">
                {matched.length > 0 && <p className="text-success">Matched: {matched.join(', ')}</p>}
                {gaps.length > 0 && <p className="text-muted-foreground">Gaps: {gaps.join(', ')}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : skills.length > 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No matching results. Try different skills.</p>
      ) : null}
    </div>
  );
}
