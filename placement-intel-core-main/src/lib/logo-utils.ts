export function getInitials(name: string): string {
  if (!name) return '??';
  const clean = name.replace(/\(.*\)/g, '').replace(/Ltd\b|inc\b|plc\b/gi, '').trim();
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function getGradient(name: string): string {
  if (!name) return 'from-muted to-muted border-muted';
  const gradients = [
    'from-blue-500/20 to-cyan-400/20 border-cyan-500/30 text-cyan-400',
    'from-emerald-500/20 to-teal-400/20 border-teal-500/30 text-teal-400',
    'from-purple-500/20 to-indigo-400/20 border-indigo-500/30 text-indigo-400',
    'from-amber-500/20 to-orange-400/20 border-orange-500/30 text-orange-400',
    'from-pink-500/20 to-rose-400/20 border-rose-500/30 text-rose-400',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}
