import Link from "next/link";
import { Button } from "@/components/ui";
import {
  Code2,
  Brain,
  Users,
  Mic,
  Target,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-violet-500" />
              <span className="text-xl font-bold">InterviewAce</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-violet-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 mb-6">
            <Sparkles className="h-4 w-4" />
            <span>The anti-burnout interview prep platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Master Technical
            <span className="block bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 bg-clip-text text-transparent">
              Interviews
            </span>
          </h1>

          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Practice coding, system design, and behavioral questions with AI-powered feedback.
            Built for developers who want to ace interviews without the grind.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/practice">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-zinc-500">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-sm text-zinc-500">Technologies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">Free</div>
              <div className="text-sm text-zinc-500">For You</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              One platform for all your interview prep needs. No more jumping between tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Coding Practice"
              description="DSA problems with built-in code editor and AI evaluation. Practice React, JavaScript, Python, and more."
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="System Design"
              description="Design scalable systems with interactive diagrams and step-by-step guidance."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Behavioral Prep"
              description="Master the STAR method with story banking and AI feedback on your responses."
            />
            <FeatureCard
              icon={<Mic className="h-6 w-6" />}
              title="Voice Interviews"
              description="Practice speaking your answers with AI interviewers. Get feedback on communication."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="Tech-Specific"
              description="Filter by technology: React, Node.js, Python, AWS, and more. Target your weak areas."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Progress Tracking"
              description="Skill trees, mastery levels, and adaptive difficulty. No streaks or guilt."
            />
          </div>
        </div>
      </section>

      {/* Anti-Burnout Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50 border-y border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm text-green-300 mb-6">
                <Clock className="h-4 w-4" />
                <span>Anti-Burnout Design</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Interview prep that doesn&apos;t burn you out
              </h2>
              <p className="text-lg text-zinc-400 mb-8">
                We built InterviewAce because we were tired of the grind culture in interview prep.
                No more endless LeetCode streaks that make you feel guilty for taking a break.
              </p>
              <ul className="space-y-4">
                <Feature text="Session limits (5-20 min) with natural stopping points" />
                <Feature text="Progress-based metrics, not streak counters" />
                <Feature text="Spaced repetition so you review at the right time" />
                <Feature text="Mood check-ins to track your mental state" />
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
                    12
                  </div>
                  <div className="text-zinc-400">skills mastered this month</div>
                  <div className="mt-6 text-sm text-zinc-500">
                    Not &quot;47-day streak&quot; — real progress.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Practice for your stack</h2>
          <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto">
            Filter questions by technology. Preparing for a React role? Focus on React.
            Going for DevOps? We&apos;ve got you covered.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React", "JavaScript", "TypeScript", "Node.js", "Python",
              "Vue", "Angular", "Next.js", "PostgreSQL", "MongoDB",
              "Docker", "Kubernetes", "AWS", "GraphQL", "REST APIs"
            ].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm font-medium hover:border-violet-500/50 hover:bg-zinc-800/80 transition-colors cursor-pointer"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to ace your next interview?
          </h2>
          <p className="text-lg text-zinc-400 mb-10">
            Start practicing for free. No credit card required.
          </p>
          <Link href="/practice">
            <Button variant="gradient" size="xl">
              Start Practicing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-500" />
              <span className="font-semibold">InterviewAce</span>
            </div>
            <p className="text-sm text-zinc-500">
              Built for developers, by developers. Free forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-violet-500/10 text-violet-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
      <span className="text-zinc-300">{text}</span>
    </li>
  );
}
