import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Building2, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const companySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  short_name: z.string().min(2, 'Short name is required'),
  category: z.string().min(1, 'Category is required'),
  employee_size: z.string().min(1, 'Employee size is required'),
  hiring_velocity: z.string().min(1, 'Hiring velocity is required'),
  profitability_status: z.string().min(1, 'Profitability status is required'),
  remote_policy_details: z.string().min(1, 'Remote policy is required'),
  overview_text: z.string().min(10, 'Overview is required'),
  logo_url: z.string().url('Invalid logo URL').optional().or(z.literal('')),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function AddCompanyPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      category: 'Tech Giants',
      employee_size: '10000+',
      hiring_velocity: 'High',
      profitability_status: 'Profitable',
      remote_policy_details: 'Hybrid',
    }
  });

  const onSubmit = async (values: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('companies')
        .insert([values]);

      if (error) throw error;

      toast.success('Company added successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error adding company:', error);
      toast.error(`Failed to add company: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Add New Company</h1>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-card border border-border p-8 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input {...register('name')} placeholder="e.g. Google" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Short Name</label>
            <Input {...register('short_name')} placeholder="e.g. Google" />
            {errors.short_name && <p className="text-xs text-destructive">{errors.short_name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select onValueChange={(val) => setValue('category', val)} defaultValue="Tech Giants">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tech Giants">Tech Giants</SelectItem>
                <SelectItem value="Product Companies">Product Companies</SelectItem>
                <SelectItem value="Service Companies">Service Companies</SelectItem>
                <SelectItem value="Startups / Scale-ups">Startups / Scale-ups</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hiring Velocity</label>
            <Select onValueChange={(val) => setValue('hiring_velocity', val)} defaultValue="High">
              <SelectTrigger>
                <SelectValue placeholder="Select velocity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Frozen">Frozen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Remote Policy</label>
            <Select onValueChange={(val) => setValue('remote_policy_details', val)} defaultValue="Hybrid">
              <SelectTrigger>
                <SelectValue placeholder="Select policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="On-site">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Logo URL</label>
            <Input {...register('logo_url')} placeholder="https://..." />
            {errors.logo_url && <p className="text-xs text-destructive">{errors.logo_url.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Overview Text</label>
          <Textarea 
            {...register('overview_text')} 
            placeholder="Describe the company's business model, culture, and hiring process..."
            rows={4}
          />
          {errors.overview_text && <p className="text-xs text-destructive">{errors.overview_text.message}</p>}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Company
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
