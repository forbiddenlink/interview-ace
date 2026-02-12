/**
 * Additional questions for InterviewAce
 * Covers more technologies and question types
 */

import type { Question, RubricDimension } from "@/types/database";

const CONCEPTUAL_RUBRIC: RubricDimension[] = [
  {
    name: "Understanding",
    weight: 0.4,
    anchors: {
      1: "Cannot explain the concept",
      2: "Partial understanding with gaps",
      3: "Explains correctly with standard depth",
      4: "Deep understanding with examples",
      5: "Expert-level with edge cases",
    },
  },
  {
    name: "Clarity",
    weight: 0.3,
    anchors: {
      1: "Confusing or disorganized",
      2: "Some clarity issues",
      3: "Clear and organized",
      4: "Very clear with structure",
      5: "Exceptionally clear",
    },
  },
  {
    name: "Depth",
    weight: 0.3,
    anchors: {
      1: "Surface-level only",
      2: "Missing key details",
      3: "Appropriate depth",
      4: "Goes beyond basics",
      5: "Comprehensive insights",
    },
  },
];

type SeedQuestion = Omit<Question, "id" | "skill_id" | "created_at" | "is_active">;

// TypeScript Questions
export const TYPESCRIPT_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Generics in TypeScript",
    prompt: "Explain TypeScript generics. When and why would you use them? Provide examples of generic functions and types.",
    hints: ["Think about code reusability", "Consider type safety"],
    solution: {
      explanation: "Generics allow you to write flexible, reusable code while maintaining type safety. They let you create components that work with a variety of types rather than a single one.",
      code: `function identity<T>(arg: T): T {
  return arg;
}

interface Container<T> {
  value: T;
  transform: (val: T) => T;
}`,
      key_points: [
        "Generics provide type parameters",
        "Enable reusable, type-safe code",
        "Can be constrained with extends",
        "Common in collections and utilities",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["typescript"],
    company_tags: ["microsoft", "google"],
    topic_tags: ["generics", "type-safety", "reusability"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Union vs Intersection Types",
    prompt: "Explain the difference between union types (|) and intersection types (&) in TypeScript. When would you use each?",
    hints: ["Think about OR vs AND", "Consider object type combinations"],
    solution: {
      explanation: "Union types (A | B) mean the value can be A OR B. Intersection types (A & B) mean the value must be A AND B - combining all properties of both types.",
      code: `// Union: value is one or the other
type StringOrNumber = string | number;

// Intersection: value has ALL properties
type Employee = Person & Worker;`,
      key_points: [
        "Union = one of the types (OR)",
        "Intersection = all of the types (AND)",
        "Union narrows with type guards",
        "Intersection combines object shapes",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["typescript"],
    company_tags: ["microsoft"],
    topic_tags: ["types", "union", "intersection"],
    time_estimate_minutes: 5,
    irt_difficulty: 0.1,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Type Guards and Narrowing",
    prompt: "What are type guards in TypeScript? Explain different ways to narrow types and when you would use each approach.",
    hints: ["typeof, instanceof, in", "User-defined type guards"],
    solution: {
      explanation: "Type guards are expressions that narrow the type of a variable within a conditional block. TypeScript uses control flow analysis to understand these patterns.",
      code: `// typeof guard
if (typeof x === 'string') { x.toUpperCase(); }

// User-defined type guard
function isUser(obj: any): obj is User {
  return 'name' in obj && 'email' in obj;
}`,
      key_points: [
        "typeof for primitives",
        "instanceof for classes",
        "'in' operator for properties",
        "User-defined with 'is' keyword",
        "Discriminated unions with literal types",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["typescript"],
    company_tags: ["microsoft", "google"],
    topic_tags: ["type-guards", "narrowing", "type-safety"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.5,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
];

// Node.js Questions
export const NODEJS_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Node.js Event Loop",
    prompt: "Explain how Node.js handles concurrent operations despite being single-threaded. Describe the event loop phases.",
    hints: ["Think about non-blocking I/O", "Consider the phases: timers, I/O, etc."],
    solution: {
      explanation: "Node.js uses an event-driven, non-blocking I/O model. While JavaScript runs on a single thread, I/O operations are offloaded to the system kernel (libuv) which handles them asynchronously.",
      key_points: [
        "Single-threaded JavaScript execution",
        "libuv handles I/O asynchronously",
        "Phases: timers → I/O callbacks → idle → poll → check → close",
        "process.nextTick() runs between phases",
        "setImmediate() runs in check phase",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["nodejs", "javascript"],
    company_tags: ["amazon", "netflix"],
    topic_tags: ["event-loop", "async", "performance"],
    time_estimate_minutes: 8,
    irt_difficulty: 0.6,
    irt_discrimination: 1.4,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Streams in Node.js",
    prompt: "Explain Node.js streams. What are the different types and when would you use each?",
    hints: ["Readable, Writable, Duplex, Transform", "Memory efficiency"],
    solution: {
      explanation: "Streams are collections of data that might not be available all at once. They enable processing data piece by piece, which is memory-efficient for large datasets.",
      key_points: [
        "Readable: source of data (fs.createReadStream)",
        "Writable: destination (fs.createWriteStream)",
        "Duplex: both readable and writable (TCP socket)",
        "Transform: modify data as it passes through (zlib)",
        "pipe() for connecting streams",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["nodejs"],
    company_tags: ["netflix", "uber"],
    topic_tags: ["streams", "memory", "performance"],
    time_estimate_minutes: 6,
    irt_difficulty: 0.4,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

// CSS Questions
export const CSS_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "CSS Flexbox vs Grid",
    prompt: "When would you choose CSS Flexbox over Grid, and vice versa? Explain the key differences and use cases.",
    hints: ["One-dimensional vs two-dimensional", "Content vs layout"],
    solution: {
      explanation: "Flexbox is one-dimensional (row OR column) and content-first. Grid is two-dimensional (rows AND columns) and layout-first. Use Flexbox for components, Grid for page layouts.",
      key_points: [
        "Flexbox: 1D, content-driven, flexible",
        "Grid: 2D, layout-driven, structured",
        "Flexbox: nav bars, card content, centering",
        "Grid: page layouts, complex 2D patterns",
        "Can combine both in same project",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["css", "html"],
    company_tags: ["meta", "airbnb"],
    topic_tags: ["flexbox", "grid", "layout"],
    time_estimate_minutes: 5,
    irt_difficulty: 0,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "CSS Specificity",
    prompt: "Explain CSS specificity. How is it calculated and what happens when there are conflicts?",
    hints: ["ID > Class > Element", "Inline styles"],
    solution: {
      explanation: "Specificity determines which CSS rule applies when multiple rules target the same element. It's calculated as a tuple: (inline, IDs, classes/attributes, elements).",
      key_points: [
        "Inline styles: 1,0,0,0",
        "IDs: 0,1,0,0",
        "Classes/attributes/pseudo-classes: 0,0,1,0",
        "Elements/pseudo-elements: 0,0,0,1",
        "!important overrides (avoid when possible)",
        "Equal specificity: last rule wins",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "beginner",
    technologies: ["css"],
    company_tags: ["google", "meta"],
    topic_tags: ["specificity", "cascade", "selectors"],
    time_estimate_minutes: 5,
    irt_difficulty: -0.3,
    irt_discrimination: 1.0,
    irt_guessing: 0,
  },
];

// Next.js Questions
export const NEXTJS_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Next.js App Router vs Pages Router",
    prompt: "Compare the App Router and Pages Router in Next.js. What are the key differences and when would you choose each?",
    hints: ["Server Components", "Layouts and nested routing"],
    solution: {
      explanation: "App Router (app/) is the new paradigm using React Server Components by default, with nested layouts. Pages Router (pages/) is the traditional approach with client-side React.",
      key_points: [
        "App Router: Server Components default",
        "App Router: Nested layouts with layout.tsx",
        "App Router: More granular caching",
        "Pages Router: Simpler mental model",
        "Pages Router: Better for existing projects",
        "App Router recommended for new projects",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["nextjs", "react"],
    company_tags: ["vercel", "meta"],
    topic_tags: ["routing", "app-router", "pages-router"],
    time_estimate_minutes: 6,
    irt_difficulty: 0.2,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Next.js Data Fetching",
    prompt: "Explain the different data fetching strategies in Next.js App Router. When would you use each?",
    hints: ["Static vs Dynamic", "Caching options"],
    solution: {
      explanation: "Next.js offers multiple data fetching patterns: static (cached indefinitely), dynamic (per-request), and ISR (revalidated periodically). Server Components can fetch directly.",
      code: `// Static (default)
fetch('https://...', { cache: 'force-cache' })

// Dynamic
fetch('https://...', { cache: 'no-store' })

// ISR (revalidate every 60s)
fetch('https://...', { next: { revalidate: 60 } })`,
      key_points: [
        "Static: Cached at build time",
        "Dynamic: Fresh data every request",
        "ISR: Periodic revalidation",
        "Server Components fetch directly",
        "route segment config options",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["nextjs", "react"],
    company_tags: ["vercel"],
    topic_tags: ["data-fetching", "caching", "ssr", "ssg"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.4,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
];

// SQL/Database Questions
export const DATABASE_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "SQL JOINs Explained",
    prompt: "Explain the different types of SQL JOINs (INNER, LEFT, RIGHT, FULL). When would you use each?",
    hints: ["Think about matching vs non-matching rows", "NULL handling"],
    solution: {
      explanation: "JOINs combine rows from multiple tables based on a related column. The type determines which non-matching rows are included.",
      key_points: [
        "INNER JOIN: Only matching rows from both",
        "LEFT JOIN: All from left, matching from right",
        "RIGHT JOIN: All from right, matching from left",
        "FULL JOIN: All rows from both tables",
        "NULL for non-matching values",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "beginner",
    technologies: ["sql", "postgresql"],
    company_tags: ["amazon", "google", "meta"],
    topic_tags: ["joins", "queries", "relational"],
    time_estimate_minutes: 5,
    irt_difficulty: -0.2,
    irt_discrimination: 1.0,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Database Indexing",
    prompt: "What are database indexes? Explain how they work and when they can hurt performance.",
    hints: ["B-tree structure", "Write vs read trade-off"],
    solution: {
      explanation: "Indexes are data structures that speed up data retrieval by maintaining sorted references to rows. They're typically B-tree structures that allow O(log n) lookups.",
      key_points: [
        "Speed up SELECT queries",
        "Slow down INSERT/UPDATE/DELETE",
        "B-tree: balanced tree structure",
        "Composite indexes for multi-column queries",
        "Over-indexing wastes space and slows writes",
        "Use EXPLAIN to analyze query plans",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["sql", "postgresql", "mongodb"],
    company_tags: ["amazon", "uber"],
    topic_tags: ["indexes", "performance", "optimization"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "SQL vs NoSQL",
    prompt: "Compare SQL and NoSQL databases. When would you choose each? Provide examples of each type.",
    hints: ["ACID vs eventual consistency", "Schema flexibility"],
    solution: {
      explanation: "SQL databases are relational with fixed schemas and ACID transactions. NoSQL databases offer flexibility, horizontal scaling, and various data models (document, key-value, graph).",
      key_points: [
        "SQL: Fixed schema, ACID, complex queries",
        "NoSQL: Flexible schema, horizontal scale",
        "SQL: PostgreSQL, MySQL (transactions, relations)",
        "NoSQL: MongoDB (documents), Redis (key-value), Neo4j (graph)",
        "Choose based on data model and scale needs",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["sql", "mongodb", "postgresql", "redis"],
    company_tags: ["amazon", "google", "meta"],
    topic_tags: ["databases", "nosql", "sql", "architecture"],
    time_estimate_minutes: 8,
    irt_difficulty: 0.2,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
];

// API Design Questions
export const API_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "REST API Best Practices",
    prompt: "What makes a well-designed REST API? Discuss naming conventions, HTTP methods, status codes, and versioning.",
    hints: ["Resource-based URLs", "Proper HTTP verbs"],
    solution: {
      explanation: "A well-designed REST API uses resource-based URLs, appropriate HTTP methods for actions, meaningful status codes, and clear versioning strategy.",
      key_points: [
        "Nouns for resources (/users, not /getUsers)",
        "HTTP verbs: GET, POST, PUT, PATCH, DELETE",
        "Status codes: 200, 201, 400, 401, 404, 500",
        "Versioning: /v1/ or Accept header",
        "Pagination for collections",
        "Consistent error format",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["rest_api", "nodejs"],
    company_tags: ["stripe", "twilio"],
    topic_tags: ["rest", "api-design", "best-practices"],
    time_estimate_minutes: 8,
    irt_difficulty: 0.1,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "GraphQL vs REST",
    prompt: "Compare GraphQL and REST. What are the advantages and disadvantages of each? When would you choose one over the other?",
    hints: ["Over-fetching and under-fetching", "Schema and types"],
    solution: {
      explanation: "REST uses fixed endpoints returning predefined data shapes. GraphQL provides a single endpoint where clients specify exactly what data they need via queries.",
      key_points: [
        "GraphQL: Client specifies data shape",
        "REST: Server defines response shape",
        "GraphQL: Single endpoint, no over-fetching",
        "REST: Multiple endpoints, simpler caching",
        "GraphQL: Strongly typed schema",
        "REST: Better for simple CRUD, caching",
        "GraphQL: Better for complex, nested data",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["graphql", "rest_api"],
    company_tags: ["meta", "github", "shopify"],
    topic_tags: ["graphql", "rest", "api-design"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

// DevOps Questions
export const DEVOPS_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Docker Containers Explained",
    prompt: "What is Docker and how do containers differ from virtual machines? Explain the key concepts: images, containers, Dockerfile.",
    hints: ["Shared kernel vs full OS", "Layers and caching"],
    solution: {
      explanation: "Docker containers package applications with their dependencies into isolated environments. Unlike VMs, containers share the host OS kernel, making them lightweight and fast.",
      key_points: [
        "Containers share host kernel (lightweight)",
        "VMs run full OS (more isolation, heavier)",
        "Image: Blueprint/template",
        "Container: Running instance of image",
        "Dockerfile: Build instructions",
        "Layers enable caching and reuse",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "beginner",
    technologies: ["docker"],
    company_tags: ["amazon", "google", "microsoft"],
    topic_tags: ["docker", "containers", "devops"],
    time_estimate_minutes: 6,
    irt_difficulty: -0.1,
    irt_discrimination: 1.0,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Kubernetes Basics",
    prompt: "Explain the core concepts of Kubernetes: Pods, Services, Deployments. How do they work together?",
    hints: ["Pods are the smallest unit", "Services expose pods"],
    solution: {
      explanation: "Kubernetes orchestrates containers at scale. Pods are groups of containers, Deployments manage pod replicas and updates, Services expose pods to network traffic.",
      key_points: [
        "Pod: One or more containers, shared network",
        "Deployment: Manages pod replicas, rolling updates",
        "Service: Stable network endpoint for pods",
        "ReplicaSet: Ensures desired pod count",
        "ConfigMap/Secret: Configuration management",
        "Ingress: External HTTP(S) routing",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["kubernetes", "docker"],
    company_tags: ["google", "amazon", "microsoft"],
    topic_tags: ["kubernetes", "orchestration", "devops"],
    time_estimate_minutes: 8,
    irt_difficulty: 0.5,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "CI/CD Pipeline Design",
    prompt: "Design a CI/CD pipeline for a web application. What stages would you include and why?",
    hints: ["Build, test, deploy", "Environment promotion"],
    solution: {
      explanation: "A CI/CD pipeline automates building, testing, and deploying code. It typically includes stages for linting, testing, building artifacts, and deploying to environments.",
      key_points: [
        "Lint/Format: Code quality checks",
        "Unit Tests: Fast, isolated tests",
        "Integration Tests: Component interaction",
        "Build: Create deployable artifact",
        "Deploy to Staging: Test in prod-like env",
        "Deploy to Production: Blue-green or canary",
        "Rollback strategy",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["ci_cd", "docker"],
    company_tags: ["amazon", "google", "netflix"],
    topic_tags: ["ci-cd", "automation", "devops"],
    time_estimate_minutes: 10,
    irt_difficulty: 0.4,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

// Security Questions
export const SECURITY_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "XSS Prevention",
    prompt: "What is Cross-Site Scripting (XSS)? Explain the different types and how to prevent them.",
    hints: ["Stored, Reflected, DOM-based", "Input sanitization"],
    solution: {
      explanation: "XSS attacks inject malicious scripts into web pages viewed by other users. Prevention includes input validation, output encoding, and Content Security Policy.",
      key_points: [
        "Stored XSS: Script saved in database",
        "Reflected XSS: Script in URL/request",
        "DOM XSS: Client-side script manipulation",
        "Escape output (HTML entities)",
        "Content Security Policy headers",
        "HttpOnly cookies prevent cookie theft",
        "Use frameworks with built-in escaping",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["security", "javascript"],
    company_tags: ["google", "meta", "stripe"],
    topic_tags: ["xss", "security", "web-security"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "JWT Authentication",
    prompt: "Explain how JWT (JSON Web Tokens) work for authentication. What are the security considerations?",
    hints: ["Header, Payload, Signature", "Stateless authentication"],
    solution: {
      explanation: "JWTs are self-contained tokens with encoded claims. They consist of a header (algorithm), payload (claims), and signature. They enable stateless authentication.",
      key_points: [
        "Three parts: header.payload.signature",
        "Base64Url encoded, not encrypted",
        "Signature verifies integrity",
        "Short expiration times recommended",
        "Store in httpOnly cookies (not localStorage)",
        "Refresh token rotation",
        "Consider token revocation strategy",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["security", "nodejs"],
    company_tags: ["auth0", "okta"],
    topic_tags: ["jwt", "authentication", "security"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.2,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
];

// Testing Questions
export const TESTING_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Testing Pyramid",
    prompt: "Explain the testing pyramid. What types of tests should you have and in what proportion?",
    hints: ["Unit, Integration, E2E", "Speed vs confidence"],
    solution: {
      explanation: "The testing pyramid suggests having many unit tests (fast, cheap), fewer integration tests, and even fewer E2E tests (slow, expensive). This balances speed and confidence.",
      key_points: [
        "Unit tests: Most numerous, fastest",
        "Integration tests: Mid-level, test interactions",
        "E2E tests: Fewest, test full flows",
        "Unit: 70%, Integration: 20%, E2E: 10%",
        "Higher in pyramid = slower, more expensive",
        "Lower in pyramid = faster, less realistic",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "beginner",
    technologies: ["testing"],
    company_tags: ["google", "microsoft"],
    topic_tags: ["testing", "unit-tests", "integration-tests"],
    time_estimate_minutes: 5,
    irt_difficulty: -0.2,
    irt_discrimination: 1.0,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Mocking vs Stubbing",
    prompt: "What's the difference between mocks and stubs? When would you use each in testing?",
    hints: ["Verification vs data", "Behavior vs state"],
    solution: {
      explanation: "Stubs provide predetermined responses to calls. Mocks verify that specific interactions occurred. Stubs focus on state, mocks focus on behavior verification.",
      key_points: [
        "Stub: Returns canned data",
        "Mock: Verifies calls were made",
        "Stub: 'Return X when called'",
        "Mock: 'Was method Y called with Z?'",
        "Prefer stubs for simpler tests",
        "Use mocks for interaction testing",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["testing", "javascript"],
    company_tags: ["google", "amazon"],
    topic_tags: ["testing", "mocking", "tdd"],
    time_estimate_minutes: 5,
    irt_difficulty: 0.2,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
];

// Accessibility Questions
export const ACCESSIBILITY_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "WCAG Guidelines",
    prompt: "What is WCAG and what are its four main principles? How would you ensure a website meets WCAG 2.1 AA standards?",
    hints: ["POUR: Perceivable, Operable, Understandable, Robust", "AA is most common target"],
    solution: {
      explanation: "WCAG (Web Content Accessibility Guidelines) provides standards for web accessibility. The four principles are POUR: Perceivable, Operable, Understandable, Robust.",
      key_points: [
        "Perceivable: Content can be perceived (alt text, captions)",
        "Operable: Interface is navigable (keyboard, time limits)",
        "Understandable: Content is clear (labels, error prevention)",
        "Robust: Works with assistive tech (valid HTML, ARIA)",
        "AA: Most common compliance level",
        "Test with screen readers and keyboard",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["accessibility", "html"],
    company_tags: ["google", "microsoft", "apple"],
    topic_tags: ["wcag", "a11y", "accessibility"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "ARIA Attributes",
    prompt: "What is ARIA? When should you use ARIA attributes and when should you avoid them?",
    hints: ["First rule of ARIA", "Native HTML is better"],
    solution: {
      explanation: "ARIA (Accessible Rich Internet Applications) adds semantic information for assistive technologies. However, native HTML elements are preferable when possible.",
      key_points: [
        "First rule: Don't use ARIA if native HTML works",
        "ARIA roles: button, navigation, alert",
        "ARIA states: aria-expanded, aria-selected",
        "ARIA properties: aria-label, aria-describedby",
        "aria-live for dynamic content",
        "Test with actual screen readers",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["accessibility", "html"],
    company_tags: ["google", "apple"],
    topic_tags: ["aria", "a11y", "screen-readers"],
    time_estimate_minutes: 6,
    irt_difficulty: 0.4,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

// Vue Questions
export const VUE_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Vue Composition API",
    prompt: "Explain the Vue Composition API. How does it differ from the Options API and when would you use each?",
    hints: ["Reactive refs", "Composables for reuse"],
    solution: {
      explanation: "Composition API organizes code by logical concern using reactive primitives (ref, reactive, computed). Options API organizes by option type (data, methods, computed).",
      key_points: [
        "Options API: Organized by option (data, methods)",
        "Composition API: Organized by feature/concern",
        "ref() for primitives, reactive() for objects",
        "Composables for reusable logic",
        "Better TypeScript support in Composition",
        "Options simpler for small components",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["vue", "javascript", "typescript"],
    company_tags: ["gitlab", "alibaba"],
    topic_tags: ["composition-api", "options-api", "vue3"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

// Angular Questions
export const ANGULAR_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Angular Dependency Injection",
    prompt: "Explain how dependency injection works in Angular. What are providers and how do you configure them?",
    hints: ["Injector hierarchy", "providedIn: 'root'"],
    solution: {
      explanation: "Angular's DI system creates and manages instances of dependencies. Services are registered with providers, and Angular's injector hierarchy resolves dependencies.",
      key_points: [
        "Services decorated with @Injectable()",
        "providedIn: 'root' for singleton services",
        "Component-level providers for scoped instances",
        "Injector hierarchy mirrors component tree",
        "Constructor injection is standard",
        "inject() function as alternative",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["angular", "typescript"],
    company_tags: ["google", "microsoft"],
    topic_tags: ["dependency-injection", "services", "angular"],
    time_estimate_minutes: 7,
    irt_difficulty: 0.4,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

export const ALL_ADDITIONAL_QUESTIONS = [
  ...TYPESCRIPT_QUESTIONS,
  ...NODEJS_QUESTIONS,
  ...CSS_QUESTIONS,
  ...NEXTJS_QUESTIONS,
  ...DATABASE_QUESTIONS,
  ...API_QUESTIONS,
  ...DEVOPS_QUESTIONS,
  ...SECURITY_QUESTIONS,
  ...TESTING_QUESTIONS,
  ...ACCESSIBILITY_QUESTIONS,
  ...VUE_QUESTIONS,
  ...ANGULAR_QUESTIONS,
];
