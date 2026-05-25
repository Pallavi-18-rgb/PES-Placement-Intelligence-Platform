import { useParams } from 'react-router-dom';
import { useCompany } from '@/hooks/useCompanies';
import { Company } from '@/types/company';
import { DataField, SectionHeader, EmptyState } from '@/components/shared/DataDisplay';
import {
  Building2, Globe, Users, Briefcase, Heart, GraduationCap,
  DollarSign, Shield, Cpu, UserCircle, Megaphone,
  ChevronRight, ExternalLink, Calendar, MessageSquare, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getInitials, getGradient } from '@/lib/logo-utils';

import PlacementTimeline from '@/components/placement/PlacementTimeline';
import InterviewExperienceSection from '@/components/placement/InterviewExperienceSection';
import RejectionRiskEngine from '@/components/placement/RejectionRiskEngine';

const sections = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'timeline', label: 'Placement Timeline', icon: Calendar },
  { id: 'experiences', label: 'Interview Experiences', icon: MessageSquare },
  { id: 'risk-engine', label: 'Rejection Risk Engine', icon: AlertTriangle },
  { id: 'business', label: 'Business & Market', icon: Briefcase },
  { id: 'culture', label: 'Culture & People', icon: Heart },
  { id: 'growth', label: 'Learning & Growth', icon: GraduationCap },
  { id: 'compensation', label: 'Compensation', icon: DollarSign },
  { id: 'logistics', label: 'Work Logistics', icon: Globe },
  { id: 'financials', label: 'Financials & Risk', icon: Shield },
  { id: 'technology', label: 'Technology', icon: Cpu },
  { id: 'leadership', label: 'Leadership', icon: UserCircle },
  { id: 'brand', label: 'Brand & Digital', icon: Megaphone },
];

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: company, isLoading } = useCompany(id);
  const [activeSection, setActiveSection] = useState('overview');
  const [imgError, setImgError] = useState(false);

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
        {company.logo_url && !imgError && company.logo_url !== 'NA' ? (
          <div className="w-14 h-14 rounded-lg bg-white p-1 shrink-0 border border-border shadow-sm flex items-center justify-center">
            <img 
              src={company.logo_url} 
              alt={company.name} 
              onError={() => setImgError(true)}
              className="w-full h-full object-contain rounded-md" 
            />
          </div>
        ) : (
          <div className={cn("w-14 h-14 rounded-lg bg-gradient-to-br flex items-center justify-center font-bold text-lg shrink-0 tracking-wider shadow-sm border", getGradient(company.name))}>
            {getInitials(company.name)}
          </div>
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
              <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary flex items-center gap-0.5 hover:underline">
                <ExternalLink className="w-3 h-3" /> Website
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Sticky sidebar nav */}
        <nav className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20 space-y-0.5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin pr-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSection(s.id);
                  document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

          <DetailSection id="timeline" title="Placement Timeline Tracker" icon={<Calendar className="w-4 h-4" />}>
            <PlacementTimeline company={company} />
          </DetailSection>

          <DetailSection id="experiences" title="Prep & Interview Experiences" icon={<MessageSquare className="w-4 h-4" />}>
            <InterviewExperienceSection company={company} />
          </DetailSection>

          <DetailSection id="risk-engine" title="Candidate Rejection Risk Engine" icon={<AlertTriangle className="w-4 h-4" />}>
            <RejectionRiskEngine company={company} />
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
