import React from 'react';
import { useParams } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompanies';
import { Company } from '@/types/company';
import { DataField, SectionHeader, EmptyState } from '@/components/shared/DataDisplay';
import {
  Building2, Globe, Users, Briefcase, Heart, GraduationCap,
  DollarSign, Shield, Cpu, UserCircle, Megaphone,
  ChevronRight, ExternalLink, Zap, Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CompanyLogo } from '@/components/shared/CompanyLogo';

const sections = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'business', label: 'Business & Market', icon: Briefcase },
  { id: 'culture', label: 'Culture & People', icon: Heart },
  { id: 'growth', label: 'Learning & Growth', icon: GraduationCap },
  { id: 'compensation', label: 'Compensation', icon: DollarSign },
  { id: 'logistics', label: 'Work Logistics', icon: Globe },
  { id: 'financials', label: 'Financials & Risk', icon: Shield },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'leadership', label: 'Leadership', icon: UserCircle },
  { id: 'brand', label: 'Brand & Digital', icon: Megaphone },
  { id: 'hiring', label: 'Hiring Grounds', icon: Zap },
  { id: 'innovx', label: 'InnovX Strategic', icon: Rocket },
];

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading } = useCompany(id);
  const [activeSection, setActiveSection] = useState('overview');

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
        <CompanyLogo
          logoUrl={company.logo_url}
          name={company.name}
          className="w-14 h-14 text-lg"
        />
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

          <DetailSection id="hiring" title="Hiring Grounds" icon={<Zap className="w-4 h-4" />}>
            <HiringSection company={company} />
          </DetailSection>

          <DetailSection id="innovx" title="InnovX Strategic Framework" icon={<Rocket className="w-4 h-4" />}>
            <InnovXSection company={company} />
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function HiringSection({ company }: { company: Company }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = company.hiring_json || `/data/Hiring_Grounds/${company.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    fetch(path)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [company.hiring_json, company.name]);

  if (loading) return <div className="h-20 animate-pulse bg-muted rounded-md" />;
  if (!data) return <p className="text-xs text-muted-foreground italic">No hiring data available for this company.</p>;

  return (
    <div className="space-y-4 mt-4">
      {data.job_role_details?.map((role: any, i: number) => (
        <div key={i} className="border border-border rounded-lg p-4 bg-secondary/20">
          <h4 className="text-sm font-bold text-foreground mb-2">{role.role_title} ({role.opportunity_type})</h4>
          <p className="text-xs text-muted-foreground mb-4">{role.job_description}</p>
          <div className="space-y-3">
            {role.hiring_rounds?.map((round: any, j: number) => (
              <div key={j} className="text-xs border-l-2 border-primary pl-3 py-1">
                <div className="font-semibold text-foreground">Round {round.round_number}: {round.round_name}</div>
                <div className="text-muted-foreground mt-0.5">{round.round_category} • {round.evaluation_type} • {round.assessment_mode}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InnovXSection({ company }: { company: Company }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = company.innovx_json || `/data/InnoVex/${company.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    fetch(path)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [company]);

  if (loading) return <div className="h-20 animate-pulse bg-muted rounded-md" />;
  if (!data) return <p className="text-xs text-muted-foreground italic">No InnovX data available for this company.</p>;

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Industry Focus</h4>
          <p className="text-sm text-foreground">{data.innovx_master?.industry} / {data.innovx_master?.sub_industry}</p>
        </div>
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Target Market</h4>
          <p className="text-sm text-foreground">{data.innovx_master?.target_market}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Innovation Projects</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {data.innovx_projects?.slice(0, 9).map((project: any, i: number) => (
            <div key={i} className="p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors">
              <div className="text-[10px] font-bold text-primary mb-1">{project.tier_level}</div>
              <h5 className="text-xs font-semibold text-foreground mb-1">{project.project_name}</h5>
              <div className="flex flex-wrap gap-1 mt-2">
                {project.backend_technologies?.map((t: string) => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          ))}
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
