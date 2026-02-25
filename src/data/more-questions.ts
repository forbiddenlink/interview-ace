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

// Data Structures & Algorithms Questions
export const DSA_QUESTIONS: SeedQuestion[] = [
  {
    type: "coding",
    format: "code",
    title: "Two Sum Problem",
    prompt: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target. Assume each input has exactly one solution and you may not use the same element twice.",
    hints: [
      "Consider using a hash map for O(n) time complexity",
      "What information do you need to store while iterating?",
    ],
    solution: {
      explanation: "Use a hash map to store numbers we've seen and their indices. For each number, check if (target - num) exists in the map.",
      code: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }

  return []; // No solution found
}`,
      key_points: [
        "Hash map provides O(1) lookup",
        "Single pass through array - O(n) time",
        "O(n) space for the hash map",
        "Handle edge cases like no solution",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "beginner",
    technologies: ["javascript", "typescript"],
    company_tags: ["google", "amazon", "meta"],
    topic_tags: ["arrays", "hash-map", "two-pointers"],
    time_estimate_minutes: 15,
    irt_difficulty: -0.5,
    irt_discrimination: 1.4,
    irt_guessing: 0.1,
  },
  {
    type: "coding",
    format: "code",
    title: "Valid Parentheses",
    prompt: "Given a string containing just '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
    hints: [
      "Think about using a stack data structure",
      "What happens when you encounter a closing bracket?",
    ],
    solution: {
      explanation: "Use a stack to track opening brackets. When encountering a closing bracket, check if it matches the most recent opening bracket (top of stack).",
      code: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) return false;
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}`,
      key_points: [
        "Stack is LIFO - perfect for nested structures",
        "Map closing to opening brackets",
        "Check stack is empty at end",
        "O(n) time and O(n) space",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "beginner",
    technologies: ["javascript", "typescript"],
    company_tags: ["amazon", "microsoft", "meta"],
    topic_tags: ["stack", "strings", "matching"],
    time_estimate_minutes: 12,
    irt_difficulty: -0.3,
    irt_discrimination: 1.3,
    irt_guessing: 0.1,
  },
  {
    type: "coding",
    format: "code",
    title: "Merge Two Sorted Lists",
    prompt: "Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.",
    hints: [
      "Consider using a dummy head node",
      "Compare nodes from both lists one at a time",
    ],
    solution: {
      explanation: "Use a dummy node to simplify edge cases. Compare heads of both lists, attach the smaller one, and advance that pointer. Continue until one list is exhausted.",
      code: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2;
  return dummy.next;
}`,
      key_points: [
        "Dummy node avoids special-casing head",
        "Two-pointer technique for merging",
        "Attach remaining list at end",
        "O(n+m) time, O(1) extra space",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "beginner",
    technologies: ["javascript", "typescript"],
    company_tags: ["amazon", "apple", "microsoft"],
    topic_tags: ["linked-list", "two-pointers", "merge"],
    time_estimate_minutes: 15,
    irt_difficulty: -0.2,
    irt_discrimination: 1.2,
    irt_guessing: 0.05,
  },
  {
    type: "coding",
    format: "code",
    title: "Binary Tree Level Order Traversal",
    prompt: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    hints: [
      "BFS is naturally level-by-level",
      "Use a queue to process nodes in order",
    ],
    solution: {
      explanation: "Use BFS with a queue. Process all nodes at the current level before moving to the next. Track level size to know when a level ends.",
      code: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}`,
      key_points: [
        "BFS using queue processes level-by-level",
        "Track level size before processing",
        "Add children to queue for next level",
        "O(n) time and O(n) space",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["javascript", "typescript"],
    company_tags: ["amazon", "meta", "google"],
    topic_tags: ["binary-tree", "bfs", "queue"],
    time_estimate_minutes: 18,
    irt_difficulty: 0.2,
    irt_discrimination: 1.3,
    irt_guessing: 0.05,
  },
  {
    type: "coding",
    format: "code",
    title: "LRU Cache Implementation",
    prompt: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get(key) and put(key, value) operations in O(1) time complexity.",
    hints: [
      "You need O(1) access by key - what data structure provides that?",
      "You need to track recency order - what structure maintains order?",
      "Consider combining a hash map with a doubly linked list",
    ],
    solution: {
      explanation: "Combine a hash map (for O(1) key lookup) with a doubly linked list (for O(1) removal and insertion at ends). The list maintains usage order - most recent at head, least recent at tail.",
      code: `class LRUCache {
  private capacity: number;
  private cache: Map<number, { value: number; node: DoublyLinkedNode }>;
  private head: DoublyLinkedNode;
  private tail: DoublyLinkedNode;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new DoublyLinkedNode(0, 0);
    this.tail = new DoublyLinkedNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.cache.has(key)) return -1;
    const { value, node } = this.cache.get(key)!;
    this.moveToHead(node);
    return value;
  }

  put(key: number, value: number): void {
    if (this.cache.has(key)) {
      const { node } = this.cache.get(key)!;
      this.cache.set(key, { value, node });
      this.moveToHead(node);
    } else {
      if (this.cache.size >= this.capacity) {
        this.removeLRU();
      }
      const node = new DoublyLinkedNode(key, value);
      this.addToHead(node);
      this.cache.set(key, { value, node });
    }
  }
}`,
      key_points: [
        "Hash map + doubly linked list combo",
        "Dummy head/tail simplify edge cases",
        "Move to head on access (mark as recent)",
        "Remove from tail when over capacity",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["javascript", "typescript"],
    company_tags: ["amazon", "meta", "google", "netflix"],
    topic_tags: ["design", "hash-map", "linked-list", "cache"],
    time_estimate_minutes: 30,
    irt_difficulty: 0.7,
    irt_discrimination: 1.5,
    irt_guessing: 0,
  },
];

// Advanced System Design Questions
export const SYSTEM_DESIGN_ADVANCED_QUESTIONS: SeedQuestion[] = [
  {
    type: "system_design",
    format: "text",
    title: "Design a Real-time Collaboration System",
    prompt: "Design a real-time collaboration system like Google Docs where multiple users can edit the same document simultaneously. Focus on conflict resolution and consistency.",
    hints: [
      "Consider Operational Transformation (OT) or CRDTs",
      "Think about how to handle offline edits",
      "What happens when two users edit the same word?",
    ],
    solution: {
      explanation: "Real-time collaboration requires handling concurrent edits without conflicts. Two main approaches: Operational Transformation (OT) transforms operations to maintain consistency, while CRDTs (Conflict-free Replicated Data Types) are designed to automatically merge without conflicts.",
      key_points: [
        "OT: Transform operations based on concurrent changes",
        "CRDTs: Data structures that merge automatically",
        "WebSockets for real-time sync",
        "Version vectors for causality tracking",
        "Eventual consistency model",
        "Offline support with sync queue",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "expert",
    technologies: ["general"],
    company_tags: ["google", "notion", "figma"],
    topic_tags: ["real-time", "distributed-systems", "collaboration"],
    time_estimate_minutes: 45,
    irt_difficulty: 1.2,
    irt_discrimination: 1.6,
    irt_guessing: 0,
  },
  {
    type: "system_design",
    format: "text",
    title: "Design a Rate Limiter",
    prompt: "Design a distributed rate limiter that can handle millions of requests per second across multiple servers. It should support different rate limiting strategies (fixed window, sliding window, token bucket).",
    hints: [
      "Consider distributed state management",
      "Think about consistency vs availability tradeoffs",
      "How do you handle clock skew between servers?",
    ],
    solution: {
      explanation: "A distributed rate limiter needs to track request counts across multiple servers. Key considerations: where to store state (Redis is common), which algorithm to use, and how to handle race conditions.",
      key_points: [
        "Token bucket: Smooth rate, allows bursts",
        "Sliding window: More accurate than fixed window",
        "Redis for distributed state (atomic operations)",
        "Local rate limiting with sync for performance",
        "Eventual consistency is often acceptable",
        "Consider client-side rate limiting too",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["general"],
    company_tags: ["stripe", "cloudflare", "aws"],
    topic_tags: ["rate-limiting", "distributed-systems", "redis"],
    time_estimate_minutes: 35,
    irt_difficulty: 0.8,
    irt_discrimination: 1.4,
    irt_guessing: 0,
  },
  {
    type: "system_design",
    format: "text",
    title: "Design a Notification System",
    prompt: "Design a notification system that can send push notifications, emails, and SMS to millions of users. It should support user preferences, scheduling, and rate limiting.",
    hints: [
      "Think about message queues for reliability",
      "Consider user preferences and quiet hours",
      "How do you handle delivery failures?",
    ],
    solution: {
      explanation: "A notification system needs to handle high throughput, multiple channels, user preferences, and reliable delivery. Use message queues for decoupling and reliability.",
      key_points: [
        "Message queue (Kafka/SQS) for reliability",
        "Separate workers per notification channel",
        "User preference service for opt-outs",
        "Rate limiting per user and globally",
        "Retry logic with exponential backoff",
        "Analytics for delivery tracking",
        "Template system for consistent formatting",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["general"],
    company_tags: ["meta", "uber", "airbnb"],
    topic_tags: ["notifications", "message-queue", "distributed-systems"],
    time_estimate_minutes: 35,
    irt_difficulty: 0.6,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
];

// Cloud & Infrastructure Questions
export const CLOUD_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Microservices vs Monolith",
    prompt: "Compare microservices architecture with monolithic architecture. When would you choose one over the other? What are the tradeoffs?",
    hints: [
      "Consider team size and organization",
      "Think about deployment complexity",
      "What about debugging distributed systems?",
    ],
    solution: {
      explanation: "Monoliths are simpler to develop, deploy, and debug initially. Microservices offer better scalability and team autonomy but add operational complexity. The right choice depends on team size, scale requirements, and organizational structure.",
      key_points: [
        "Monolith: Simpler deployment, easier debugging",
        "Microservices: Independent scaling, team autonomy",
        "Start with monolith, extract services as needed",
        "Microservices need: service discovery, distributed tracing, API gateway",
        "Conway's Law: Architecture mirrors team structure",
        "Network latency and failure handling in microservices",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["general"],
    company_tags: ["amazon", "netflix", "uber"],
    topic_tags: ["architecture", "microservices", "scalability"],
    time_estimate_minutes: 15,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Container Orchestration with Kubernetes",
    prompt: "Explain Kubernetes core concepts: Pods, Services, Deployments, and ReplicaSets. How do they work together to run applications?",
    hints: [
      "Start with the smallest unit (Pod)",
      "Think about how traffic reaches your application",
      "How does Kubernetes handle scaling and updates?",
    ],
    solution: {
      explanation: "Kubernetes organizes applications into Pods (smallest deployable units), manages them with Deployments (desired state), scales with ReplicaSets (multiple pod instances), and exposes them with Services (stable network endpoints).",
      key_points: [
        "Pod: One or more containers sharing network/storage",
        "ReplicaSet: Ensures desired number of pod replicas",
        "Deployment: Manages ReplicaSets, handles updates",
        "Service: Stable endpoint, load balances across pods",
        "Labels and selectors connect these resources",
        "Declarative config: describe desired state, K8s reconciles",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["kubernetes", "docker"],
    company_tags: ["google", "amazon", "microsoft"],
    topic_tags: ["kubernetes", "containers", "orchestration"],
    time_estimate_minutes: 15,
    irt_difficulty: 0.4,
    irt_discrimination: 1.3,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Database Sharding Strategies",
    prompt: "Explain database sharding. What are different sharding strategies and when would you use each? What challenges does sharding introduce?",
    hints: [
      "Think about how to distribute data across shards",
      "Consider query patterns",
      "What happens when you need to add more shards?",
    ],
    solution: {
      explanation: "Sharding horizontally partitions data across multiple database instances. Key strategies: range-based (by ID ranges), hash-based (consistent hashing), and directory-based (lookup table).",
      key_points: [
        "Range sharding: Good for range queries, can cause hotspots",
        "Hash sharding: Even distribution, harder range queries",
        "Consistent hashing: Minimizes resharding on changes",
        "Challenges: Cross-shard queries, transactions, joins",
        "Shard key selection is critical",
        "Consider: read replicas before sharding",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "advanced",
    technologies: ["sql", "postgresql", "mongodb"],
    company_tags: ["meta", "uber", "pinterest"],
    topic_tags: ["database", "sharding", "scalability"],
    time_estimate_minutes: 20,
    irt_difficulty: 0.7,
    irt_discrimination: 1.4,
    irt_guessing: 0,
  },
];

// AI/ML Interview Questions
export const AI_ML_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "When to Use AI vs Traditional Programming",
    prompt: "As an engineer, how do you decide when to use AI/ML solutions versus traditional rule-based programming? What are the tradeoffs?",
    hints: [
      "Consider data availability",
      "Think about interpretability requirements",
      "What about maintenance and debugging?",
    ],
    solution: {
      explanation: "Use AI/ML when: patterns are complex and hard to define manually, you have sufficient quality data, and some uncertainty is acceptable. Use traditional programming when: rules are clear, interpretability is critical, or you lack training data.",
      key_points: [
        "ML needs: sufficient data, tolerance for errors",
        "Rules work better: clear logic, compliance needs",
        "ML is a black box - harder to debug",
        "Consider: model maintenance and drift",
        "Hybrid approaches often work best",
        "Start simple, add ML complexity when needed",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["general"],
    company_tags: ["google", "openai", "meta"],
    topic_tags: ["ai", "machine-learning", "architecture"],
    time_estimate_minutes: 12,
    irt_difficulty: 0.3,
    irt_discrimination: 1.1,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Integrating LLMs in Production Applications",
    prompt: "What are key considerations when integrating Large Language Models (LLMs) like GPT into production applications? Discuss reliability, cost, and safety.",
    hints: [
      "Think about rate limits and latency",
      "Consider prompt injection attacks",
      "How do you handle hallucinations?",
    ],
    solution: {
      explanation: "LLM integration requires careful consideration of reliability (rate limits, fallbacks), cost (token optimization), latency (streaming, caching), and safety (prompt injection, content filtering, hallucination detection).",
      key_points: [
        "Implement retry logic and fallbacks",
        "Cache common responses to reduce costs",
        "Use streaming for better UX on long responses",
        "Sanitize inputs to prevent prompt injection",
        "Add guardrails for content safety",
        "Validate outputs before using in critical paths",
        "Monitor for hallucinations and quality degradation",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["general"],
    company_tags: ["openai", "anthropic", "google"],
    topic_tags: ["llm", "ai", "production", "safety"],
    time_estimate_minutes: 15,
    irt_difficulty: 0.4,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
];

// Performance & Optimization Questions
export const PERFORMANCE_QUESTIONS: SeedQuestion[] = [
  {
    type: "conceptual",
    format: "text",
    title: "Frontend Performance Optimization",
    prompt: "What are key strategies for optimizing frontend performance in a modern web application? Focus on both loading and runtime performance.",
    hints: [
      "Think about what blocks initial render",
      "Consider bundle size and code splitting",
      "What about runtime performance with React?",
    ],
    solution: {
      explanation: "Frontend performance optimization involves reducing initial load time (code splitting, lazy loading, compression) and improving runtime performance (virtualization, memoization, avoiding re-renders).",
      key_points: [
        "Code splitting: Load only what's needed",
        "Lazy loading: Defer non-critical resources",
        "Image optimization: WebP, srcset, lazy loading",
        "Bundle analysis: Identify large dependencies",
        "React: useMemo, useCallback, React.memo",
        "Virtualization for long lists",
        "Core Web Vitals: LCP, FID, CLS",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["javascript", "react", "nextjs"],
    company_tags: ["meta", "google", "vercel"],
    topic_tags: ["performance", "optimization", "frontend"],
    time_estimate_minutes: 15,
    irt_difficulty: 0.3,
    irt_discrimination: 1.2,
    irt_guessing: 0,
  },
  {
    type: "conceptual",
    format: "text",
    title: "Database Query Optimization",
    prompt: "How do you identify and fix slow database queries? Walk through your approach to optimizing a slow query.",
    hints: [
      "Start with EXPLAIN/EXPLAIN ANALYZE",
      "Think about indexing strategies",
      "Consider query structure and N+1 problems",
    ],
    solution: {
      explanation: "Database optimization starts with identifying slow queries (slow query log), analyzing execution plans (EXPLAIN), and applying fixes: adding indexes, restructuring queries, denormalization, or caching.",
      key_points: [
        "EXPLAIN ANALYZE shows actual execution",
        "Index on WHERE, JOIN, ORDER BY columns",
        "Avoid SELECT * - select only needed columns",
        "N+1 problem: Use JOINs or batch loading",
        "Composite indexes for multi-column queries",
        "Consider denormalization for read-heavy workloads",
        "Query caching for repeated expensive queries",
      ],
    },
    rubric: CONCEPTUAL_RUBRIC,
    difficulty: "intermediate",
    technologies: ["sql", "postgresql"],
    company_tags: ["amazon", "uber", "airbnb"],
    topic_tags: ["database", "performance", "optimization"],
    time_estimate_minutes: 15,
    irt_difficulty: 0.4,
    irt_discrimination: 1.3,
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
  ...DSA_QUESTIONS,
  ...SYSTEM_DESIGN_ADVANCED_QUESTIONS,
  ...CLOUD_QUESTIONS,
  ...AI_ML_QUESTIONS,
  ...PERFORMANCE_QUESTIONS,
];
