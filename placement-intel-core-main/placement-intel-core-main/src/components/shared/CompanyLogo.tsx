import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  logoUrl?: string;
  name: string;
  className?: string;
}

export function CompanyLogo({ logoUrl, name, className }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Clean raw logoUrl in case it is a semicolon/comma/space separated list of URLs
  const cleanLogoUrl = logoUrl
    ? logoUrl.split(/;|,|\s+/).map(u => u.trim()).find(u => u.startsWith('http://') || u.startsWith('https://'))
    : undefined;

  // Generate a premium deterministic gradient based on the company name
  const getGradient = (str: string) => {
    const colors = [
      'from-blue-500/20 to-indigo-500/30 text-blue-400 border-blue-500/20',
      'from-emerald-500/20 to-teal-500/30 text-emerald-400 border-emerald-500/20',
      'from-violet-500/20 to-fuchsia-500/30 text-violet-400 border-violet-500/20',
      'from-rose-500/20 to-orange-500/30 text-rose-400 border-rose-500/20',
      'from-cyan-500/20 to-sky-500/30 text-cyan-400 border-cyan-500/20',
      'from-amber-500/20 to-yellow-500/30 text-amber-400 border-amber-500/20',
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initial = name.charAt(0).toUpperCase();
  const gradientStyles = getGradient(name);

  if (!hasError && cleanLogoUrl) {
    return (
      <img
        src={cleanLogoUrl}
        alt={name}
        className={cn(
          "rounded-md object-contain bg-white p-1 border border-border shadow-sm",
          className
        )}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-br flex items-center justify-center font-bold uppercase border shrink-0 select-none shadow-sm",
        gradientStyles,
        className
      )}
    >
      {initial || <Building2 className="w-1/2 h-1/2 opacity-70" />}
    </div>
  );
}
