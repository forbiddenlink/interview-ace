import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTodayStats, getSkillMastery } from '@/lib/db/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch today's stats
  const todayStats = await getTodayStats(user.id);

  // Fetch skill mastery
  const skillMastery = await getSkillMastery(user.id);

  // Calculate overall progress
  const totalSkills = skillMastery?.length || 0;
  const masteredSkills = skillMastery?.filter(s => s.mastery_level >= 4)?.length || 0;
  const overallProgress = totalSkills > 0 ? (masteredSkills / totalSkills) * 100 : 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {profile?.display_name || 'there'}! 👋
              </h1>
              <p className="text-zinc-400 mt-1">
                {profile?.target_role && `Training for ${profile.target_role}`}
              </p>
            </div>
            <Link href="/practice">
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                Continue Practice
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Questions Today</CardDescription>
              <CardTitle className="text-4xl font-bold text-white">
                {todayStats.questions_attempted}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-zinc-400">
                {profile?.daily_session_limit_minutes && (
                  <span>
                    Limit: {profile.daily_session_limit_minutes} min/day
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Time Spent</CardDescription>
              <CardTitle className="text-4xl font-bold text-white">
                {todayStats.time_spent_minutes}
                <span className="text-xl text-zinc-400 ml-1">min</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(todayStats.time_spent_minutes / (profile?.daily_session_limit_minutes || 20)) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-zinc-400">Average Score</CardDescription>
              <CardTitle className="text-4xl font-bold text-white">
                {todayStats.average_score.toFixed(1)}
                <span className="text-xl text-zinc-400 ml-1">/5.0</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(todayStats.average_score / 5) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Overall Progress</CardTitle>
            <CardDescription className="text-zinc-400">
              {masteredSkills} of {totalSkills} skills mastered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3 mb-2" />
            <p className="text-sm text-zinc-400">
              {overallProgress.toFixed(0)}% complete
            </p>
          </CardContent>
        </Card>

        {/* Skill Mastery */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Skill Mastery</CardTitle>
            <CardDescription className="text-zinc-400">
              Your progress across different skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            {skillMastery && skillMastery.length > 0 ? (
              <div className="space-y-4">
                {skillMastery.map((skill) => (
                  <div key={skill.skill_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">
                          {skill.skills?.display_name || skill.skills?.name}
                        </span>
                        <Badge variant="outline" className="border-zinc-700">
                          Level {skill.mastery_level}
                        </Badge>
                      </div>
                      <span className="text-sm text-zinc-400">
                        {skill.current_xp} / {skill.skills?.xp_to_master || 1000} XP
                      </span>
                    </div>
                    <Progress 
                      value={(skill.current_xp / (skill.skills?.xp_to_master || 1000)) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-zinc-400 mb-4">
                  No progress yet. Start practicing to build your skills!
                </p>
                <Link href="/practice">
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                    Start Your First Question
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferred Technologies */}
        {profile?.preferred_technologies && profile.preferred_technologies.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800 mt-8">
            <CardHeader>
              <CardTitle className="text-white">Your Technologies</CardTitle>
              <CardDescription className="text-zinc-400">
                Skills you're focusing on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.preferred_technologies.map((tech: string) => (
                  <Badge key={tech} className="bg-violet-600/20 text-violet-300 border-violet-500/30">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
