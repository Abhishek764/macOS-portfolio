"use client"

import { Folder, Layers3, Sparkles, TerminalSquare, Globe2 } from "lucide-react"
import ProjectCard, { type Project } from "./project-card"

const projects: Project[] = [
  { title: "macOS Portfolio", summary: "A tactile macOS desktop simulator that turns a developer portfolio into an interactive product experience.", stack: ["Next.js", "React", "TypeScript", "Tailwind"], impact: "Premium interactive portfolio with draggable windows, Dock physics, and app-like navigation.", liveUrl: "https://abhiyad.vercel.app/", githubUrl: "https://github.com/Abhishek764", featured: true },
  { title: "AI Music Generation SaaS", summary: "Cloud-native SaaS generating original music from text prompts by orchestrating three generative AI models.", stack: ["Next.js", "FastAPI", "AWS", "Modal", "BetterAuth"], impact: "Cut wait time by 40% under peak load with a serverless GPU pipeline and async jobs.", githubUrl: "https://github.com/Abhishek764/ACE-step-music-gen", featured: true },
  { title: "AskMedi: RAG Medical Agent", summary: "Source-grounded medical recommendation agent built over a structured corpus with retrieval and reasoning.", stack: ["Python", "LangChain", "OpenAI", "Pinecone", "Flask"], impact: "35% higher accuracy than a keyword-search baseline with sub-2-second latency.", githubUrl: "https://github.com/Abhishek764/AskMedi" },
  { title: "Retail Microservices Platform", summary: "Production-pattern AWS EKS platform provisioned end-to-end with Terraform and GitOps bootstrapping.", stack: ["Terraform", "AWS EKS", "Kubernetes", "Helm", "ArgoCD"], impact: "One Terraform apply creates a self-syncing, self-healing deployment of five microservices.", githubUrl: "https://github.com/Abhishek764/Retail-Microservices-Platform" },
  { title: "Starbucks DevSecOps Pipeline", summary: "Security-gated Jenkins delivery pipeline with static analysis, vulnerability scanning, and observability.", stack: ["Jenkins", "Docker", "EKS", "SonarQube", "Trivy"], impact: "Every deployment is gated before promotion and instrumented with Prometheus/Grafana.", githubUrl: "https://github.com/Abhishek764/starbucks-website-deployment" },
  { title: "Blogging Website", summary: "Full-stack blogging platform with authentication, rich text editing, comments, likes, and integration coverage.", stack: ["Node.js", "Express", "React", "MongoDB", "JWT"], impact: "Validated end-to-end across 50 onboarded test users with Jest integration tests.", liveUrl: "https://blogging-website-frontend-git-main-abhishek764s-projects.vercel.app/", githubUrl: "https://github.com/Abhishek764/blogging-website-backend" },
]

const categories = [
  { label: "All Projects", icon: Folder },
  { label: "AI & Agents", icon: Sparkles },
  { label: "Cloud & DevOps", icon: TerminalSquare },
  { label: "Web Apps", icon: Globe2 },
]

export default function ProjectsContent() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f7f7f9]/90 font-sans text-gray-900 dark:bg-[#171719]/95 dark:text-gray-100 md:flex-row">
      <aside className="hidden w-[190px] shrink-0 border-r border-black/[0.07] bg-black/[0.025] p-4 dark:border-white/[0.08] dark:bg-white/[0.025] md:block">
        <div className="mb-6 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          <Layers3 size={14} aria-hidden="true" /> Portfolio
        </div>
        <nav aria-label="Project categories" className="space-y-1">
          {categories.map(({ label, icon: Icon }, index) => (
            <button key={label} type="button" className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors ${index === 0 ? "bg-blue-500/12 font-semibold text-blue-700 dark:bg-blue-400/15 dark:text-blue-200" : "text-gray-600 hover:bg-black/[0.05] dark:text-gray-300 dark:hover:bg-white/[0.07]"}`}>
              <Icon size={15} strokeWidth={index === 0 ? 2.2 : 1.8} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="min-h-0 flex-1 overflow-auto p-5 md:p-7">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Selected work</p>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-gray-950 dark:text-white">Projects</h2>
            <p className="mt-2 max-w-xl text-[13px] leading-5 text-gray-500 dark:text-gray-400">Systems, products, and platforms built with an obsession for useful details.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-black/[0.08] bg-white/70 px-3 py-1.5 text-[11px] font-medium text-gray-500 dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-gray-300 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> 6 shipped builds
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {projects.map((project, index) => <div key={project.title} className="portfolio-reveal" style={{ animationDelay: `${index * 45}ms` }}><ProjectCard project={project} /></div>)}
        </div>
      </main>
    </div>
  )
}
