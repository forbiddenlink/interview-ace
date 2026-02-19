"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { TECHNOLOGIES, DOMAINS, JOB_ROLE_MAPPINGS } from "@/data/technologies";
import { ALL_SEED_QUESTIONS } from "@/data/seed-questions";
import type { Technology, TechDomain, DifficultyLevel } from "@/types/database";
import {
  Sparkles,
  Filter,
  X,
  Clock,
  ChevronRight,
  Code2,
  Brain,
  Users,
  MessageSquare,
  ArrowLeft,
  Search,
  Briefcase,
} from "lucide-react";

export default function PracticePage() {
  const [selectedTechnologies, setSelectedTechnologies] = useState<Technology[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<TechDomain[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedJobRole, setSelectedJobRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Filter questions based on selections
  const filteredQuestions = useMemo(() => {
    return ALL_SEED_QUESTIONS.filter((q) => {
      // Technology filter
      if (selectedTechnologies.length > 0) {
        const hasMatchingTech = q.technologies.some((t) =>
          selectedTechnologies.includes(t as Technology)
        );
        if (!hasMatchingTech) return false;
      }

      // Difficulty filter
      if (selectedDifficulty && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesPrompt = q.prompt.toLowerCase().includes(query);
        const matchesTags = q.topic_tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesPrompt && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedTechnologies, selectedDifficulty, searchQuery]);

  const toggleTechnology = (tech: Technology) => {
    setSelectedTechnologies((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
    setSelectedJobRole(null); // Clear job role when manually selecting
  };

  const selectJobRole = (role: string) => {
    if (selectedJobRole === role) {
      setSelectedJobRole(null);
      setSelectedTechnologies([]);
    } else {
      setSelectedJobRole(role);
      setSelectedTechnologies(JOB_ROLE_MAPPINGS[role] || []);
    }
  };

  const clearFilters = () => {
    setSelectedTechnologies([]);
    setSelectedDomains([]);
    setSelectedDifficulty(null);
    setSelectedJobRole(null);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedTechnologies.length > 0 ||
    selectedDomains.length > 0 ||
    selectedDifficulty !== null ||
    searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-violet-500" />
                <span className="text-xl font-bold">InterviewAce</span>
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400">Practice</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:border-transparent transition-shadow duration-150"
                  />
                </div>

                {/* Quick Select: Job Roles */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Quick Select by Role
                  </h3>
                  <div className="space-y-2">
                    {Object.keys(JOB_ROLE_MAPPINGS).slice(0, 5).map((role) => (
                      <button
                        key={role}
                        onClick={() => selectJobRole(role)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedJobRole === role
                            ? "bg-violet-500/20 text-violet-300 border border-violet-500/50"
                            : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    {(["beginner", "intermediate", "advanced", "expert"] as DifficultyLevel[]).map(
                      (level) => (
                        <button
                          key={level}
                          onClick={() =>
                            setSelectedDifficulty(selectedDifficulty === level ? null : level)
                          }
                          className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                            selectedDifficulty === level
                              ? "bg-violet-500/20 text-violet-300 border border-violet-500/50"
                              : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                          }`}
                        >
                          {level}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Technology Filter */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Technologies</h3>
                  <div className="space-y-4">
                    {/* Frontend */}
                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Frontend</p>
                      <div className="flex flex-wrap gap-2">
                        {TECHNOLOGIES.filter((t) => t.domain === "frontend").map((tech) => (
                          <button
                            key={tech.id}
                            onClick={() => toggleTechnology(tech.id)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                              selectedTechnologies.includes(tech.id)
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                            }`}
                          >
                            {tech.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Backend */}
                    <div>
                      <p className="text-xs text-zinc-500 mb-2">Backend</p>
                      <div className="flex flex-wrap gap-2">
                        {TECHNOLOGIES.filter((t) => t.domain === "backend").map((tech) => (
                          <button
                            key={tech.id}
                            onClick={() => toggleTechnology(tech.id)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                              selectedTechnologies.includes(tech.id)
                                ? "bg-green-500/20 text-green-300 border border-green-500/50"
                                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                            }`}
                          >
                            {tech.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* DevOps */}
                    <div>
                      <p className="text-xs text-zinc-500 mb-2">DevOps</p>
                      <div className="flex flex-wrap gap-2">
                        {TECHNOLOGIES.filter((t) => t.domain === "devops").map((tech) => (
                          <button
                            key={tech.id}
                            onClick={() => toggleTechnology(tech.id)}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                              selectedTechnologies.includes(tech.id)
                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/50"
                                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
                            }`}
                          >
                            {tech.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-zinc-500">Filters:</span>
                {selectedJobRole && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedJobRole}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        setSelectedJobRole(null);
                        setSelectedTechnologies([]);
                      }}
                    />
                  </Badge>
                )}
                {!selectedJobRole &&
                  selectedTechnologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="gap-1">
                      {TECHNOLOGIES.find((t) => t.id === tech)?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleTechnology(tech)}
                      />
                    </Badge>
                  ))}
                {selectedDifficulty && (
                  <Badge variant="secondary" className="gap-1 capitalize">
                    {selectedDifficulty}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setSelectedDifficulty(null)}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-zinc-400">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* Questions Grid */}
            <div className="grid gap-4">
              {filteredQuestions.map((question, index) => (
                <QuestionCard key={index} question={question} index={index} />
              ))}

              {filteredQuestions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-400 mb-4">No questions match your filters.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  index,
}: {
  question: (typeof ALL_SEED_QUESTIONS)[0];
  index: number;
}) {
  const TypeIcon = {
    conceptual: MessageSquare,
    coding: Code2,
    system_design: Brain,
    behavioral: Users,
    practical: Code2,
  }[question.type];

  const difficultyColors = {
    beginner: "text-green-400",
    intermediate: "text-yellow-400",
    advanced: "text-orange-400",
    expert: "text-red-400",
  };

  return (
    <Card className="hover:border-zinc-700 transition-colors group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
            <TypeIcon className="h-5 w-5 text-zinc-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-zinc-100 group-hover:text-violet-300 transition-colors">
                  {question.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{question.prompt}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className={`text-xs font-medium capitalize ${difficultyColors[question.difficulty]}`}>
                {question.difficulty}
              </span>
              <span className="text-xs text-zinc-600">|</span>
              <span className="text-xs text-zinc-500 capitalize">{question.type.replace("_", " ")}</span>
              <span className="text-xs text-zinc-600">|</span>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {question.time_estimate_minutes} min
              </span>

              <div className="flex-1" />

              <div className="flex gap-1.5">
                {question.technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {question.technologies.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{question.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
