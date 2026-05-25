import { useState } from 'react';
import { Company } from '@/types/company';
import {
  AlertTriangle, CheckCircle, HelpCircle, ArrowRight, RefreshCw,
  BarChart, FileText, Zap, Award, Plus, Trash2, ExternalLink,
  BookOpen, Code2, Brain, Cloud, MessageSquare, Database, Terminal,
  TrendingUp, Target, Lightbulb, ShieldAlert, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RejectionRiskEngineProps {
  company: Company;
}

interface Project {
  title: string;
  technologies: string;
  description: string;
  link: string;
}

/* ── Skill Category Definitions ── */
const SKILL_CATEGORIES: Record<string, { label: string; icon: typeof Code2; color: string; keywords: string[] }> = {
  dsa: {
    label: 'DSA & Algorithms',
    icon: Brain,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/25',
    keywords: ['data structures', 'algorithms', 'dsa', 'leetcode', 'competitive programming', 'dynamic programming', 'graph', 'tree', 'sorting', 'searching', 'recursion', 'backtracking', 'greedy', 'binary search', 'linked list', 'stack', 'queue', 'heap', 'hashing'],
  },
  webdev: {
    label: 'Web Development',
    icon: Code2,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
    keywords: ['react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'html', 'css', 'javascript', 'typescript', 'tailwind', 'bootstrap', 'sass', 'webpack', 'vite', 'rest api', 'graphql', 'django', 'flask', 'spring boot', 'frontend', 'backend', 'fullstack', 'full stack', 'web development'],
  },
  aiml: {
    label: 'AI / ML',
    icon: Sparkles,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    keywords: ['machine learning', 'deep learning', 'ai', 'artificial intelligence', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'nlp', 'computer vision', 'neural network', 'cnn', 'rnn', 'lstm', 'transformer', 'gpt', 'bert', 'reinforcement learning', 'data science', 'pandas', 'numpy', 'matplotlib'],
  },
  cloud: {
    label: 'Cloud & DevOps',
    icon: Cloud,
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
    keywords: ['aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd', 'devops', 'linux', 'nginx', 'heroku', 'vercel', 'netlify', 'serverless', 'lambda', 'microservices', 'cloud computing'],
  },
  communication: {
    label: 'Communication',
    icon: MessageSquare,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    keywords: ['communication', 'presentation', 'public speaking', 'leadership', 'teamwork', 'team management', 'problem solving', 'critical thinking', 'negotiation', 'interpersonal', 'collaboration', 'agile', 'scrum', 'management', 'mentoring'],
  },
  database: {
    label: 'Database',
    icon: Database,
    color: 'text-orange-400 bg-orange-500/10 border-orange-500/25',
    keywords: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'firebase', 'supabase', 'nosql', 'oracle', 'database', 'dbms', 'cassandra', 'dynamodb', 'elasticsearch', 'sqlite'],
  },
  languages: {
    label: 'Programming Languages',
    icon: Terminal,
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/25',
    keywords: ['python', 'java', 'c++', 'c', 'javascript', 'typescript', 'go', 'golang', 'rust', 'kotlin', 'swift', 'ruby', 'php', 'r', 'scala', 'perl', 'dart', 'c#', 'matlab', 'shell', 'bash'],
  },
};

/* ── Categorize skills ── */
function categorizeSkills(skills: string[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  Object.keys(SKILL_CATEGORIES).forEach((cat) => (result[cat] = []));

  skills.forEach((skill) => {
    const s = skill.toLowerCase().trim();
    if (!s) return;
    let matched = false;
    Object.entries(SKILL_CATEGORIES).forEach(([cat, def]) => {
      if (def.keywords.some((kw) => s.includes(kw) || kw.includes(s))) {
        if (!result[cat].includes(skill.trim())) {
          result[cat].push(skill.trim());
        }
        matched = true;
      }
    });
    if (!matched) {
      // put uncategorized skills in languages as a fallback
      if (!result.languages.includes(skill.trim())) {
        result.languages.push(skill.trim());
      }
    }
  });
  return result;
}

/* ── Score Helpers ── */
function computeResumeStrength(
  description: string,
  projects: Project[],
  skillCount: number
): number {
  let score = 0;
  // Description length and quality
  const words = description.trim().split(/\s+/).filter(Boolean).length;
  if (words >= 120) score += 25;
  else if (words >= 60) score += 18;
  else if (words >= 20) score += 10;
  else score += 3;

  // Keywords quality
  const qualityKeywords = ['internship', 'certification', 'achievement', 'award', 'hackathon', 'leadership', 'project', 'published', 'patent', 'research', 'volunteer', 'community', 'extracurricular', 'club', 'captain', 'president', 'coordinator'];
  const descLower = description.toLowerCase();
  const keywordHits = qualityKeywords.filter((kw) => descLower.includes(kw)).length;
  score += Math.min(keywordHits * 4, 20);

  // Projects
  const validProjects = projects.filter((p) => p.title.trim() && p.description.trim());
  if (validProjects.length >= 3) score += 25;
  else if (validProjects.length >= 2) score += 18;
  else if (validProjects.length >= 1) score += 12;
  else score += 2;

  // Projects with links
  const withLinks = validProjects.filter((p) => p.link.trim().startsWith('http'));
  score += Math.min(withLinks.length * 3, 9);

  // Skills breadth
  if (skillCount >= 10) score += 21;
  else if (skillCount >= 6) score += 15;
  else if (skillCount >= 3) score += 8;
  else score += 2;

  return Math.min(Math.max(score, 5), 100);
}

function computeCategoryScore(skills: string[]): number {
  if (skills.length >= 5) return 90 + Math.floor(Math.random() * 10);
  if (skills.length >= 3) return 65 + Math.floor(Math.random() * 20);
  if (skills.length >= 1) return 35 + Math.floor(Math.random() * 20);
  return 5 + Math.floor(Math.random() * 10);
}

/* ── Progress Bar Component ── */
function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-border/40 rounded-full overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-700 ease-out', color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ── Score Card Component ── */
function ScoreCard({
  label,
  score,
  icon,
  color,
  description,
}: {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}) {
  const ring = score >= 75 ? 'border-emerald-500/30' : score >= 45 ? 'border-amber-500/30' : 'border-rose-500/30';
  const textColor = score >= 75 ? 'text-emerald-400' : score >= 45 ? 'text-amber-400' : 'text-rose-400';
  return (
    <div className={cn('rounded-lg border bg-card p-3.5 space-y-2', ring)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('w-7 h-7 rounded-md flex items-center justify-center', color)}>
            {icon}
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className={cn('text-lg font-bold font-mono', textColor)}>{score}<span className="text-[10px] text-muted-foreground">/100</span></span>
      </div>
      <ProgressBar value={score} color={score >= 75 ? 'bg-emerald-500' : score >= 45 ? 'bg-amber-500' : 'bg-rose-500'} />
      {description && <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

/* ── Collapsible Section Wrapper ── */
function CollapsibleSection({
  id,
  title,
  icon: Icon,
  children,
  badge,
  expandedSection,
  toggle,
}: {
  id: string;
  title: string;
  icon: any;
  children: React.ReactNode;
  badge?: string;
  expandedSection: string | null;
  toggle: (id: string) => void;
}) {
  const isOpen = expandedSection === id;
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</span>
          {badge && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">{badge}</span>}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {isOpen && <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">{children}</div>}
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function RejectionRiskEngine({ company }: RejectionRiskEngineProps) {
  const [evaluated, setEvaluated] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('basics');

  // Basic Inputs (existing)
  const [cgpa, setCgpa] = useState<number>(8.0);
  const [codingScore, setCodingScore] = useState<number>(7);
  const [csFundamentals, setCsFundamentals] = useState<number>(7);
  const [mockInterviews, setMockInterviews] = useState<string>('3-5');
  const [activeBacklogs, setActiveBacklogs] = useState<boolean>(false);

  // Resume Description
  const [resumeDescription, setResumeDescription] = useState<string>('');

  // Projects
  const [projects, setProjects] = useState<Project[]>([
    { title: '', technologies: '', description: '', link: '' },
  ]);

  // Skills
  const [skillsInput, setSkillsInput] = useState<string>('');

  // Suggested Improvements Notes
  const [notes, setNotes] = useState<string>('');

  // Evaluation Outputs
  const [riskPercent, setRiskPercent] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [gaps, setGaps] = useState<string[]>([]);
  const [mitigations, setMitigations] = useState<string[]>([]);
  const [categorizedSkills, setCategorizedSkills] = useState<Record<string, string[]>>({});
  const [categoryScores, setCategoryScores] = useState<Record<string, number>>({});
  const [resumeStrength, setResumeStrength] = useState<number>(0);
  const [overallReadiness, setOverallReadiness] = useState<number>(0);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<{ area: string; suggestion: string }[]>([]);
  const [eligibilityWarnings, setEligibilityWarnings] = useState<string[]>([]);

  // ── Add / remove project rows ──
  const addProject = () => {
    setProjects([...projects, { title: '', technologies: '', description: '', link: '' }]);
  };
  const removeProject = (idx: number) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };
  const updateProject = (idx: number, field: keyof Project, value: string) => {
    const copy = [...projects];
    copy[idx] = { ...copy[idx], [field]: value };
    setProjects(copy);
  };

  // ── Collapsible section toggle ──
  const toggle = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // ── Master Analysis Algorithm ──
  const handleAnalyze = async () => {
    let score = 100;
    const newStrengths: string[] = [];
    const newGaps: string[] = [];
    const newMitigations: string[] = [];
    const newWarnings: string[] = [];

    const category = company.category;
    const isTechGiant = category === 'Tech Giants';
    const isProduct = category === 'Product Companies';

    try {
      // ─── 0. Fetch Company Baseline Risk from Backend ───
      const res = await fetch(`/api/risk-analysis/${company.id || company.company_id}`);
      const data = await res.json();
      if (data.success && data.analysis) {
        score = 100 - (data.analysis.score - 50); // Adjust baseline score based on company risk
        if (data.analysis.key_factors) {
          data.analysis.key_factors.forEach((factor: string) => {
            newWarnings.push(`Company Profile Factor: ${factor}`);
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch backend risk analysis", err);
    }

    // ─── 1. CGPA ───
    if (cgpa >= 8.5) {
      newStrengths.push(`Excellent academic standing (CGPA: ${cgpa})`);
      score -= 5;
    } else if (cgpa >= 7.5) {
      if (isTechGiant) {
        newGaps.push(`CGPA (${cgpa}) slightly below typical SDE bar for ${company.name} (≥ 8.5)`);
        score -= 20;
      } else {
        newStrengths.push(`Solid academic score (CGPA: ${cgpa})`);
        score -= 8;
      }
    } else if (cgpa >= 6.0) {
      newGaps.push(`CGPA (${cgpa}) triggers standard cut-off filter for most companies`);
      score -= 30;
    } else {
      newGaps.push(`Critical: CGPA (${cgpa}) below minimum eligibility (6.0) for most companies`);
      newWarnings.push(`Your CGPA (${cgpa}) is below the minimum 6.0 threshold. You may be ineligible for shortlisting at ${company.name}.`);
      score -= 45;
    }

    // ─── 2. Coding ───
    if (codingScore >= 9) {
      newStrengths.push(`Elite problem-solving & DSA rating (${codingScore}/10)`);
      score -= 5;
    } else if (codingScore >= 7) {
      if (isTechGiant) {
        newGaps.push(`Coding rating (${codingScore}/10) moderate for ${company.name}'s interview bar`);
        score -= 25;
      } else {
        newStrengths.push(`Capable coding skills (${codingScore}/10)`);
        score -= 10;
      }
    } else {
      newGaps.push(`Critical Gap: Coding rating (${codingScore}/10) below standard hiring criteria`);
      score -= 40;
    }

    // ─── 3. CS Fundamentals ───
    if (csFundamentals >= 8) {
      newStrengths.push(`Strong core CS fundamentals (OS, DBMS, Networks)`);
      score -= 5;
    } else if (csFundamentals >= 6) {
      score -= 12;
    } else {
      newGaps.push(`Core CS concepts need refinement`);
      score -= 20;
    }

    // ─── 4. Mock Interviews ───
    if (mockInterviews === '5+') {
      newStrengths.push(`High interview readiness (${mockInterviews} mock tests)`);
      score -= 5;
    } else if (mockInterviews === '3-5') {
      score -= 10;
    } else {
      newGaps.push(`Low interview practice (${mockInterviews} mocks)`);
      score -= 22;
    }

    // ─── 5. Backlogs ───
    if (activeBacklogs) {
      newGaps.push('Active backlogs → immediate disqualification from most placement shortlists');
      newWarnings.push('Active backlogs will disqualify you from corporate placements. Clear them before recruitment begins.');
      score -= 50;
    } else {
      newStrengths.push('Zero active backlogs (Eligible)');
    }

    // ─── 6. Skills Analysis ───
    const skillsList = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const catSkills = categorizeSkills(skillsList);
    setCategorizedSkills(catSkills);

    const catScores: Record<string, number> = {};
    Object.entries(catSkills).forEach(([cat, skills]) => {
      catScores[cat] = computeCategoryScore(skills);
    });
    setCategoryScores(catScores);

    // Skill breadth bonus/penalty
    const categoriesWithSkills = Object.values(catSkills).filter((arr) => arr.length > 0).length;
    if (categoriesWithSkills >= 5) {
      newStrengths.push(`Broad skill portfolio covering ${categoriesWithSkills} categories`);
      score -= 3;
    } else if (categoriesWithSkills <= 2 && skillsList.length > 0) {
      newGaps.push(`Narrow skill coverage — only ${categoriesWithSkills} categories represented`);
      score -= 12;
    }

    // ─── 7. Resume Strength ───
    const resStrength = computeResumeStrength(resumeDescription, projects, skillsList.length);
    setResumeStrength(resStrength);

    if (resStrength >= 75) {
      newStrengths.push(`Strong resume profile (score: ${resStrength}/100)`);
      score -= 5;
    } else if (resStrength >= 45) {
      score -= 12;
    } else {
      newGaps.push(`Resume description lacks depth (score: ${resStrength}/100)`);
      score -= 20;
    }

    // ─── 8. Project Strength ───
    const validProjects = projects.filter((p) => p.title.trim() && p.description.trim());
    if (validProjects.length >= 3) {
      newStrengths.push(`${validProjects.length} well-documented projects`);
    } else if (validProjects.length === 0) {
      newGaps.push('No projects described — recruiters rely heavily on project portfolios');
      score -= 15;
    }

    // ─── 9. Missing Skills Detection ───
    const companyTechStack = (company.tech_stack || 'React, Node.js, Python, SQL, AWS, Docker, Java').split(',').map((s) => s.trim().toLowerCase());
    const studentSkillsLower = skillsList.map((s) => s.toLowerCase());
    const missing = companyTechStack.filter((t) => !studentSkillsLower.some((s) => s.includes(t) || t.includes(s)));
    setMissingSkills(missing.map((s) => s.charAt(0).toUpperCase() + s.slice(1)));

    if (missing.length > 0) {
      newGaps.push(`${missing.length} skill(s) required by ${company.name} are missing from your profile`);
      score -= Math.min(missing.length * 4, 16);
    }

    // ─── Calculate Final Risk ───
    let computedRisk = 100 - score;
    if (computedRisk < 5) computedRisk = 5;
    if (computedRisk > 95) computedRisk = 95;
    setRiskPercent(computedRisk);

    let level: 'Low' | 'Medium' | 'High' = 'Medium';
    if (computedRisk < 30) level = 'Low';
    else if (computedRisk > 60) level = 'High';
    setRiskLevel(level);

    // ─── Overall Readiness Score ───
    const dsaScore = catScores.dsa || 10;
    const techScore = Math.round(
      ((catScores.webdev || 10) + (catScores.cloud || 10) + (catScores.database || 10) + (catScores.languages || 10)) / 4
    );
    const commScore = catScores.communication || 10;
    const projScore = validProjects.length >= 3 ? 85 : validProjects.length >= 2 ? 65 : validProjects.length >= 1 ? 40 : 10;

    const overall = Math.round(dsaScore * 0.25 + techScore * 0.25 + commScore * 0.1 + projScore * 0.15 + resStrength * 0.15 + (100 - computedRisk) * 0.1);
    setOverallReadiness(Math.min(overall, 100));

    // ─── Mitigations ───
    if (activeBacklogs) newMitigations.push('Consult the placement cell immediately regarding clearance exams or special exemptions.');
    if (codingScore < 8) {
      if (isTechGiant) newMitigations.push('Solve 80+ Medium/Hard LeetCode problems focused on Trees, Graphs, and Dynamic Programming.');
      else newMitigations.push('Complete SDE prep sheets (Striver/Love Babbar) focusing on Array, String, and Searching algorithms.');
    }
    if (cgpa < 8.0 && (isTechGiant || isProduct)) newMitigations.push('Compensate for CGPA with strong open source contributions, competitive programming profiles, or hackathon wins.');
    if (csFundamentals < 7) newMitigations.push('Study top 50 interview questions for OS processes, DBMS ACID transactions, and SQL subqueries.');
    if (mockInterviews === '0' || mockInterviews === '1-2') newMitigations.push('Schedule 3+ mock interviews on Pramp or conduct peer-to-peer live coding sessions.');
    if (resStrength < 60) newMitigations.push(`Align resume keywords with ${company.name}'s stack: ${company.tech_stack || 'React, SQL, Java'}. Use STAR method for project impact.`);
    if (missing.length > 0) newMitigations.push(`Learn missing skills: ${missing.slice(0, 5).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')} — these are key requirements for ${company.name}.`);
    if (newMitigations.length === 0) {
      newMitigations.push('Excellent work! Take 2 more mock tests this week to maintain peak performance.');
      newMitigations.push(`Review ${company.name}'s recent news, strategic priorities, and leadership profiles before your rounds.`);
    }

    // ─── Suggested Improvements ───
    const newImprovements: { area: string; suggestion: string }[] = [];
    if (catScores.dsa < 50) newImprovements.push({ area: 'DSA & Algorithms', suggestion: 'Practice 2 LeetCode problems daily. Focus on medium difficulty Trees and DP.' });
    if (catScores.webdev < 50) newImprovements.push({ area: 'Web Development', suggestion: 'Build a full-stack CRUD app with React + Node.js and deploy it.' });
    if (catScores.aiml < 50 && (company.tech_stack || '').toLowerCase().includes('ml')) newImprovements.push({ area: 'AI / ML', suggestion: 'Complete Andrew Ng\'s ML course and build 1 end-to-end ML project.' });
    if (catScores.cloud < 40) newImprovements.push({ area: 'Cloud & DevOps', suggestion: 'Get AWS Cloud Practitioner certified. Containerize one project with Docker.' });
    if (catScores.communication < 50) newImprovements.push({ area: 'Communication', suggestion: 'Join mock GD/PI sessions. Practice STAR-method responses for behavioral rounds.' });
    if (resStrength < 60) newImprovements.push({ area: 'Resume Quality', suggestion: 'Add quantifiable achievements (e.g., "reduced load time by 40%"). Use action verbs.' });
    if (validProjects.length < 2) newImprovements.push({ area: 'Project Portfolio', suggestion: 'Build 2-3 projects with real-world impact. Include GitHub links and live demos.' });
    if (newImprovements.length === 0) newImprovements.push({ area: 'General', suggestion: 'Your profile is strong! Focus on interview confidence and company-specific preparation.' });
    setImprovements(newImprovements);

    setStrengths(newStrengths);
    setGaps(newGaps);
    setMitigations(newMitigations);
    setEligibilityWarnings(newWarnings);
    setEvaluated(true);
  };

  const handleReset = () => {
    setEvaluated(false);
    setExpandedSection('basics');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Candidate Rejection Risk Engine</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Advanced resume, skill & project analysis against {company.name}'s placement benchmarks.
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
      </div>

      {!evaluated ? (
        /* ═══ INTAKE FORM ═══ */
        <div className="space-y-3">

          {/* Section 1 – Basic Metrics */}
          <CollapsibleSection id="basics" title="Academic & Coding Metrics" icon={BarChart} badge="Required" expandedSection={expandedSection} toggle={toggle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CGPA */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Current CGPA</label>
                  <span className="text-xs font-mono font-semibold text-primary">{cgpa.toFixed(1)}</span>
                </div>
                <input type="range" min="4.0" max="10.0" step="0.1" value={cgpa} onChange={(e) => setCgpa(parseFloat(e.target.value))} className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary" />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1"><span>4.0</span><span>7.0</span><span>10.0</span></div>
              </div>

              {/* Coding */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Coding & DSA Level</label>
                  <span className="text-xs font-mono font-semibold text-primary">{codingScore}/10</span>
                </div>
                <input type="range" min="1" max="10" step="1" value={codingScore} onChange={(e) => setCodingScore(parseInt(e.target.value))} className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary" />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1"><span>Novice</span><span>Average</span><span>Competitive</span></div>
              </div>

              {/* CS Fundamentals */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">CS Fundamentals (OS/DBMS)</label>
                  <span className="text-xs font-mono font-semibold text-primary">{csFundamentals}/10</span>
                </div>
                <input type="range" min="1" max="10" step="1" value={csFundamentals} onChange={(e) => setCsFundamentals(parseInt(e.target.value))} className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary" />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1"><span>None</span><span>Moderate</span><span>Excellent</span></div>
              </div>

              {/* Mock Interviews */}
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Mock Interviews Practiced</label>
                <select value={mockInterviews} onChange={(e) => setMockInterviews(e.target.value)} className="w-full rounded-md border border-border/60 bg-card px-2.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none">
                  <option value="0">0 (No mock practice)</option>
                  <option value="1-2">1-2 (Practiced with peers)</option>
                  <option value="3-5">3-5 (Active mock testing)</option>
                  <option value="5+">5+ (Extensively interviewed)</option>
                </select>
              </div>

              {/* Active Backlogs */}
              <div className="md:col-span-2">
                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block mb-1.5">Active Academic Backlogs</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setActiveBacklogs(true)} className={cn("flex-1 py-1.5 rounded-md border text-xs font-semibold uppercase tracking-wider transition-all", activeBacklogs ? "bg-destructive/15 text-destructive border-destructive/40 shadow-sm" : "bg-card text-muted-foreground border-border/70 hover:border-destructive/30")}>Yes, Active</button>
                  <button type="button" onClick={() => setActiveBacklogs(false)} className={cn("flex-1 py-1.5 rounded-md border text-xs font-semibold uppercase tracking-wider transition-all", !activeBacklogs ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-sm" : "bg-card text-muted-foreground border-border/70 hover:border-emerald-500/30")}>No Backlogs</button>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Section 2 – Resume Description */}
          <CollapsibleSection id="resume" title="Resume Description" icon={FileText} badge="New" expandedSection={expandedSection} toggle={toggle}>
            <div>
              <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                Describe your achievements, internships, certifications, strengths, and extracurricular activities. The more detailed, the better your Resume Strength Score.
              </p>
              <textarea
                value={resumeDescription}
                onChange={(e) => setResumeDescription(e.target.value)}
                placeholder="Describe your resume achievements..."
                rows={5}
                className="w-full rounded-md border border-border/60 bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary focus:outline-none resize-none leading-relaxed"
              />
              <p className="text-[9px] text-muted-foreground mt-1 text-right">
                {resumeDescription.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          </CollapsibleSection>

          {/* Section 3 – Projects */}
          <CollapsibleSection id="projects" title="Projects Portfolio" icon={Code2} badge={`${projects.length} Project${projects.length > 1 ? 's' : ''}`} expandedSection={expandedSection} toggle={toggle}>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="rounded-md border border-border/40 bg-card/60 p-3 space-y-2.5 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Project {idx + 1}</span>
                    {projects.length > 1 && (
                      <button type="button" onClick={() => removeProject(idx)} className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={proj.title}
                    onChange={(e) => updateProject(idx, 'title', e.target.value)}
                    placeholder="Project Title (e.g., E-Commerce Platform)"
                    rows={1}
                    className="w-full rounded-md border border-border/50 bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  />
                  <textarea
                    value={proj.technologies}
                    onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                    placeholder="Enter projects and technologies used..."
                    rows={2}
                    className="w-full rounded-md border border-border/50 bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  />
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    placeholder="Brief description of what you built and the impact..."
                    rows={3}
                    className="w-full rounded-md border border-border/50 bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  />
                  <input
                    type="text"
                    value={proj.link}
                    onChange={(e) => updateProject(idx, 'link', e.target.value)}
                    placeholder="GitHub / Live Demo Link (optional)"
                    className="w-full rounded-md border border-border/50 bg-card px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="w-full py-2 rounded-md border border-dashed border-border/60 text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Project
              </button>
            </div>
          </CollapsibleSection>

          {/* Section 4 – Skills */}
          <CollapsibleSection id="skills" title="Your Skills" icon={Target} badge="New" expandedSection={expandedSection} toggle={toggle}>
            <div>
              <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                Enter your skills separated by commas. They'll be auto-categorized into DSA, Web Dev, AI/ML, Cloud, Communication, Database, and Programming Languages.
              </p>
              <textarea
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="Enter skills separated by commas..."
                rows={3}
                className="w-full rounded-md border border-border/60 bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary focus:outline-none resize-none leading-relaxed"
              />
              {skillsInput && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skillsInput.split(',').map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Section 5 – Notes */}
          <CollapsibleSection id="notes" title="Suggested Improvements Notes" icon={FileText} badge="Optional" expandedSection={expandedSection} toggle={toggle}>
            <div>
              <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
                Add any extra notes or contexts for your suggested improvements.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type your notes here..."
                rows={3}
                className="w-full rounded-md border border-border/60 bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-primary focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </CollapsibleSection>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            className="w-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_-4px_hsl(var(--primary)/0.4)] py-5"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Resume & Calculate Risk
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        /* ═══ ANALYSIS DASHBOARD ═══ */
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">

          {/* ── Eligibility Warnings ── */}
          {eligibilityWarnings.length > 0 && (
            <div className="rounded-lg border-2 border-destructive/40 bg-destructive/5 p-4 space-y-2">
              <h5 className="text-xs text-destructive font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                Eligibility Warnings
              </h5>
              {eligibilityWarnings.map((w, i) => (
                <p key={i} className="text-xs text-destructive/90 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {w}
                </p>
              ))}
            </div>
          )}

          {/* ── Top Panel: Risk Gauge + Overall Readiness ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Risk Gauge */}
            <div className="rounded-lg border border-border bg-card p-4 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Rejection Probability</span>
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="46" stroke="hsl(var(--border))" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="56" cy="56" r="46"
                    stroke={riskLevel === 'Low' ? 'hsl(152, 60%, 45%)' : riskLevel === 'Medium' ? 'hsl(38, 92%, 50%)' : 'hsl(0, 72%, 51%)'}
                    strokeWidth="8" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - riskPercent / 100)} strokeLinecap="round" fill="transparent"
                    className="transition-all duration-700 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${riskLevel === 'Low' ? 'rgba(16,185,129,0.5)' : riskLevel === 'Medium' ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.6)'})` }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-foreground font-mono">{riskPercent}%</span>
                  <span className={cn("text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border mt-0.5", riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-destructive/10 text-destructive border-destructive/20')}>{riskLevel} RISK</span>
                </div>
              </div>
            </div>

            {/* Overall Readiness + Verdict */}
            <div className="md:col-span-2 rounded-lg border border-border bg-card p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Overall Placement Readiness</span>
                <div className="flex items-center gap-3">
                  <span className={cn("text-3xl font-bold font-mono", overallReadiness >= 70 ? 'text-emerald-400' : overallReadiness >= 45 ? 'text-amber-400' : 'text-rose-400')}>{overallReadiness}</span>
                  <span className="text-muted-foreground text-xs">/100</span>
                  <ProgressBar value={overallReadiness} color={overallReadiness >= 70 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : overallReadiness >= 45 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-rose-500 to-red-400'} />
                </div>
                <h4 className={cn("text-sm font-bold flex items-center gap-1.5", riskLevel === 'Low' ? 'text-emerald-400' : riskLevel === 'Medium' ? 'text-amber-400' : 'text-destructive')}>
                  {riskLevel === 'Low' && <CheckCircle className="w-4 h-4" />}
                  {riskLevel === 'Medium' && <AlertTriangle className="w-4 h-4" />}
                  {riskLevel === 'High' && <AlertTriangle className="w-4 h-4 animate-bounce" />}
                  {riskLevel === 'Low' && 'Highly Favorable Profile'}
                  {riskLevel === 'Medium' && 'Requires Targeted Enhancements'}
                  {riskLevel === 'High' && 'Critical Disqualification Warnings'}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {riskLevel === 'Low' && `Your profile aligns well with ${company.name}'s hiring requirements.`}
                  {riskLevel === 'Medium' && `Your profile has strengths but is exposed to filtration parameters at ${company.name}.`}
                  {riskLevel === 'High' && `Warning: Several parameters fall below ${company.name}'s selection thresholds.`}
                </p>
              </div>
              <Button onClick={handleReset} variant="secondary" size="sm" className="text-[10px] h-7 w-fit flex gap-1.5 items-center font-medium">
                <RefreshCw className="w-3 h-3" /> Re-evaluate Profile
              </Button>
            </div>
          </div>

          {/* ── Score Breakdown Cards ── */}
          <div>
            <h5 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart className="w-3.5 h-3.5 text-primary" />
              Detailed Score Breakdown
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <ScoreCard label="DSA Score" score={categoryScores.dsa || 10} icon={<Brain className="w-3.5 h-3.5 text-violet-400" />} color="bg-violet-500/10" description="Data Structures & Algorithms proficiency" />
              <ScoreCard label="Technical Skills" score={Math.round(((categoryScores.webdev || 10) + (categoryScores.cloud || 10) + (categoryScores.database || 10) + (categoryScores.languages || 10)) / 4)} icon={<Code2 className="w-3.5 h-3.5 text-cyan-400" />} color="bg-cyan-500/10" description="Web, Cloud, DB & Language breadth" />
              <ScoreCard label="Communication" score={categoryScores.communication || 10} icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />} color="bg-emerald-500/10" description="Soft skills & leadership" />
              <ScoreCard label="Project Strength" score={projects.filter(p => p.title.trim() && p.description.trim()).length >= 3 ? 85 : projects.filter(p => p.title.trim() && p.description.trim()).length >= 2 ? 65 : projects.filter(p => p.title.trim() && p.description.trim()).length >= 1 ? 40 : 10} icon={<FileText className="w-3.5 h-3.5 text-amber-400" />} color="bg-amber-500/10" description="Portfolio depth & quality" />
              <ScoreCard label="Resume Strength" score={resumeStrength} icon={<Award className="w-3.5 h-3.5 text-pink-400" />} color="bg-pink-500/10" description="Description quality & keyword match" />
              <ScoreCard label="Placement Readiness" score={overallReadiness} icon={<Target className="w-3.5 h-3.5 text-primary" />} color="bg-primary/10" description="Weighted overall score" />
            </div>
          </div>

          {/* ── Skill Category Breakdown ── */}
          {Object.values(categorizedSkills).some(arr => arr.length > 0) && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <h5 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-primary" />
                Skill Category Analysis
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(SKILL_CATEGORIES).map(([cat, def]) => {
                  const skills = categorizedSkills[cat] || [];
                  const score = categoryScores[cat] || 0;
                  const CatIcon = def.icon;
                  if (skills.length === 0) return null;
                  return (
                    <div key={cat} className={cn("rounded-md border p-3 space-y-2", def.color)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CatIcon className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{def.label}</span>
                        </div>
                        <span className="text-xs font-bold font-mono">{score}/100</span>
                      </div>
                      <ProgressBar value={score} color={score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'} />
                      <div className="flex flex-wrap gap-1">
                        {skills.map((s, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-background/50 border border-border/50 text-foreground font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Missing Skills ── */}
          {missingSkills.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 space-y-2.5">
              <h5 className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Missing Skills for {company.name}
              </h5>
              <p className="text-[10px] text-muted-foreground">These skills are part of {company.name}'s tech requirements but missing from your profile:</p>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((s, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Strengths & Gaps ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-4 space-y-2.5">
              <h5 className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Strengths</h5>
              <ul className="space-y-1.5 text-xs text-foreground font-medium">
                {strengths.map((s, i) => (<li key={i} className="flex items-start gap-1.5"><span className="text-emerald-400 shrink-0">✓</span><span>{s}</span></li>))}
                {strengths.length === 0 && <li className="text-muted-foreground italic text-[11px]">No matching metrics yet.</li>}
              </ul>
            </div>
            <div className="rounded-lg border border-destructive/15 bg-destructive/5 p-4 space-y-2.5">
              <h5 className="text-[10px] text-destructive font-bold uppercase tracking-wider flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Gaps & Risk Factors</h5>
              <ul className="space-y-1.5 text-xs text-foreground font-medium">
                {gaps.map((g, i) => (<li key={i} className="flex items-start gap-1.5"><span className="text-destructive shrink-0">!</span><span>{g}</span></li>))}
                {gaps.length === 0 && <li className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> All core cutoffs cleared!</li>}
              </ul>
            </div>
          </div>

          {/* ── Suggested Improvements ── */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
            <h5 className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              Suggested Improvements
            </h5>
            <div className="space-y-2.5">
              {improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-auto shrink-0">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider whitespace-nowrap">{imp.area}</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{imp.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Risk Mitigation Plan ── */}
          <div className="rounded-lg border border-border bg-card p-4 space-y-3 shadow-md">
            <h5 className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
              <Award className="w-4 h-4 text-primary" />
              Tailored Risk Mitigation Plan
            </h5>
            <div className="space-y-2.5">
              {mitigations.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-[10px] text-primary shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-foreground leading-relaxed pt-0.5">{act}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
