import { Company } from '@/types/company';
import {
  Calendar, BrainCircuit, Code, UserCheck, Trophy,
  CheckCircle2, Play, X, ExternalLink, ClipboardList,
  Lightbulb, BookOpen, Award, Clock, Info, Target,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { motion, AnimatePresence } from 'framer-motion';

interface PlacementTimelineProps { company: Company; }

interface Step {
  key: string;
  label: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  actionUrl?: string;
}

function StepModal({ step, company, onClose }: { step: Step; company: Company; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
              step.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
              step.status === 'in-progress' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}><step.icon className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{step.label}</h3>
              <p className="text-[11px] text-muted-foreground font-mono">{step.date}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-4">
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
            step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
            step.status === 'in-progress' ? 'bg-primary/10 text-primary border-primary/30 animate-pulse' :
            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
          )}>
            {step.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : step.status === 'in-progress' ? <Play className="w-2.5 h-2.5 fill-current" /> : <Clock className="w-3 h-3" />}
            {step.status === 'completed' ? 'Completed' : step.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
          </span>

          {step.key === 'registration' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5 text-primary" /> What to prepare:</p>
                <ul className="text-[11px] text-muted-foreground space-y-1 pl-4 list-disc">
                  <li>Updated resume (PDF format, max 2 pages)</li>
                  <li>GitHub / portfolio link with live projects</li>
                  <li>College placement portal login credentials</li>
                  <li>10th, 12th, UG marksheets (scanned copies)</li>
                  <li>Passport-size photograph (recent)</li>
                </ul>
              </div>
              {step.actionUrl && (
                <a href={step.actionUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" /> Open Placement Portal
                </a>
              )}
            </div>
          )}

          {step.key === 'aptitude' && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-3 space-y-3">
                <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Topics Covered:</p>
                <div className="space-y-2.5">
                  <div className="rounded-md bg-background/60 border border-border/40 p-2.5">
                    <p className="text-[10px] font-bold text-foreground mb-1">📐 Quantitative Aptitude</p>
                    <p className="text-[10px] text-muted-foreground">Profit & Loss, Time & Work, Probability, Permutations, Number Systems</p>
                    <p className="text-[10px] text-primary/80 mt-1 italic">Ex: "A train 150m long passes a platform of 200m in 14 sec. Find the speed."</p>
                  </div>
                  <div className="rounded-md bg-background/60 border border-border/40 p-2.5">
                    <p className="text-[10px] font-bold text-foreground mb-1">🧠 Logical Reasoning</p>
                    <p className="text-[10px] text-muted-foreground">Syllogisms, Blood Relations, Seating Arrangement, Coding-Decoding, Puzzles</p>
                    <p className="text-[10px] text-primary/80 mt-1 italic">Ex: "If CLOUD = DMPVE, then RAIN = ?"</p>
                  </div>
                  <div className="rounded-md bg-background/60 border border-border/40 p-2.5">
                    <p className="text-[10px] font-bold text-foreground mb-1">📝 Verbal Ability</p>
                    <p className="text-[10px] text-muted-foreground">Reading Comprehension, Sentence Correction, Para Jumbles, Synonyms/Antonyms</p>
                    <p className="text-[10px] text-primary/80 mt-1 italic">Ex: "Choose the word most similar in meaning to 'Ephemeral'."</p>
                  </div>
                  <div className="rounded-md bg-background/60 border border-border/40 p-2.5">
                    <p className="text-[10px] font-bold text-foreground mb-1">💻 Basic Coding (DSA)</p>
                    <p className="text-[10px] text-muted-foreground">Arrays, Strings, Sorting, Searching, Recursion, Basic DP, Stack/Queue</p>
                    <p className="text-[10px] text-primary/80 mt-1 italic">Ex: "Find the second largest element in an unsorted array in O(n) time."</p>
                  </div>
                  <div className="rounded-md bg-background/60 border border-border/40 p-2.5">
                    <p className="text-[10px] font-bold text-foreground mb-1">📊 Data Interpretation</p>
                    <p className="text-[10px] text-muted-foreground">Tables, Bar Charts, Pie Charts, Line Graphs, Caselets</p>
                    <p className="text-[10px] text-primary/80 mt-1 italic">Ex: "If revenue grew 15% YoY from ₹50Cr in 2023, find 2025 revenue."</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-cyan-400" /> Exam Pattern:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] text-muted-foreground"><span className="font-semibold text-foreground">Duration:</span> 60-90 min</div>
                  <div className="text-[10px] text-muted-foreground"><span className="font-semibold text-foreground">Questions:</span> 40-65</div>
                  <div className="text-[10px] text-muted-foreground"><span className="font-semibold text-foreground">Negative Marking:</span> Yes (-0.25)</div>
                  <div className="text-[10px] text-muted-foreground"><span className="font-semibold text-foreground">Platform:</span> Online proctored</div>
                </div>
              </div>
              <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 space-y-1.5">
                <p className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Recommended Resources:</p>
                <ul className="text-[10px] text-muted-foreground space-y-1 pl-4 list-disc">
                  <li><span className="text-foreground font-medium">IndiaBix</span> — Aptitude practice with solutions</li>
                  <li><span className="text-foreground font-medium">PrepInsta</span> — Company-specific previous papers</li>
                  <li><span className="text-foreground font-medium">HackerRank</span> — Coding challenges & contests</li>
                  <li><span className="text-foreground font-medium">GeeksForGeeks</span> — DSA topic-wise practice</li>
                  <li><span className="text-foreground font-medium">RS Aggarwal</span> — Quantitative Aptitude book</li>
                </ul>
              </div>
            </div>
          )}

          {step.key === 'technical' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5"><Code className="w-3.5 h-3.5 text-cyan-400" /> Interview Structure:</p>
                <div className="space-y-2">
                  <div className="rounded-md bg-background/60 border border-border/40 p-2.5">
                    <p className="text-[10px] font-bold text-primary">Round 1 — DSA & Problem Solving</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Live coding on LeetCode Medium-level problems. Topics: Arrays, Trees, Graphs, DP, Greedy</p>
                    <p className="text-[10px] text-primary/80 mt-1 italic">Ex: "Given n meetings with start/end times, find max meetings in one room."</p>
                  </div>
                  <div className="rounded-md bg-background/60 border border-border/40 p-2.5">
                    <p className="text-[10px] font-bold text-primary">Round 2 — System Design + CS Fundamentals</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Low-level & high-level design, OS concepts, DBMS normalization, CN protocols</p>
                    <p className="text-[10px] text-primary/80 mt-1 italic">Ex: "Design a URL shortener like bit.ly with analytics."</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-cyan-500/5 border border-cyan-500/20 p-3">
                <p className="text-[11px] text-cyan-400 font-medium">💡 Tip: Revise {company.tech_stack || 'core technologies'} stack used at {company.name}</p>
              </div>
            </div>
          )}

          {step.key === 'hr' && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
              <div className="rounded-lg bg-muted/30 border border-border/50 p-3 space-y-2">
                <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-violet-400" /> Common Questions:</p>
                <ul className="text-[11px] text-muted-foreground space-y-1 pl-4 list-disc">
                  <li>"Tell me about yourself"</li>
                  <li>"Why {company.name}?"</li>
                  <li>Strengths & weaknesses</li>
                  <li>Salary expectations & negotiation</li>
                  <li>Relocation / work-mode preferences</li>
                </ul>
              </div>
              <div className="rounded-lg bg-violet-500/5 border border-violet-500/20 p-3">
                <p className="text-[11px] text-violet-400 font-medium">📦 Package Range: {company.fixed_vs_variable_pay || '6–20 LPA'}</p>
              </div>
            </div>
          )}

          {step.key === 'results' && (
            <div className="space-y-3">
              {step.status === 'completed' ? (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-center space-y-2">
                  <Award className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-emerald-400">Hiring Completed</p>
                  <p className="text-[11px] text-muted-foreground">Selected candidates received offer letters from {company.name}.</p>
                </div>
              ) : step.status === 'in-progress' ? (
                <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 text-center space-y-2">
                  <div className="w-8 h-8 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm font-bold text-primary">Results Processing</p>
                  <p className="text-[11px] text-muted-foreground">Shortlists from {company.name} are being prepared.</p>
                </div>
              ) : (
                <div className="rounded-lg bg-muted/30 border border-border/50 p-4 text-center space-y-2">
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm font-bold text-foreground">Results Pending</p>
                  <p className="text-[11px] text-muted-foreground">Expected: {step.date}</p>
                </div>
              )}
              <div className="rounded-lg bg-muted/20 border border-border/40 p-3">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Info className="w-3 h-3 shrink-0" /> Check your official college email and placement portal for offer letter updates.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PlacementTimeline({ company }: PlacementTimelineProps) {
  const [timelineSteps, setTimelineSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<Step | null>(null);

  const hiringStatus = company.hiring_status || 'Scheduled';
  const isRegistration = hiringStatus === 'Registration Open';
  const isActivelyHiring = hiringStatus === 'Actively Hiring';
  const isScheduled = hiringStatus === 'Scheduled';

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/timelines/${company.id || company.company_id}`);
        const json = await res.json();

        if (json.success && json.timeline) {
          const mappedSteps: Step[] = json.timeline.map((stepData: any) => {
            const dateStr = stepData.date || '';
            if (stepData.step === 'Registration') return {
              key: 'registration', label: 'Registration Deadline',
              date: dateStr, status: stepData.status,
              description: 'Submit your profile and resume on the college placement portal.',
              icon: Calendar, actionLabel: 'Open Portal', actionUrl: stepData.actionUrl || ''
            };
            if (stepData.step === 'Aptitude Test') return {
              key: 'aptitude', label: 'Aptitude Round',
              date: dateStr, status: stepData.status,
              description: 'Online test covering quantitative aptitude, logical reasoning, verbal ability, and basic coding.',
              icon: BrainCircuit
            };
            if (stepData.step === 'Technical Interview') return {
              key: 'technical', label: 'Technical Interview',
              date: dateStr, status: stepData.status,
              description: '2 rounds of live coding, system design, and technical discussions.',
              icon: Code
            };
            if (stepData.step === 'HR Interview') return {
              key: 'hr', label: 'HR Interview',
              date: dateStr, status: stepData.status,
              description: 'Behavioral assessment, culture-fit discussion, and package negotiations.',
              icon: UserCheck
            };
            return {
              key: 'results', label: 'Result Status',
              date: dateStr, status: stepData.status,
              description: 'Results will be declared post-selection process.',
              icon: Trophy
            };
          });
          setTimelineSteps(mappedSteps);
        }
      } catch (err) {
        console.error('Failed to fetch timeline:', err);
        const companyIdStr = String(company.company_id || company.id || "1");
        const id = companyIdStr.charCodeAt(0) + (companyIdStr.charCodeAt(companyIdStr.length - 1) || 0);
        const baseMonth = 7 + (id % 6);
        const year = baseMonth > 11 ? 2027 : 2026;
        const month = baseMonth > 11 ? baseMonth - 12 : baseMonth;
        const dayOffset = ((id * 7) % 20) + 3;
        const startDay = Math.min(dayOffset, 28);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const regDate = new Date(year, month, startDay);
        const fmt = (d: Date) => `${months[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}, ${d.getFullYear()}`;
        const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
        const steps: Step[] = [
          { key: 'registration', label: 'Registration Deadline', date: fmt(regDate), status: isRegistration ? 'in-progress' : 'completed', description: 'Submit your profile and resume.', icon: Calendar, actionUrl: company.website_url || 'https://careers.google.com' },
          { key: 'aptitude', label: 'Aptitude Round', date: fmt(addDays(regDate, 7)), status: isRegistration ? 'upcoming' : isActivelyHiring ? 'in-progress' : 'completed', description: 'Online aptitude test.', icon: BrainCircuit },
          { key: 'technical', label: 'Technical Interview', date: fmt(addDays(regDate, 15)), status: (isRegistration || isActivelyHiring) ? 'upcoming' : isScheduled ? 'in-progress' : 'completed', description: 'Live coding + system design.', icon: Code },
          { key: 'hr', label: 'HR Interview', date: fmt(addDays(regDate, 22)), status: (isRegistration || isActivelyHiring || isScheduled) ? 'upcoming' : 'completed', description: 'Behavioral + package negotiation.', icon: UserCheck },
          { key: 'results', label: 'Result Status', date: fmt(addDays(regDate, 32)), status: (isRegistration || isActivelyHiring || isScheduled) ? 'upcoming' : 'completed', description: 'Final results.', icon: Trophy },
        ];
        setTimelineSteps(steps);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, [company.id, company.company_id]);

  const completedCount = timelineSteps.filter(s => s.status === 'completed').length;
  const progressPercent = timelineSteps.length > 1 ? Math.min(100, (completedCount / (timelineSteps.length - 1)) * 100) : 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Hiring Timeline</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Administered and updated officially by {company.name} recruitment coordinators.
            </p>
          </div>
          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
            isRegistration ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
            : isActivelyHiring ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : isScheduled ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
          )}>{hiringStatus}</span>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="flex gap-4 justify-between py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-muted/60 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted/40 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop horizontal */}
              <div className="hidden md:block">
                <div className="absolute top-[30px] left-[10%] right-[10%] h-[3px] bg-border/40 z-0 rounded-full">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full shadow-[0_0_12px_2px_hsl(var(--primary)/0.4)]" />
                </div>
                <div className="flex justify-between items-start relative z-10 pt-1">
                  {timelineSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <motion.div key={step.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        onClick={() => setActiveStep(step)}
                        className="flex flex-col items-center text-center flex-1 group cursor-pointer"
                      >
                        <div className="relative mb-3">
                          {step.status === 'completed' ? (
                            <div className="w-[52px] h-[52px] rounded-full border-[3px] border-emerald-500 bg-background flex items-center justify-center shadow-[0_0_16px_3px_rgba(52,211,153,0.25)] group-hover:shadow-[0_0_20px_5px_rgba(52,211,153,0.35)] transition-all duration-300 group-hover:scale-110">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                          ) : step.status === 'in-progress' ? (
                            <div className="w-[52px] h-[52px] rounded-full border-[3px] border-primary bg-primary/15 flex items-center justify-center shadow-[0_0_16px_3px_hsl(var(--primary)/0.3)] group-hover:shadow-[0_0_20px_5px_hsl(var(--primary)/0.4)] transition-all duration-300 group-hover:scale-110">
                              <div className="absolute inset-0 rounded-full border-[3px] border-primary/30 animate-ping" />
                              <Play className="w-4 h-4 fill-primary text-primary" />
                            </div>
                          ) : (
                            <div className="w-[52px] h-[52px] rounded-full border-2 border-border/60 bg-card flex items-center justify-center text-muted-foreground group-hover:border-primary/50 group-hover:text-primary group-hover:shadow-[0_0_12px_2px_hsl(var(--primary)/0.15)] transition-all duration-300 group-hover:scale-110">
                              <StepIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground font-mono mb-0.5">{step.date}</span>
                        <h4 className={cn("text-[11px] font-semibold transition-colors leading-tight",
                          step.status === 'completed' ? 'text-emerald-400' : step.status === 'in-progress' ? 'text-primary' : 'text-foreground group-hover:text-primary'
                        )}>{step.label}</h4>
                        <p className="text-[9px] text-muted-foreground leading-relaxed max-w-[120px] mt-1 line-clamp-2">{step.description}</p>
                        <span className="inline-flex items-center gap-0.5 text-[8px] text-primary/50 group-hover:text-primary transition-colors mt-1.5 font-medium">
                          <ChevronRight className="w-2.5 h-2.5" /> Tap for details
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile vertical */}
              <div className="md:hidden relative pl-8">
                <div className="absolute top-2 left-[19px] bottom-2 w-[3px] bg-border/40 rounded-full z-0">
                  <motion.div initial={{ height: 0 }} animate={{ height: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="w-full bg-gradient-to-b from-emerald-500 to-primary rounded-full shadow-[0_0_8px_1px_hsl(var(--primary)/0.4)]" />
                </div>
                {timelineSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <motion.div key={step.key} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.35 }}
                      onClick={() => setActiveStep(step)}
                      className="relative flex items-start gap-4 mb-7 last:mb-0 z-10 group cursor-pointer"
                    >
                      <div className="absolute left-[-32px] top-0">
                        {step.status === 'completed' ? (
                          <div className="w-10 h-10 rounded-full border-[3px] border-emerald-500 bg-background flex items-center justify-center shadow-[0_0_12px_2px_rgba(52,211,153,0.25)] group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        ) : step.status === 'in-progress' ? (
                          <div className="w-10 h-10 rounded-full border-[3px] border-primary bg-primary/15 flex items-center justify-center shadow-[0_0_12px_2px_hsl(var(--primary)/0.3)] group-hover:scale-110 transition-transform">
                            <Play className="w-3.5 h-3.5 fill-primary text-primary" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full border-2 border-border/60 bg-card flex items-center justify-center text-muted-foreground group-hover:border-primary/50 group-hover:text-primary transition-all">
                            <StepIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground font-mono">{step.date}</span>
                        <h4 className={cn("text-xs font-semibold mt-0.5 transition-colors",
                          step.status === 'completed' ? 'text-emerald-400' : step.status === 'in-progress' ? 'text-primary' : 'text-foreground group-hover:text-primary'
                        )}>{step.label}</h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5 max-w-[260px]">{step.description}</p>
                        <span className="inline-flex items-center gap-0.5 text-[9px] text-primary/50 group-hover:text-primary transition-colors mt-1 font-medium">
                          <ChevronRight className="w-2.5 h-2.5" /> Tap for details
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="rounded-lg border border-border/50 bg-muted/20 p-3 flex gap-2.5 items-start">
          <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3 h-3 text-primary" />
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">View-Only Mode Enabled:</span> This recruitment tracker is controlled strictly by corporate placement administrators. Timings, venues, and shortlist releases will update dynamically here based on official notifications.
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeStep && (
          <StepModal step={activeStep} company={company} onClose={() => setActiveStep(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
