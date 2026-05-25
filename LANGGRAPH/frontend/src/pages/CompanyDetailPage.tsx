import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompanies';
import { Company } from '@/types/company';
import { DataField, SectionHeader, EmptyState } from '@/components/shared/DataDisplay';
import { EnhancedBadge } from '@/components/shared/EnhancedBadge';
import { EnhancedCard } from '@/components/shared/EnhancedCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building2, Globe, Users, Briefcase, Heart, GraduationCap,
  DollarSign, Shield, Cpu, UserCircle, Megaphone,
  ChevronRight, ExternalLink, CalendarDays, CheckCircle, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const sections = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'timeline', label: 'Timeline', icon: Users },
  { id: 'experiences', label: 'Experiences', icon: Briefcase },
  { id: 'rejection', label: 'Rejection Risk', icon: Shield },
  { id: 'business', label: 'Business & Market', icon: Briefcase },
  { id: 'culture', label: 'Culture & People', icon: Heart },
  { id: 'growth', label: 'Learning & Growth', icon: GraduationCap },
  { id: 'compensation', label: 'Compensation', icon: DollarSign },
  { id: 'logistics', label: 'Work Logistics', icon: Globe },
  { id: 'financials', label: 'Financials & Risk', icon: Shield },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'leadership', label: 'Leadership & Contacts', icon: UserCircle },
  { id: 'brand', label: 'Brand & Digital', icon: Megaphone },
];

type PlacementTimeline = {
  registrationDeadline: string;
  aptitudeRoundDate: string;
  technicalInterviewDate: string;
  hrInterviewDate: string;
  resultStatus: string;
};

type ExperienceEntry = {
  id: string;
  rounds: string;
  questions: string;
  tips: string;
  author: string;
};

const TIMELINE_KEY = 'lg_company_timeline_';
const EXPERIENCE_KEY = 'lg_company_experiences_';

function tokenize(text?: string) {
  if (!text) return new Set<string>();
  return new Set(
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9, ]+/g, ' ')
      .split(/[\s,]+/)
      .filter(Boolean)
  );
}

export default function CompanyDetailPage() {
  const { id, section } = useParams<{ id: string; section?: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const overrideLogoUrl = query.get('logo_url') || query.get('logo');
  const { data: company, isLoading } = useCompany(id);
  const [activeSection, setActiveSection] = useState('overview');
  const [companyTimeline, setCompanyTimeline] = useState<PlacementTimeline>({
    registrationDeadline: '',
    aptitudeRoundDate: '',
    technicalInterviewDate: '',
    hrInterviewDate: '',
    resultStatus: '',
  });
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [experienceForm, setExperienceForm] = useState({ rounds: '', questions: '', tips: '', author: '' });
  const [skillsInput, setSkillsInput] = useState('');
  const [projectsInput, setProjectsInput] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [backlogs, setBacklogs] = useState('0');
  const [resumeSummary, setResumeSummary] = useState('');
  const [rejectionResult, setRejectionResult] = useState<{ probability: number; reasons: string[]; missingSkills: string[] } | null>(null);

  useEffect(() => {
    if (!company) return;
    const timelineRaw = localStorage.getItem(`${TIMELINE_KEY}${company.id || company.short_name || company.name}`);
    const experienceRaw = localStorage.getItem(`${EXPERIENCE_KEY}${company.id || company.short_name || company.name}`);
    const defaultTimeline: PlacementTimeline = {
      registrationDeadline: '',
      aptitudeRoundDate: '',
      technicalInterviewDate: '',
      hrInterviewDate: '',
      resultStatus: '',
    };
    setCompanyTimeline(timelineRaw ? JSON.parse(timelineRaw) : (company.timeline as PlacementTimeline) ?? defaultTimeline);
    setExperience(experienceRaw ? JSON.parse(experienceRaw) : []);
  }, [company]);

  useEffect(() => {
    if (!company || !section) return;
    const validSection = sections.some((s) => s.id === section);
    if (validSection) {
      setActiveSection(section);
      setTimeout(() => {
        document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [company, section]);

  useEffect(() => {
    if (!company) return;
    localStorage.setItem(`${TIMELINE_KEY}${company.id || company.short_name || company.name}`, JSON.stringify(companyTimeline));
  }, [company, companyTimeline]);

  useEffect(() => {
    if (!company) return;
    localStorage.setItem(`${EXPERIENCE_KEY}${company.id || company.short_name || company.name}`, JSON.stringify(experience));
  }, [company, experience]);

  function savePlacementTimeline(event: FormEvent) {
    event.preventDefault();
    if (!company) return;
    setCompanyTimeline((prev) => ({ ...prev }));
  }

  function addExperience(event: FormEvent) {
    event.preventDefault();
    if (!company || !experienceForm.rounds) return;
    setExperience((prev) => [
      {
        id: String(Date.now()),
        rounds: experienceForm.rounds,
        questions: experienceForm.questions,
        tips: experienceForm.tips,
        author: experienceForm.author,
      },
      ...prev,
    ]);
    setExperienceForm({ rounds: '', questions: '', tips: '', author: '' });
  }

  const timelineSteps = [
    {
      id: 'registrationDeadline',
      label: 'Registration Deadline',
      value: companyTimeline.registrationDeadline,
      icon: CalendarDays,
      info: 'Set the final application cutoff.',
    },
    {
      id: 'aptitudeRoundDate',
      label: 'Aptitude Round',
      value: companyTimeline.aptitudeRoundDate,
      icon: CheckCircle,
      info: 'Record the date of the first selection round.',
    },
    {
      id: 'technicalInterviewDate',
      label: 'Technical Interview',
      value: companyTimeline.technicalInterviewDate,
      icon: Cpu,
      info: 'Track when the technical evaluation takes place.',
    },
    {
      id: 'hrInterviewDate',
      label: 'HR Interview',
      value: companyTimeline.hrInterviewDate,
      icon: UserCircle,
      info: 'Set the date for the final HR conversation.',
    },
    {
      id: 'resultStatus',
      label: 'Result Status',
      value: companyTimeline.resultStatus,
      icon: Shield,
      info: 'Mark the final outcome and next step.',
    },
  ];

  const completedTimelineCount = timelineSteps.filter((step) => Boolean(step.value)).length;

  const formatDateLabel = (value: string) => {
    if (!value) return 'Not set';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-US');
  };

  const riskLabel = (probability: number) => {
    if (probability >= 0.8) return 'Strong fit';
    if (probability >= 0.6) return 'Good fit';
    if (probability >= 0.4) return 'Moderate fit';
    return 'Low fit';
  };

  function analyzeRejection(event: FormEvent) {
    event.preventDefault();
    if (!company) return;

    const profileTokens = new Set<string>([
      ...tokenize(skillsInput),
      ...tokenize(projectsInput),
      ...tokenize(resumeSummary),
    ]);

    const companyText = [
      company.focus_sectors,
      company.tech_stack,
      company.offerings_description,
      company.key_competitors,
      company.website_url,
    ]
      .filter(Boolean)
      .join(' ');

    const companyTokens = tokenize(companyText);
    const missingSkills = [...companyTokens].filter((token) => !profileTokens.has(token)).slice(0, 8);
    const resumeShort = resumeSummary.trim().length < 80;
    const cgpaValue = parseFloat(cgpa) || 0;
    const backlogValue = parseInt(backlogs, 10) || 0;
    const lowCgpa = cgpaValue > 0 && cgpaValue < 7.0;

    const reasons: string[] = [];
    if (!skillsInput.trim() && !projectsInput.trim() && !resumeSummary.trim()) {
      reasons.push('No profile details provided yet. Add skills, projects, and resume highlights.');
    }
    if (lowCgpa) reasons.push('CGPA below 7.0 may reduce shortlisting chances.');
    if (backlogValue > 0) reasons.push('Backlogs can hurt eligibility for many placement drives.');
    if (resumeShort) reasons.push('Resume appears brief; add more project and achievement detail.');
    if (missingSkills.length > 0) reasons.push(`Missing keywords: ${missingSkills.join(', ')}`);

    const scoreFromSkills = 1 - Math.min(missingSkills.length * 0.08, 0.7);
    const scoreFromCgpa = lowCgpa ? 0.7 : 1;
    const scoreFromBacklogs = backlogValue > 0 ? 0.75 : 1;
    const scoreFromResume = resumeShort ? 0.85 : 1;
    const probability = Math.min(Math.max((scoreFromSkills + scoreFromCgpa + scoreFromBacklogs + scoreFromResume) / 4, 0), 1);

    setRejectionResult({ probability, reasons, missingSkills });
  }

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-card border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <EmptyState
          title="Company not found"
          description="This company may not exist or the database is not connected yet."
          icon={<Building2 className="w-6 h-6 text-muted-foreground" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 mb-6"
      >
        {company.logo_url ? (
          <img
            src={company.logo_url}
            alt={company.name}
            className="w-16 h-16 rounded-lg object-contain bg-white p-1 border border-border"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              const initials = String(company.name || '')
                .split(' ')
                .map((s) => s.charAt(0))
                .slice(0, 2)
                .join('')
                .toUpperCase() || '?';
              const svg = encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><rect width='100%' height='100%' fill='%23ffffff'/><text x='50%' y='50%' font-size='64' text-anchor='middle' dominant-baseline='central' fill='%236b7280' font-family='Segoe UI, Roboto, Arial'>${initials}</text></svg>`
              );
              target.onerror = null;
              target.src = `data:image/svg+xml;utf8,${svg}`;
            }}
          />
        ) : (
          <img
            src="/assets/logo-placeholder.svg"
            alt={company.name}
            className="w-16 h-16 rounded-lg object-contain bg-white p-1 border border-border"
          />
        )}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{company.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {company.short_name && <span className="text-xs text-muted-foreground">{company.short_name}</span>}
            {company.category && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {company.category}
              </span>
            )}
            {company.website_url && (
              <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary flex items-center gap-0.5">
                <ExternalLink className="w-3 h-3" /> Website
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Sticky sidebar nav */}
        <nav className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-20 space-y-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left',
                  activeSection === s.id
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              </button>
            ))}
          </div>
        </nav>

        {/* Content sections */}
        <div className="flex-1 space-y-6 min-w-0">
          <DetailSection id="overview" title="Company Overview" icon={<Building2 className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'incorporation_year', 'nature_of_company', 'headquarters_address',
              'operating_countries', 'office_count', 'office_locations', 'employee_size',
            ]} />
            <LongField label="Overview" value={company.overview_text} />
            <LongField label="History Timeline" value={company.history_timeline} />
            <LongField label="Recent News" value={company.recent_news} />
          </DetailSection>

          <DetailSection id="business" title="Business & Market" icon={<Briefcase className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'pain_points_addressed', 'focus_sectors', 'top_customers',
              'core_value_proposition', 'unique_differentiators', 'competitive_advantages',
              'weaknesses_gaps', 'key_challenges_needs', 'key_competitors',
              'tam', 'sam', 'som', 'market_share_percentage',
              'go_to_market_strategy', 'strategic_priorities',
            ]} />
            <LongField label="Offerings" value={company.offerings_description} />
            <LongField label="Future Projections" value={company.future_projections} />
          </DetailSection>

          <DetailSection id="timeline" title="Placement Timeline" icon={<Users className="w-4 h-4" />}>
            <p className="text-sm text-muted-foreground mb-4">Track the key placement milestones for this company and save them directly to its profile.</p>

            <div className="grid gap-4 lg:grid-cols-[1.75fr_1fr] mb-6">
              <EnhancedCard
                title="Milestone planner"
                description="Schedule each stage and update the result status in one place."
                variant="outlined"
              >
                <form className="space-y-4" onSubmit={savePlacementTimeline}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Registration Deadline</label>
                      <input
                        className="input mt-2"
                        type="date"
                        value={companyTimeline.registrationDeadline}
                        onChange={(e) => setCompanyTimeline((prev) => ({ ...prev, registrationDeadline: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Aptitude Round</label>
                      <input
                        className="input mt-2"
                        type="date"
                        value={companyTimeline.aptitudeRoundDate}
                        onChange={(e) => setCompanyTimeline((prev) => ({ ...prev, aptitudeRoundDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Technical Interview</label>
                      <input
                        className="input mt-2"
                        type="date"
                        value={companyTimeline.technicalInterviewDate}
                        onChange={(e) => setCompanyTimeline((prev) => ({ ...prev, technicalInterviewDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">HR Interview</label>
                      <input
                        className="input mt-2"
                        type="date"
                        value={companyTimeline.hrInterviewDate}
                        onChange={(e) => setCompanyTimeline((prev) => ({ ...prev, hrInterviewDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 items-end">
                    <div>
                      <label className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Result Status</label>
                      <select
                        className="input mt-2"
                        value={companyTimeline.resultStatus}
                        onChange={(e) => setCompanyTimeline((prev) => ({ ...prev, resultStatus: e.target.value }))}
                      >
                        <option value="">Select status</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <Button type="submit" className="h-12 w-full md:w-auto">
                      Save timeline
                    </Button>
                  </div>
                </form>
              </EnhancedCard>

              <EnhancedCard
                title="Progress overview"
                description={`${completedTimelineCount} of ${timelineSteps.length} milestones set`}
                variant="outlined"
              >
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Completion</span>
                      <span>{Math.round((completedTimelineCount / timelineSteps.length) * 100)}%</span>
                    </div>
                    <Progress value={(completedTimelineCount / timelineSteps.length) * 100} />
                  </div>

                  <div className="space-y-3">
                    {timelineSteps.map((step) => {
                      const isSet = Boolean(step.value);
                      const Icon = step.icon;
                      return (
                        <div key={step.id} className="rounded-2xl border border-border bg-background p-4">
                          <div className="flex items-start gap-3">
                            <span className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl ${isSet ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                                <EnhancedBadge
                                  label={isSet ? 'Scheduled' : 'Pending'}
                                  variant={isSet ? 'success' : 'warning'}
                                  size="sm"
                                />
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">{formatDateLabel(step.value)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </EnhancedCard>
            </div>
          </DetailSection>

          <DetailSection id="experiences" title="Interview Experiences" icon={<Briefcase className="w-4 h-4" />}>
            <EnhancedCard
              title="Share your experience"
              description="Help other students prepare by sharing stage-wise interview insights."
              variant="outlined"
            >
              <form className="space-y-4" onSubmit={addExperience}>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className="input"
                    placeholder="Interview rounds (Aptitude, Technical, HR)"
                    value={experienceForm.rounds}
                    onChange={(e) => setExperienceForm({ ...experienceForm, rounds: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="Your name (optional)"
                    value={experienceForm.author}
                    onChange={(e) => setExperienceForm({ ...experienceForm, author: e.target.value })}
                  />
                </div>
                <textarea
                  className="input h-28"
                  placeholder="Questions asked"
                  value={experienceForm.questions}
                  onChange={(e) => setExperienceForm({ ...experienceForm, questions: e.target.value })}
                />
                <textarea
                  className="input h-28"
                  placeholder="Preparation tips"
                  value={experienceForm.tips}
                  onChange={(e) => setExperienceForm({ ...experienceForm, tips: e.target.value })}
                />
                <Button type="submit">Share Experience</Button>
              </form>
            </EnhancedCard>

            {experience.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card/80 p-6 text-center">
                <p className="text-lg font-semibold text-foreground">Be the first student to share interview experience 🚀</p>
                <p className="mt-2 text-sm text-muted-foreground">Submit your interview details in the form above to help your peers prepare better.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {experience.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-base font-semibold text-foreground">{item.rounds}</p>
                      {item.author ? (
                        <span className="text-sm text-muted-foreground">Shared by {item.author}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Anonymous contributor</span>
                      )}
                    </div>
                    {item.questions && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-foreground">Questions asked</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{item.questions}</p>
                      </div>
                    )}
                    {item.tips && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-foreground">Preparation tips</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{item.tips}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DetailSection>

          <DetailSection id="rejection" title="Candidate Rejection Risk" icon={<Shield className="w-4 h-4" />}>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] mb-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <form className="space-y-4" onSubmit={analyzeRejection}>
                  <div className="grid gap-3 md:grid-cols-4">
                    <input
                      className="input"
                      placeholder="CGPA"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Backlogs"
                      value={backlogs}
                      onChange={(e) => setBacklogs(e.target.value)}
                    />
                    <input
                      className="input md:col-span-2"
                      placeholder="Skills (comma separated)"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                    />
                  </div>
                  <textarea
                    className="input h-24"
                    placeholder="Projects / keywords"
                    value={projectsInput}
                    onChange={(e) => setProjectsInput(e.target.value)}
                  />
                  <textarea
                    className="input h-28"
                    placeholder="Resume summary / achievements"
                    value={resumeSummary}
                    onChange={(e) => setResumeSummary(e.target.value)}
                  />
                  <Button type="submit">Estimate Risk</Button>
                </form>
              </div>

              {rejectionResult ? (
                <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated selection probability</p>
                    <div className="mt-2 flex items-end gap-3">
                      <p className="text-3xl font-semibold text-foreground">{(rejectionResult.probability * 100).toFixed(0)}%</p>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{riskLabel(rejectionResult.probability)}</span>
                    </div>
                  </div>
                  <div>
                    <Progress value={Math.round(rejectionResult.probability * 100)} />
                  </div>
                  <div className="grid gap-3">
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground mb-2">Risk factors</p>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {rejectionResult.reasons.length > 0 ? (
                          rejectionResult.reasons.map((reason) => <li key={reason}>{reason}</li>)
                        ) : (
                          <li>No major issues detected.</li>
                        )}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground mb-2">Missing skill suggestions</p>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {rejectionResult.missingSkills.length > 0 ? (
                          rejectionResult.missingSkills.map((skill) => <li key={skill}>{skill}</li>)
                        ) : (
                          <li>Profile looks aligned with this company.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-card/80 p-6 text-sm text-muted-foreground">
                  Fill the fields on the left and click <strong>Estimate Risk</strong> to get tailored candidate guidance.
                </div>
              )}
            </div>
          </DetailSection>

          <DetailSection id="culture" title="Culture, People & Work" icon={<Heart className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'work_culture_summary', 'hiring_velocity', 'employee_turnover',
              'avg_retention_tenure', 'manager_quality', 'psychological_safety',
              'feedback_culture', 'diversity_metrics', 'diversity_inclusion_score',
              'ethical_standards', 'layoff_history', 'burnout_risk', 'mission_clarity',
            ]} />
          </DetailSection>

          <DetailSection id="growth" title="Learning, Growth & Career Signal" icon={<GraduationCap className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'training_spend', 'onboarding_quality', 'learning_culture',
              'exposure_quality', 'mentorship_availability', 'internal_mobility',
              'promotion_clarity', 'tools_access', 'role_clarity', 'early_ownership',
              'work_impact', 'execution_thinking_balance', 'automation_level',
              'cross_functional_exposure', 'exit_opportunities', 'skill_relevance',
              'network_strength', 'global_exposure', 'external_recognition',
            ]} />
          </DetailSection>

          <DetailSection id="compensation" title="Compensation & Lifestyle" icon={<DollarSign className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'fixed_vs_variable_pay', 'bonus_predictability', 'esops_incentives',
              'family_health_insurance', 'relocation_support', 'lifestyle_benefits',
              'leave_policy', 'health_support',
            ]} />
          </DetailSection>

          <DetailSection id="logistics" title="Work Logistics & Safety" icon={<Globe className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'remote_policy_details', 'typical_hours', 'overtime_expectations',
              'weekend_work', 'flexibility_level', 'location_centrality',
              'public_transport_access', 'cab_policy', 'airport_commute_time',
              'office_zone_type', 'area_safety', 'safety_policies',
              'infrastructure_safety', 'emergency_preparedness',
            ]} />
          </DetailSection>

          <DetailSection id="financials" title="Financials, Risk & Stability" icon={<Shield className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'annual_revenue', 'annual_profit', 'revenue_mix', 'valuation',
              'yoy_growth_rate', 'profitability_status', 'key_investors',
              'recent_funding_rounds', 'total_capital_raised', 'burn_rate',
              'runway_months', 'burn_multiplier', 'esg_ratings', 'regulatory_status',
              'legal_issues', 'supply_chain_dependencies', 'geopolitical_risks', 'macro_risks',
            ]} />
          </DetailSection>

          <DetailSection id="technology" title="Technology & Innovation" icon={<Cpu className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'tech_stack', 'technology_partners', 'intellectual_property',
              'r_and_d_investment', 'ai_ml_adoption_level', 'cybersecurity_posture',
              'innovation_roadmap', 'product_pipeline', 'tech_adoption_rating',
              'partnership_ecosystem',
            ]} />
          </DetailSection>

          <DetailSection id="leadership" title="Leadership & Contacts" icon={<UserCircle className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'ceo_name', 'ceo_linkedin_url', 'key_leaders', 'board_members',
              'warm_intro_pathways', 'decision_maker_access', 'primary_contact_email',
              'primary_phone_number', 'contact_person_name', 'contact_person_title',
              'contact_person_email', 'contact_person_phone',
            ]} />
          </DetailSection>

          <DetailSection id="brand" title="Brand & Digital Presence" icon={<Megaphone className="w-4 h-4" />}>
            <FieldGrid company={company} fields={[
              'website_url', 'website_quality', 'website_rating', 'website_traffic_rank',
              'social_media_followers', 'glassdoor_rating', 'indeed_rating', 'google_rating',
              'linkedin_url', 'twitter_handle', 'facebook_url', 'instagram_url',
              'marketing_video_url', 'customer_testimonials', 'awards_recognitions',
              'brand_sentiment_score', 'event_participation',
            ]} />
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function DetailSection({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={`section-${id}`} className="rounded-lg border border-border bg-card p-5">
      <SectionHeader title={title} icon={icon} />
      {children}
    </section>
  );
}

function FieldGrid({ company, fields }: { company: Company; fields: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      {fields.map((field) => (
        <DataField
          key={field}
          label={formatFieldLabel(field)}
          value={String(company[field] ?? '')}
        />
      ))}
    </div>
  );
}

function LongField({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="mt-3">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-1">{label}</dt>
      <dd className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

function formatFieldLabel(field: string): string {
  return field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bUrl\b/g, 'URL')
    .replace(/\bCeo\b/g, 'CEO')
    .replace(/\bTam\b/g, 'TAM')
    .replace(/\bSam\b/g, 'SAM')
    .replace(/\bSom\b/g, 'SOM')
    .replace(/\bEsg\b/g, 'ESG')
    .replace(/\bR And D\b/g, 'R&D')
    .replace(/\bAi Ml\b/g, 'AI/ML')
    .replace(/\bYoy\b/g, 'YoY')
    .replace(/\bEsops\b/g, 'ESOPs');
}
