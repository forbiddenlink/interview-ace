'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TARGET_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Node.js Developer',
  'DevOps Engineer',
  'Software Engineer',
  'UI/UX Designer',
  'Other',
];

const TARGET_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-10 years)' },
  { value: 'staff', label: 'Staff+ (10+ years)' },
];

const TECHNOLOGIES = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Next.js',
  'Vue', 'Angular', 'Python', 'Java', 'Go',
  'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GraphQL', 'REST APIs',
];

export default function ProfileSetupPage() {
  const [displayName, setDisplayName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetLevel, setTargetLevel] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [sessionLimit, setSessionLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const toggleTech = (tech: string) => {
    setSelectedTechs(prev =>
      prev.includes(tech)
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || user.email?.split('@')[0],
        target_role: targetRole,
        target_level: targetLevel,
        target_company: targetCompany || null,
        preferred_technologies: selectedTechs,
        daily_session_limit_minutes: sessionLimit,
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push('/practice');
  };

  const handleSkip = () => {
    router.push('/practice');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Complete your profile</CardTitle>
          <CardDescription className="text-zinc-400">
            Help us personalize your interview prep experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium text-zinc-200">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="How should we call you?"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Target Role */}
            <div className="space-y-2">
              <label htmlFor="targetRole" className="text-sm font-medium text-zinc-200">
                Target Role
              </label>
              <select
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Select a role...</option>
                {TARGET_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Target Level */}
            <div className="space-y-2">
              <label htmlFor="targetLevel" className="text-sm font-medium text-zinc-200">
                Experience Level
              </label>
              <select
                id="targetLevel"
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Select a level...</option>
                {TARGET_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            {/* Target Company (Optional) */}
            <div className="space-y-2">
              <label htmlFor="targetCompany" className="text-sm font-medium text-zinc-200">
                Target Company <span className="text-zinc-500">(optional)</span>
              </label>
              <input
                id="targetCompany"
                type="text"
                placeholder="e.g., Google, Meta, Startup XYZ"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Preferred Technologies */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-200">
                Preferred Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {TECHNOLOGIES.map(tech => (
                  <Badge
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`cursor-pointer transition-all ${
                      selectedTechs.includes(tech)
                        ? 'bg-violet-600 hover:bg-violet-700'
                        : 'bg-zinc-800 hover:bg-zinc-700'
                    }`}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Daily Session Limit */}
            <div className="space-y-2">
              <label htmlFor="sessionLimit" className="text-sm font-medium text-zinc-200">
                Daily Session Limit: {sessionLimit} minutes
              </label>
              <input
                id="sessionLimit"
                type="range"
                min="10"
                max="120"
                step="10"
                value={sessionLimit}
                onChange={(e) => setSessionLimit(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-zinc-500">
                We'll remind you when you've reached your daily limit to prevent burnout
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
              >
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                Skip for now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
