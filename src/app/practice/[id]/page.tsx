"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button, Card, CardContent, Badge, Progress } from "@/components/ui";
import { ALL_SEED_QUESTIONS } from "@/data/seed-questions";
import {
  Sparkles,
  ArrowLeft,
  Clock,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Play,
  Send,
  Loader2,
} from "lucide-react";

// Dynamically import CodeMirror to avoid SSR issues
const CodeMirror = dynamic(
  () => import("@uiw/react-codemirror").then((mod) => mod.default),
  { ssr: false }
);

export default function QuestionPracticePage() {
  const params = useParams();
  const router = useRouter();
  const questionIndex = parseInt(params.id as string, 10);
  const question = ALL_SEED_QUESTIONS[questionIndex];

  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  if (!question) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Question not found</p>
          <Link href="/practice">
            <Button variant="outline">Back to Practice</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setEvaluating(true);
    setSubmitted(true);

    // Simulate AI evaluation (in real app, this would call OpenAI)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock evaluation
    const mockScore = 0.75 + Math.random() * 0.2;
    setEvaluation({
      score: mockScore,
      feedback:
        "Good explanation of the core concepts. You demonstrated understanding of the key principles.",
      strengths: [
        "Clear explanation of the main concept",
        "Good use of examples",
        "Logical structure",
      ],
      improvements: [
        "Could mention edge cases",
        "Add more detail about performance implications",
        "Consider discussing alternatives",
      ],
    });

    setEvaluating(false);
  };

  const goToNext = () => {
    const nextIndex = questionIndex + 1;
    if (nextIndex < ALL_SEED_QUESTIONS.length) {
      router.push(`/practice/${nextIndex}`);
      // Reset state
      setAnswer("");
      setCode("");
      setShowHints(false);
      setCurrentHint(0);
      setSubmitted(false);
      setEvaluation(null);
    } else {
      router.push("/practice");
    }
  };

  const revealHint = () => {
    if (!showHints) {
      setShowHints(true);
    } else if (currentHint < (question.hints?.length || 0) - 1) {
      setCurrentHint((prev) => prev + 1);
    }
  };

  const difficultyColors = {
    beginner: "bg-green-500/20 text-green-300 border-green-500/50",
    intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    advanced: "bg-orange-500/20 text-orange-300 border-orange-500/50",
    expert: "bg-red-500/20 text-red-300 border-red-500/50",
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/practice" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-500">
                Question {questionIndex + 1} of {ALL_SEED_QUESTIONS.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Question Panel */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${difficultyColors[question.difficulty]} capitalize`}>
                  {question.difficulty}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {question.type.replace("_", " ")}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-zinc-500">
                  <Clock className="h-4 w-4" />
                  {question.time_estimate_minutes} min
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-4">{question.title}</h1>

              <div className="prose prose-invert prose-zinc max-w-none">
                <p className="text-zinc-300 whitespace-pre-wrap">{question.prompt}</p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mt-6">
                {question.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Hints */}
            {question.hints && question.hints.length > 0 && (
              <Card className="border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>Hints</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={revealHint}
                      disabled={showHints && currentHint >= question.hints.length - 1}
                    >
                      {!showHints
                        ? "Show Hint"
                        : currentHint < question.hints.length - 1
                        ? "Next Hint"
                        : "All Hints Shown"}
                    </Button>
                  </div>
                  {showHints && (
                    <ul className="space-y-2">
                      {question.hints.slice(0, currentHint + 1).map((hint, i) => (
                        <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                          <span className="text-yellow-500 font-medium">{i + 1}.</span>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Answer Panel */}
          <div className="space-y-6">
            {question.format === "code" || question.type === "coding" ? (
              <Card className="border-zinc-800">
                <CardContent className="p-0 overflow-hidden">
                  <div className="border-b border-zinc-800 px-4 py-2 bg-zinc-900/50">
                    <span className="text-sm text-zinc-400">Code Editor</span>
                  </div>
                  <CodeMirror
                    value={code}
                    onChange={(value) => setCode(value)}
                    height="300px"
                    theme="dark"
                    placeholder="// Write your code here..."
                    editable={!submitted}
                    className="text-sm"
                  />
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-zinc-800">
              <CardContent className="p-0">
                <div className="border-b border-zinc-800 px-4 py-2 bg-zinc-900/50">
                  <span className="text-sm text-zinc-400">Your Answer</span>
                </div>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Explain your answer here..."
                  className="w-full h-48 p-4 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-inset text-sm text-zinc-100 placeholder:text-zinc-500 transition-shadow duration-150"
                  disabled={submitted}
                />
              </CardContent>
            </Card>

            {/* Submit / Evaluation */}
            {!submitted ? (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={!answer.trim() && !code.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Answer
              </Button>
            ) : evaluating ? (
              <Card className="border-zinc-800">
                <CardContent className="p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-500 mb-4" />
                  <p className="text-zinc-400">Evaluating your answer...</p>
                </CardContent>
              </Card>
            ) : evaluation ? (
              <Card className="border-zinc-800">
                <CardContent className="p-6 space-y-6">
                  {/* Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800 mb-4">
                      <span className="text-3xl font-bold text-violet-400">
                        {Math.round(evaluation.score * 100)}
                      </span>
                    </div>
                    <p className="text-zinc-400">{evaluation.feedback}</p>
                  </div>

                  {/* Strengths */}
                  <div>
                    <h4 className="text-sm font-medium text-green-400 flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {evaluation.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h4 className="text-sm font-medium text-yellow-400 flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-1">
                      {evaluation.improvements.map((s, i) => (
                        <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                          <span className="text-yellow-500">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solution */}
                  {question.solution && (
                    <div className="pt-4 border-t border-zinc-800">
                      <h4 className="text-sm font-medium text-zinc-300 mb-2">Model Answer</h4>
                      <p className="text-sm text-zinc-400">{question.solution.explanation}</p>
                      {question.solution.key_points && (
                        <ul className="mt-3 space-y-1">
                          {question.solution.key_points.map((point, i) => (
                            <li key={i} className="text-sm text-zinc-500 flex items-start gap-2">
                              <span className="text-violet-500">→</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Next Button */}
                  <Button variant="default" size="lg" className="w-full" onClick={goToNext}>
                    Next Question
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
