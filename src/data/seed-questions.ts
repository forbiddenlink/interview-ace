/**
 * Seed questions for InterviewAce
 * Curated from open-source repositories and documentation
 * Sources:
 * - sudheerj/reactjs-interview-questions
 * - yangshun/tech-interview-handbook
 * - system-design-primer
 */

import type { Question, RubricDimension } from "@/types/database";

const CONCEPTUAL_RUBRIC: RubricDimension[] = [
  {
    name: "Understanding",
    weight: 0.4,
    anchors: {
      1: "Cannot explain the concept or provides incorrect information",
      2: "Partial understanding with significant gaps",
      3: "Explains the concept correctly with standard depth",
      4: "Deep understanding with practical examples",
      5: "Expert-level explanation with edge cases and trade-offs",
    },
  },
  {
    name: "Clarity",
    weight: 0.3,
    anchors: {
      1: "Explanation is confusing or disorganized",
      2: "Some clarity issues, hard to follow",
      3: "Clear and organized explanation",
      4: "Very clear with good structure and examples",
      5: "Exceptionally clear, could teach others effectively",
    },
  },
  {
    name: "Depth",
    weight: 0.3,
    anchors: {
      1: "Surface-level only",
      2: "Some depth but missing key details",
      3: "Appropriate depth for the question",
      4: "Goes beyond basics with insights",
      5: "Comprehensive with advanced insights",
    },
  },
];

const CODING_RUBRIC: RubricDimension[] = [
  {
    name: "Correctness",
    weight: 0.35,
    anchors: {
      1: "Solution does not work",
      2: "Works for basic cases only",
      3: "Works for all provided test cases",
      4: "Handles edge cases well",
      5: "Provably correct with clear reasoning",
    },
  },
  {
    name: "Efficiency",
    weight: 0.25,
    anchors: {
      1: "Very inefficient (brute force when better exists)",
      2: "Suboptimal but reasonable",
      3: "Meets expected complexity",
      4: "Optimized for both time and space",
      5: "Optimal with trade-off analysis",
    },
  },
  {
    name: "Code Quality",
    weight: 0.2,
    anchors: {
      1: "Unreadable, no structure",
      2: "Works but messy",
      3: "Clean and readable",
      4: "Well-structured with good naming",
      5: "Production-quality code",
    },
  },
  {
    name: "Communication",
    weight: 0.2,
    anchors: {
      1: "Cannot explain approach",
      2: "Explanation is incomplete",
      3: "Clearly explains solution",
      4: "Discusses alternatives",
      5: "Excellent problem-solving narration",
    },
  },
];

// Type for seed questions (without ID, will be generated)
type SeedQuestion = Omit<Question, "id" | "skill_id" | "created_at" | "is_active">;

export const REACT_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "What is the Virtual DOM?",
    prompt: "Explain what the Virtual DOM is in React and why it's used. How does it improve performance?",
    hints: [
      "Think about what happens when state changes in a React app",
      "Consider the cost of direct DOM manipulation",
    ],
    solution: {
      explanation: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes, React creates a new Virtual DOM tree and compares it with the previous one (diffing). Only the differences are applied to the real DOM (reconciliation), which is much faster than manipulating the DOM directly for every change.",
      key_points: [
        "In-memory representation of real DOM",
        "Diffing algorithm compares old and new trees",
        "Batch updates minimize DOM operations",
        "Reconciliation process applies minimal changes",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["react", "javascript"],
    company_tags: ["meta", "google", "amazon"],
    topic_tags: ["virtual-dom", "performance", "reconciliation"],
    time_estimate_minutes: 5,
    irt_difficulty: 0,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "useState vs useReducer",
    prompt: "When would you use useReducer instead of useState? Provide examples of scenarios where each is more appropriate.",
    hints: [
      "Consider complexity of state updates",
      "Think about related state values",
    ],
    solution: {
      explanation: "useState is ideal for simple, independent state values. useReducer is better for complex state logic with multiple sub-values, when next state depends on previous state, or when you want to optimize performance by passing dispatch down instead of callbacks.",
      key_points: [
        "useState: simple values, independent updates",
        "useReducer: complex objects, related values",
        "useReducer: state machine-like logic",
        "useReducer: better for testing (pure reducer functions)",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["react", "javascript", "typescript"],
    company_tags: ["meta", "airbnb"],
    topic_tags: ["hooks", "state-management"],
    time_estimate_minutes: 5,
    irt_difficulty: 0.3,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "React Server Components",
    prompt: "Explain React Server Components. How do they differ from traditional React components and Client Components?",
    hints: [
      "Think about where the component renders",
      "Consider the bundle size implications",
    ],
    solution: {
      explanation: "React Server Components (RSC) render on the server and send HTML to the client. They can't use hooks or browser APIs but can directly access backend resources. They reduce bundle size since their code never ships to the client. Client Components are the traditional React components that run in the browser.",
      key_points: [
        "Server Components render on server, not in browser",
        "Zero bundle size for Server Components",
        "Direct access to databases and file system",
        "Cannot use useState, useEffect, or browser APIs",
        "Use 'use client' directive for Client Components",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["react", "nextjs", "typescript"],
    company_tags: ["vercel", "meta"],
    topic_tags: ["server-components", "rsc", "nextjs"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.8,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
  {
    type: "coding",
    format: "code",
    title: "Implement a Custom Hook: useDebounce",
    prompt: "Implement a custom React hook called useDebounce that debounces a value. The hook should take a value and delay (in ms) as parameters and return the debounced value.\n\n```typescript\nfunction useDebounce<T>(value: T, delay: number): T {\n  // Your implementation\n}\n```",
    hints: [
      "You'll need useState and useEffect",
      "Remember to cleanup the timeout",
    ],
    solution: {
      explanation: "The hook uses useState to store the debounced value and useEffect to update it after the delay. The cleanup function clears the timeout if the value changes before the delay completes.",
      code: `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
      key_points: [
        "Uses useState to store the debounced value",
        "useEffect runs on value or delay change",
        "Cleanup function prevents stale updates",
        "Generic type for flexibility",
      ],
    },
    rubric: CODING_RUBRIC,
    difficulty: "intermediate",
    technologies: ["react", "typescript"],
    company_tags: ["meta", "google", "stripe"],
    topic_tags: ["hooks", "custom-hooks", "debounce"],
    time_estimate_minutes: 10,
    irt_difficulty: 0.2,
    irt_discrimination: 1.4,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "useMemo vs useCallback",
    prompt: "Explain the difference between useMemo and useCallback. When would you use each?",
    hints: [
      "Think about what each returns",
      "Consider child component re-renders",
    ],
    solution: {
      explanation: "useMemo memoizes a computed value (the result of a function), while useCallback memoizes a function itself. useMemo is for expensive calculations; useCallback is for stable function references passed to optimized child components.",
      key_points: [
        "useMemo returns memoized value",
        "useCallback returns memoized function",
        "useCallback(fn, deps) === useMemo(() => fn, deps)",
        "Both help prevent unnecessary re-renders",
        "Don't overuse - premature optimization",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["react", "javascript", "typescript"],
    company_tags: ["meta", "netflix"],
    topic_tags: ["hooks", "performance", "memoization"],
    time_estimate_minutes: 5,
    irt_difficulty: 0.1,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

export const JAVASCRIPT_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Explain the Event Loop",
    prompt: "Explain how the JavaScript event loop works. Include the call stack, task queue, and microtask queue in your explanation.",
    hints: [
      "Start with the call stack",
      "Think about where Promises go vs setTimeout",
    ],
    solution: {
      explanation: "The event loop continuously checks if the call stack is empty. If empty, it processes all microtasks (Promise callbacks), then takes one task from the task queue (setTimeout, events). Microtasks have priority over tasks.",
      key_points: [
        "Call stack executes synchronous code",
        "Microtask queue: Promises, queueMicrotask, MutationObserver",
        "Task queue: setTimeout, setInterval, I/O, UI events",
        "Microtasks drain completely before next task",
        "Each task can spawn new microtasks",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["javascript"],
    company_tags: ["google", "meta", "amazon"],
    topic_tags: ["event-loop", "async", "concurrency"],
    time_estimate_minutes: 8,
    irt_difficulty: 0.7,
    irt_discrimination: 1.4,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "What is a Closure?",
    prompt: "Explain what a closure is in JavaScript. Provide a practical example of when you would use one.",
    hints: [
      "Think about function scope",
      "Consider data privacy",
    ],
    solution: {
      explanation: "A closure is a function that has access to its outer (enclosing) function's variables even after the outer function has returned. Closures are created every time a function is created.",
      code: `function createCounter() {
  let count = 0; // Private variable
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2`,
      key_points: [
        "Function retains access to outer scope",
        "Data encapsulation and privacy",
        "Used in module pattern, callbacks",
        "Each closure maintains its own scope",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["javascript"],
    company_tags: ["google", "meta", "microsoft"],
    topic_tags: ["closures", "scope", "functions"],
    time_estimate_minutes: 5,
    irt_difficulty: -0.2,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
  {
    type: "coding",
    format: "code",
    title: "Implement Array.prototype.reduce",
    prompt: "Implement a polyfill for Array.prototype.reduce without using the built-in reduce method.\n\n```javascript\nArray.prototype.myReduce = function(callback, initialValue) {\n  // Your implementation\n}\n```",
    hints: [
      "Handle the case when no initialValue is provided",
      "Remember to pass all 4 arguments to the callback",
    ],
    solution: {
      explanation: "The implementation iterates through the array, calling the callback with accumulator, current value, index, and array. If no initial value is provided, the first element is used as the initial accumulator.",
      code: `Array.prototype.myReduce = function(callback, initialValue) {
  if (this.length === 0 && initialValue === undefined) {
    throw new TypeError('Reduce of empty array with no initial value');
  }

  let accumulator = initialValue !== undefined ? initialValue : this[0];
  const startIndex = initialValue !== undefined ? 0 : 1;

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};`,
      key_points: [
        "Handle empty array with no initial value",
        "Determine starting index based on initialValue",
        "Pass all 4 arguments to callback",
        "Return final accumulator",
      ],
    },
    rubric: CODING_RUBRIC,
    difficulty: "intermediate",
    technologies: ["javascript"],
    company_tags: ["meta", "amazon", "apple"],
    topic_tags: ["arrays", "higher-order-functions", "polyfills"],
    time_estimate_minutes: 12,
    irt_difficulty: 0.4,
    irt_discrimination: 1.5,
    irt_guessing: 0,
  },
];

export const SYSTEM_DESIGN_QUESTIONS: SeedQuestion[] = [
  {
    type: "system_design",
    format: "whiteboard",
    title: "Design a URL Shortener",
    prompt: "Design a URL shortening service like bit.ly. Consider:\n- Functional requirements (shorten URL, redirect to original)\n- Non-functional requirements (high availability, low latency)\n- Scale (100M URLs, 1B redirects/day)\n\nDiscuss your high-level design, database choice, and key algorithms.",
    hints: [
      "Think about how to generate unique short codes",
      "Consider read vs write ratio",
      "How would you handle hot URLs?",
    ],
    solution: {
      explanation: "A URL shortener needs a way to generate unique short codes (base62 encoding of counter or random), a database for mappings (NoSQL for scale), caching for popular URLs, and potentially a distributed ID generator.",
      key_points: [
        "Base62 encoding for short URLs (a-z, A-Z, 0-9)",
        "Key-value store (Redis, DynamoDB) for speed",
        "Cache layer for hot URLs (90% reads)",
        "Counter or hash-based ID generation",
        "Consider analytics requirements",
        "CDN for redirect performance",
      ],
    },
    rubric: [
      {
        name: "Requirements",
        weight: 0.2,
        anchors: {
          1: "No requirements gathered",
          2: "Basic functional requirements only",
          3: "Good functional + some non-functional",
          4: "Comprehensive requirements with scale estimates",
          5: "Expert-level requirements analysis",
        },
      },
      {
        name: "High-Level Design",
        weight: 0.3,
        anchors: {
          1: "Missing or incorrect design",
          2: "Basic design with gaps",
          3: "Solid design covering main components",
          4: "Well-thought-out design with trade-offs",
          5: "Excellent design with alternatives discussed",
        },
      },
      {
        name: "Deep Dive",
        weight: 0.3,
        anchors: {
          1: "No technical depth",
          2: "Surface-level explanations",
          3: "Good depth on key components",
          4: "Strong technical details",
          5: "Expert-level depth with edge cases",
        },
      },
      {
        name: "Scalability",
        weight: 0.2,
        anchors: {
          1: "No scalability considerations",
          2: "Basic scaling mentioned",
          3: "Solid horizontal scaling plan",
          4: "Comprehensive scaling strategy",
          5: "Expert handling of scale challenges",
        },
      },
    ],
    difficulty: "intermediate",
    technologies: ["general"],
    company_tags: ["google", "amazon", "meta", "microsoft"],
    topic_tags: ["url-shortener", "distributed-systems", "caching"],
    time_estimate_minutes: 45,
    irt_difficulty: 0.5,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
];

export const BEHAVIORAL_QUESTIONS: SeedQuestion[] = [
  {
    type: "behavioral",
    format: "voice",
    title: "Tell me about a time you failed",
    prompt: "Describe a significant failure in your professional career. What happened, what did you learn, and how did it change your approach?",
    hints: [
      "Choose a real, meaningful failure",
      "Focus more on what you learned",
      "Show growth and self-awareness",
    ],
    solution: {
      explanation: "Strong answers demonstrate self-awareness, accountability, and growth. Use the STAR method: Situation (20%), Task (10%), Action (60%), Result (10% - focused on learning).",
      key_points: [
        "Be honest about a real failure",
        "Take personal responsibility",
        "Emphasize specific lessons learned",
        "Show how you've applied those lessons",
        "Demonstrate growth mindset",
      ],
    },
    rubric: [
      {
        name: "Authenticity",
        weight: 0.25,
        anchors: {
          1: "Vague or clearly fabricated",
          2: "Generic answer, lacks specifics",
          3: "Genuine story with good details",
          4: "Very authentic and vulnerable",
          5: "Deeply authentic with strong self-awareness",
        },
      },
      {
        name: "Accountability",
        weight: 0.25,
        anchors: {
          1: "Blames others entirely",
          2: "Deflects most responsibility",
          3: "Acknowledges their role",
          4: "Takes full ownership",
          5: "Models accountability beautifully",
        },
      },
      {
        name: "Learning",
        weight: 0.25,
        anchors: {
          1: "No learning demonstrated",
          2: "Superficial lessons",
          3: "Clear, meaningful takeaways",
          4: "Deep insights with behavior change",
          5: "Transformative learning, applied repeatedly",
        },
      },
      {
        name: "Communication",
        weight: 0.25,
        anchors: {
          1: "Rambling or unclear",
          2: "Some structure issues",
          3: "Well-structured response",
          4: "Compelling storytelling",
          5: "Exceptional clarity and impact",
        },
      },
    ],
    difficulty: "intermediate",
    technologies: ["general"],
    company_tags: ["amazon", "google", "meta", "microsoft"],
    topic_tags: ["failure", "growth", "self-awareness"],
    time_estimate_minutes: 5,
    irt_difficulty: 0,
    irt_discrimination: 1.0,
    irt_guessing: 0,
  },
  {
    type: "behavioral",
    format: "voice",
    title: "Leadership without authority",
    prompt: "Tell me about a time when you had to lead a project or initiative without having formal authority over the team members.",
    hints: [
      "Focus on influence, not control",
      "Describe specific actions you took",
      "What was the outcome?",
    ],
    solution: {
      explanation: "This tests your ability to influence without power. Strong answers show coalition building, clear communication of vision, empathy, and achieving results through collaboration.",
      key_points: [
        "Establish credibility through expertise",
        "Build relationships and trust",
        "Create shared vision and goals",
        "Remove obstacles for others",
        "Celebrate team wins",
      ],
    },
    rubric: [
      {
        name: "Leadership Approach",
        weight: 0.3,
        anchors: {
          1: "Tried to use non-existent authority",
          2: "Basic coordination only",
          3: "Good influence tactics",
          4: "Strong servant leadership",
          5: "Inspiring leadership through influence",
        },
      },
      {
        name: "Results",
        weight: 0.3,
        anchors: {
          1: "No outcome mentioned",
          2: "Unclear or poor outcome",
          3: "Positive results achieved",
          4: "Strong, measurable impact",
          5: "Exceptional results with lasting change",
        },
      },
      {
        name: "Self-Awareness",
        weight: 0.2,
        anchors: {
          1: "No reflection",
          2: "Surface-level awareness",
          3: "Good self-reflection",
          4: "Deep understanding of dynamics",
          5: "Exceptional insight into leadership style",
        },
      },
      {
        name: "Communication",
        weight: 0.2,
        anchors: {
          1: "Disorganized story",
          2: "Some clarity issues",
          3: "Clear STAR structure",
          4: "Engaging storytelling",
          5: "Masterful narrative",
        },
      },
    ],
    difficulty: "intermediate",
    technologies: ["general"],
    company_tags: ["amazon", "google", "meta", "microsoft"],
    topic_tags: ["leadership", "influence", "collaboration"],
    time_estimate_minutes: 5,
    irt_difficulty: 0.3,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
];

import { ALL_ADDITIONAL_QUESTIONS } from "./more-questions";

export const ALL_SEED_QUESTIONS = [
  ...REACT_QUESTIONS,
  ...JAVASCRIPT_QUESTIONS,
  ...SYSTEM_DESIGN_QUESTIONS,
  ...BEHAVIORAL_QUESTIONS,
  ...ALL_ADDITIONAL_QUESTIONS,
];
