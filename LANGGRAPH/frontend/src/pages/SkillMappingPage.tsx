import { useState } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/types/company';
import { SectionHeader, EmptyState } from '@/components/shared/DataDisplay';
import { BrainCircuit, Building2, Plus, X, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EnhancedBadge } from '@/components/shared/EnhancedBadge';
import { ProgressIcon } from '@/components/shared/ProgressIcon';
import { EnhancedCard } from '@/components/shared/EnhancedCard';
import { cn } from '@/lib/utils';

type FitLevel = 'high' | 'medium' | 'low';

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
        const fit: FitLevel = ratio >= 0.6 ? 'high' : ratio >= 0.3 ? 'medium' : 'low';

        return { company, fit, matched, gaps };
      }).sort((a, b) => {
        const order: Record<FitLevel, number> = { high: 0, medium: 1, low: 2 };
        return order[a.fit] - order[b.fit];
      })
    : [];

  const fitColors: Record<FitLevel, string> = {
    high: 'text-success bg-success/10 border-success/30',
    medium: 'text-warning bg-warning/10 border-warning/30',
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
      <EnhancedCard
        title="Your Skills"
        description="Add your technical and professional skills to find matching companies"
        variant="elevated"
        icon={<BrainCircuit className="w-5 h-5 text-primary" />}
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Python, React, Machine Learning..."
              className="bg-background/50 text-sm border-primary/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button size="sm" onClick={addSkill} className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <EnhancedBadge
                key={s}
                label={s}
                variant="primary"
                size="md"
                icon={false}
              />
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-muted-foreground italic py-2">Add skills above to start matching</p>
            )}
          </div>
        </div>
      </EnhancedCard>

      {/* Results */}
      {companies.length === 0 ? (
        <EmptyState
          title="No companies loaded"
          description="Connect your database to map skills against companies."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      ) : skills.length > 0 && matches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {matches.map(({ company, fit, matched, gaps }) => (
            <EnhancedCard
              key={company.id || company.name}
              title={company.name}
              description={`${company.category} · ${company.employee_size}`}
              variant="outlined"
              icon={
                <ProgressIcon
                  status={fit === 'high' ? 'completed' : fit === 'medium' ? 'in-progress' : 'warning'}
                  size="md"
                />
              }
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Fit Level</span>
                  <EnhancedBadge
                    label={`${fit.toUpperCase()} FIT`}
                    variant={fit === 'high' ? 'success' : fit === 'medium' ? 'warning' : 'danger'}
                    size="sm"
                    icon={true}
                  />
                </div>
                
                {matched.length > 0 && (
                  <div className="border-t border-border/30 pt-3">
                    <p className="text-xs font-semibold text-success mb-2">✓ Matched Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {matched.map((skill) => (
                        <EnhancedBadge
                          key={skill}
                          label={skill}
                          variant="success"
                          size="sm"
                          icon={false}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {gaps.length > 0 && (
                  <div className="border-t border-border/30 pt-3">
                    <p className="text-xs font-semibold text-warning mb-2">⚠ Skill Gaps</p>
                    <div className="flex flex-wrap gap-1">
                      {gaps.map((skill) => (
                        <EnhancedBadge
                          key={skill}
                          label={skill}
                          variant="warning"
                          size="sm"
                          icon={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </EnhancedCard>
          ))}
        </div>
      ) : skills.length > 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No matching results. Try different skills.</p>
      ) : null}
    </div>
  );
}
