import type { Technology, TechDomain } from "@/types/database";

export interface TechnologyInfo {
  id: Technology;
  name: string;
  icon?: string;
  domain: TechDomain;
  color: string;
}

export const TECHNOLOGIES: TechnologyInfo[] = [
  // Frontend - Core
  { id: "html", name: "HTML", domain: "frontend", color: "orange" },
  { id: "css", name: "CSS", domain: "frontend", color: "blue" },
  { id: "javascript", name: "JavaScript", domain: "frontend", color: "yellow" },
  { id: "typescript", name: "TypeScript", domain: "frontend", color: "blue" },

  // Frontend - Frameworks
  { id: "react", name: "React", domain: "frontend", color: "cyan" },
  { id: "nextjs", name: "Next.js", domain: "fullstack", color: "zinc" },
  { id: "vue", name: "Vue.js", domain: "frontend", color: "green" },
  { id: "angular", name: "Angular", domain: "frontend", color: "red" },
  { id: "svelte", name: "Svelte", domain: "frontend", color: "orange" },

  // Backend
  { id: "nodejs", name: "Node.js", domain: "backend", color: "green" },
  { id: "python", name: "Python", domain: "backend", color: "blue" },
  { id: "java", name: "Java", domain: "backend", color: "red" },
  { id: "go", name: "Go", domain: "backend", color: "cyan" },
  { id: "rust", name: "Rust", domain: "backend", color: "orange" },
  { id: "php", name: "PHP", domain: "backend", color: "purple" },

  // Databases
  { id: "sql", name: "SQL", domain: "backend", color: "blue" },
  { id: "postgresql", name: "PostgreSQL", domain: "backend", color: "blue" },
  { id: "mongodb", name: "MongoDB", domain: "backend", color: "green" },
  { id: "redis", name: "Redis", domain: "backend", color: "red" },

  // DevOps
  { id: "docker", name: "Docker", domain: "devops", color: "blue" },
  { id: "kubernetes", name: "Kubernetes", domain: "devops", color: "blue" },
  { id: "aws", name: "AWS", domain: "devops", color: "orange" },
  { id: "gcp", name: "Google Cloud", domain: "devops", color: "blue" },
  { id: "azure", name: "Azure", domain: "devops", color: "blue" },
  { id: "ci_cd", name: "CI/CD", domain: "devops", color: "green" },
  { id: "terraform", name: "Terraform", domain: "devops", color: "purple" },

  // Other
  { id: "graphql", name: "GraphQL", domain: "fullstack", color: "pink" },
  { id: "rest_api", name: "REST APIs", domain: "fullstack", color: "green" },
  { id: "testing", name: "Testing", domain: "fullstack", color: "green" },
  { id: "security", name: "Security", domain: "fullstack", color: "red" },
  { id: "accessibility", name: "Accessibility", domain: "frontend", color: "blue" },
  { id: "performance", name: "Performance", domain: "fullstack", color: "yellow" },
];

export const DOMAINS: { id: TechDomain; name: string; description: string; icon: string }[] = [
  { id: "frontend", name: "Frontend Development", description: "HTML, CSS, JavaScript, and frameworks", icon: "Monitor" },
  { id: "backend", name: "Backend Development", description: "Server-side programming and APIs", icon: "Server" },
  { id: "fullstack", name: "Full Stack", description: "End-to-end web development", icon: "Layers" },
  { id: "dsa", name: "Data Structures & Algorithms", description: "Core CS fundamentals", icon: "Binary" },
  { id: "system_design", name: "System Design", description: "Designing scalable systems", icon: "Network" },
  { id: "devops", name: "DevOps & Cloud", description: "CI/CD and infrastructure", icon: "Cloud" },
  { id: "behavioral", name: "Behavioral", description: "Soft skills and STAR method", icon: "Users" },
  { id: "ux_ui", name: "UX/UI Design", description: "User experience and design", icon: "Palette" },
];

export const JOB_ROLE_MAPPINGS: Record<string, Technology[]> = {
  "Frontend Developer": ["html", "css", "javascript", "typescript", "react"],
  "React Developer": ["html", "css", "javascript", "typescript", "react", "nextjs"],
  "Vue Developer": ["html", "css", "javascript", "typescript", "vue"],
  "Angular Developer": ["html", "css", "javascript", "typescript", "angular"],
  "Full Stack Developer": ["html", "css", "javascript", "typescript", "react", "nodejs", "sql", "mongodb"],
  "Backend Developer": ["nodejs", "python", "sql", "postgresql", "rest_api"],
  "Python Developer": ["python", "sql", "rest_api", "testing"],
  "Node.js Developer": ["javascript", "typescript", "nodejs", "mongodb", "rest_api"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "ci_cd", "terraform"],
  "Cloud Engineer": ["aws", "gcp", "azure", "docker", "kubernetes", "terraform"],
};

export function getTechnologyById(id: Technology): TechnologyInfo | undefined {
  return TECHNOLOGIES.find((t) => t.id === id);
}

export function getTechnologiesByDomain(domain: TechDomain): TechnologyInfo[] {
  return TECHNOLOGIES.filter((t) => t.domain === domain);
}
