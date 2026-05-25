import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { MessageSquare, ThumbsUp, Trash2, Search, Plus, User, Calendar, Award, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { API_BASE_URL } from '@/config/api';

interface InterviewExperience {
  id: string;
  name: string;
  role: string;
  year: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  verdict: 'Selected' | 'Rejected' | 'Waitlisted';
  rating: number;
  experience: string;
  prepTips: string;
  helpfulnessCount: number;
  isCustom?: boolean; // track if added by user
}

interface InterviewExperienceSectionProps {
  company: Company;
}

// Seed reviews by category
const getPreseededReviews = (company: Company): InterviewExperience[] => {
  const idNum = Number(company.company_id || 1);
  const companyName = company.name;
  const category = company.category;

  if (category === 'Tech Giants') {
    return [
      {
        id: `seeded-1-${idNum}`,
        name: 'Aditya Sharma',
        role: 'Software Development Engineer (SDE-1)',
        year: 2025,
        difficulty: 'Hard',
        verdict: 'Selected',
        rating: 5,
        experience: 'The recruitment process had 1 online test and 3 technical rounds. The coding rounds were focused heavily on Graph Algorithms (Dijkstra variations) and Dynamic Programming (multi-dimensional). The interviewers were very focused on optimization — they wanted the exact space and time complexities. Round 3 included SRE/System Design concepts (Load balancers, Caching strategies for a tinyURL service).',
        prepTips: 'Solve at least 400+ LeetCode problems. Focus heavily on graphs, trees, and backtracking. For Google/Microsoft, read "Designing Data-Intensive Applications".',
        helpfulnessCount: 42
      },
      {
        id: `seeded-2-${idNum}`,
        name: 'Rohan Deshmukh',
        role: 'SDE Intern',
        year: 2025,
        difficulty: 'Medium',
        verdict: 'Waitlisted',
        rating: 4,
        experience: 'Highly competitive! Round 1 was focused on sliding window and priority queues. In Round 2, I was asked to design a rate limiter in code. The interviewer was friendly but pushed me to explain my design decisions in depth. Unfortunately, I slipped up slightly on a trie-based question in the second round.',
        prepTips: 'Practice writing clean code on a whiteboard or google doc without autocomplete. Explain your thought process out loud.',
        helpfulnessCount: 18
      }
    ];
  } else if (category === 'Product Companies') {
    return [
      {
        id: `seeded-1-${idNum}`,
        name: 'Nehal Kulkarni',
        role: 'Member of Technical Staff',
        year: 2025,
        difficulty: 'Medium',
        verdict: 'Selected',
        rating: 4,
        experience: 'Had an SDE assessment on HackerEarth with 3 coding questions (medium difficulty, arrays, strings, trees). Round 1 was a deep dive into OOPs principles, Java memory management (JVM tuning), and a coding question on binary tree traversals. Round 2 was a low-level design round where I had to design a Parking Lot system using design patterns (Singleton, Factory).',
        prepTips: 'Revise OOPs concepts, SOLID principles, and low-level design patterns thoroughly. SQL joins and indexing are also commonly asked.',
        helpfulnessCount: 26
      }
    ];
  } else if (category === 'Startups / Scale-ups') {
    return [
      {
        id: `seeded-1-${idNum}`,
        name: 'Tanvi Gowda',
        role: 'Full Stack Developer',
        year: 2025,
        difficulty: 'Medium',
        verdict: 'Selected',
        rating: 5,
        experience: 'Very quick and practical recruitment! They gave me a 24-hour take-home coding assignment to build a live React application with Node.js backend. In the interview, they walked through my repository, asked why I used specific state management (Redux vs Context), and then made me live-debug a React component. The HR round was heavily focused on growth mindset.',
        prepTips: 'Build personal projects! You must be extremely fluent in JS/TS, React, async-await, REST API designs, and databases (MongoDB/Postgres).',
        helpfulnessCount: 31
      }
    ];
  } else {
    // Services
    return [
      {
        id: `seeded-1-${idNum}`,
        name: 'Shankar Gowda',
        role: 'Associate Software Engineer',
        year: 2025,
        difficulty: 'Easy',
        verdict: 'Selected',
        rating: 4,
        experience: 'The recruitment process was divided into a cognitive assessment, an English proficiency test, and a combined Technical + HR interview. The technical questions were fairly basic: reverse a string, bubble sort, difference between SQL and NoSQL, and a walk-through of my final year college project. Excellent and straightforward communication is the key!',
        prepTips: 'Make sure your final year project details are crystal clear. Prepare basic puzzles, OOP definitions, and basic coding questions (fibonacci, primes, palindromes).',
        helpfulnessCount: 15
      }
    ];
  }
};

export default function InterviewExperienceSection({ company }: InterviewExperienceSectionProps) {
  const companyId = company.id || String(company.company_id || 'general');
  const storageKey = `experiences-${companyId}`;

  // Experiences State
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [formRole, setFormRole] = useState(company.role || 'Software Development Engineer');
  const [formYear, setFormYear] = useState(2026);
  const [formDifficulty, setFormDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [formVerdict, setFormVerdict] = useState<'Selected' | 'Rejected' | 'Waitlisted'>('Selected');
  const [formRating, setFormRating] = useState(4);
  const [formExpText, setFormExpText] = useState('');
  const [formPrepTips, setFormPrepTips] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterVerdict, setFilterVerdict] = useState<string>('All');

  // Load experiences on mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/experiences/${companyId}`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setExperiences(json.data);
        } else {
          // Fallback to seeds if backend table is empty
          setExperiences(getPreseededReviews(company));
        }
      } catch(err) {
        console.error('Failed to fetch experiences', err);
        setExperiences(getPreseededReviews(company));
      }
    };
    fetchExperiences();
  }, [companyId, company]);

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formExpText.trim() || !formPrepTips.trim()) return;

    const newExp = {
      company_id: companyId,
      name: anonymous ? 'Anonymous Candidate' : (formName.trim() || 'Anonymous Candidate'),
      role: formRole.trim(),
      year: Number(formYear),
      difficulty: formDifficulty,
      verdict: formVerdict,
      rating: formRating,
      experience: formExpText.trim(),
      prepTips: formPrepTips.trim(),
      helpfulnessCount: 0,
      isCustom: true
    };

    try {
      const res = await fetch(`${API_BASE_URL}/experiences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExp)
      });
      const json = await res.json();
      
      // Update local state to show the new post immediately
      // If the backend returns an id, use it, otherwise use a temporary one
      const addedExp = json.data?.[0] || { ...newExp, id: `custom-${Date.now()}` };
      setExperiences([addedExp, ...experiences]);
    } catch(err) {
      console.error('Failed to post experience', err);
      // Fallback for UI if network fails
      setExperiences([{ ...newExp, id: `custom-${Date.now()}` } as any, ...experiences]);
    }

    // Reset Form
    setFormName('');
    setAnonymous(false);
    setFormExpText('');
    setFormPrepTips('');
    setShowForm(false);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    const updated = experiences.filter(exp => exp.id !== id);
    setExperiences(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Handle Helpfulness Upvote
  const handleUpvote = (id: string) => {
    const updated = experiences.map(exp => {
      if (exp.id === id) {
        return { ...exp, helpfulnessCount: exp.helpfulnessCount + 1 };
      }
      return exp;
    });
    setExperiences(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Filtered Experiences
  const filtered = experiences.filter(exp => {
    const matchSearch = 
      exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.experience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.prepTips.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchDiff = filterDifficulty === 'All' || exp.difficulty === filterDifficulty;
    const matchVerd = filterVerdict === 'All' || exp.verdict === filterVerdict;

    return matchSearch && matchDiff && matchVerd;
  });

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Interview Experience Hub</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Read interview reviews, prepare DSA questions, and contribute your own!
          </p>
        </div>
        <Button 
          size="sm" 
          className="text-xs h-8 flex gap-1.5 items-center font-medium"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'View Experiences' : 'Share Experience'}
          <Plus className={cn("w-3.5 h-3.5 transition-transform", showForm && "rotate-45")} />
        </Button>
      </div>

      {/* Sharing Form Modal / Drawer style */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3.5 animate-fadeIn">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Contribute Experience</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Your Name</label>
              <Input
                placeholder="e.g. Rahul K"
                disabled={anonymous}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-card h-8 text-xs border-border/60"
              />
              <div className="flex items-center gap-1.5 mt-1.5">
                <input
                  type="checkbox"
                  id="anon"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="rounded bg-card border-border/80 text-primary focus:ring-primary w-3 h-3 cursor-pointer"
                />
                <label htmlFor="anon" className="text-[10px] text-muted-foreground cursor-pointer font-medium select-none">
                  Share Anonymously
                </label>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Role Interviewed For</label>
              <Input
                placeholder="e.g. SDE-1"
                required
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="bg-card h-8 text-xs border-border/60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Year</label>
              <select
                value={formYear}
                onChange={(e) => setFormYear(Number(e.target.value))}
                className="w-full rounded-md border border-border/60 bg-card px-2.5 py-1 text-xs h-8 text-foreground"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Difficulty</label>
              <select
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value as any)}
                className="w-full rounded-md border border-border/60 bg-card px-2.5 py-1 text-xs h-8 text-foreground"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Verdict</label>
              <select
                value={formVerdict}
                onChange={(e) => setFormVerdict(e.target.value as any)}
                className="w-full rounded-md border border-border/60 bg-card px-2.5 py-1 text-xs h-8 text-foreground"
              >
                <option value="Selected">Selected</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Overall Rating</label>
              <div className="flex items-center gap-1 h-8 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormRating(s)}
                    className="text-amber-400 focus:outline-none"
                  >
                    <Star className={cn("w-4 h-4", s <= formRating ? "fill-amber-400" : "text-muted")} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Interview Rounds & Process</label>
            <textarea
              placeholder="Describe the online test, interview phases, coding questions, system design details, or HR assessment..."
              required
              rows={4}
              value={formExpText}
              onChange={(e) => setFormExpText(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-card p-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-muted-foreground uppercase font-semibold block mb-1">Preparation Tips & Recommended Topics</label>
            <textarea
              placeholder="What DSA topics, CS core concepts, or web stacks should peers focus on? Recommend specific resources."
              required
              rows={2}
              value={formPrepTips}
              onChange={(e) => setFormPrepTips(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-card p-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <Button type="submit" size="sm" className="w-full font-bold h-8">Submit Experience</Button>
        </form>
      )}

      {/* Toolbar / Search / Filters */}
      {!showForm && (
        <div className="space-y-2.5">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by topic, coding questions, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-card h-8 text-xs border-border/60"
              />
            </div>
            {/* Filters Select */}
            <div className="flex gap-1.5 shrink-0">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="rounded-md border border-border/60 bg-card px-2.5 py-1 text-[11px] h-8 text-muted-foreground"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={filterVerdict}
                onChange={(e) => setFilterVerdict(e.target.value)}
                className="rounded-md border border-border/60 bg-card px-2.5 py-1 text-[11px] h-8 text-muted-foreground"
              >
                <option value="All">All Verdicts</option>
                <option value="Selected">Selected</option>
                <option value="Waitlisted">Waitlisted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* List display */}
          {filtered.length > 0 ? (
            <div className="space-y-3 pt-1">
              {filtered.map((exp) => {
                // Determine badges
                const diffColors = {
                  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
                  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
                  Hard: 'bg-destructive/10 text-destructive border-destructive/25',
                };
                
                const verdColors = {
                  Selected: 'bg-success/15 text-success border-success/30',
                  Waitlisted: 'bg-warning/15 text-warning border-warning/30',
                  Rejected: 'bg-destructive/15 text-destructive border-destructive/30',
                };

                return (
                  <div key={exp.id} className="rounded-lg border border-border bg-card/65 p-4 space-y-3 hover:border-primary/20 transition-all hover:bg-card">
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary border border-primary/25 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            {exp.name}
                            <span className="text-[10px] text-muted-foreground font-mono">({exp.year})</span>
                          </h4>
                          <p className="text-[10px] text-muted-foreground font-medium">{exp.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Rating stars */}
                        <div className="hidden sm:flex items-center text-amber-400 mr-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < exp.rating ? "fill-amber-400" : "text-muted")} />
                          ))}
                        </div>
                        {/* Badges */}
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider", diffColors[exp.difficulty])}>
                          {exp.difficulty}
                        </span>
                        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider", verdColors[exp.verdict])}>
                          {exp.verdict === 'Selected' ? (
                            <CheckCircle className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />
                          )}
                          {exp.verdict}
                        </span>
                      </div>
                    </div>

                    {/* Review Contents */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-[9px] text-primary uppercase font-bold tracking-wider block mb-0.5">Rounds & Interview Process</span>
                        <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{exp.experience}</p>
                      </div>
                      <div className="bg-muted/15 border border-border/30 rounded p-2 text-xs">
                        <span className="text-[9px] text-emerald-400 uppercase font-bold tracking-wider block mb-0.5">Key Preparation Strategy</span>
                        <p className="text-muted-foreground italic leading-relaxed whitespace-pre-wrap">{exp.prepTips}</p>
                      </div>
                    </div>

                    {/* Upvote & Delete */}
                    <div className="flex items-center justify-between border-t border-border/30 pt-2.5 mt-2 text-[10px] text-muted-foreground font-medium">
                      <button 
                        onClick={() => handleUpvote(exp.id)}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span>Helpful ({exp.helpfulnessCount})</span>
                      </button>
                      
                      {exp.isCustom && (
                        <button 
                          onClick={() => handleDelete(exp.id)}
                          className="flex items-center gap-1 text-destructive hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
              <MessageSquare className="w-7 h-7 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-foreground">No experiences match your filters</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Try adjusting your search query or dropdown selections.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
