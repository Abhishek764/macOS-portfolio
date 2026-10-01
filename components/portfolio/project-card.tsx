"use client"

import { ArrowUpRight, Github, ExternalLink } from "lucide-react"

export interface Project {
  title: string
  summary: string
  stack: string[]
  impact: string
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="portfolio-card group flex h-full flex-col rounded-2xl border border-black/[0.08] bg-white/70 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/90 hover:shadow-[0_18px_48px_rgba(0,80,180,0.14)] dark:border-white/[0.1] dark:bg-white/[0.06] dark:hover:bg-white/[0.1]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            {project.featured ? "Featured build" : "Selected work"}
          </p>
          <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-gray-950 dark:text-white">
            {project.title}
          </h3>
        </div>
        <div className="rounded-xl bg-black/[0.04] p-2 text-gray-500 transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-600 dark:bg-white/[0.08] dark:text-gray-300 dark:group-hover:text-blue-300">
          <ArrowUpRight size={17} aria-hidden="true" />
        </div>
      </div>

      <p className="mb-5 flex-1 text-[13px] leading-6 text-gray-600 dark:text-gray-300">
        {project.summary}
      </p>

      <div className="mb-5 rounded-xl border border-blue-500/10 bg-blue-500/[0.06] px-3.5 py-3 dark:border-blue-300/10 dark:bg-blue-300/[0.08]">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600/80 dark:text-blue-200/80">
          Impact
        </p>
        <p className="text-[13px] font-medium leading-5 text-blue-950 dark:text-blue-50">
          {project.impact}
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {project.stack.map((technology) => (
          <span key={technology} className="rounded-full border border-black/[0.07] bg-black/[0.035] px-2.5 py-1 text-[10px] font-medium text-gray-600 dark:border-white/[0.1] dark:bg-white/[0.07] dark:text-gray-300">
            {technology}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#1e1e1e]">
            Live project <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.1] bg-white/70 px-3 py-2 text-[11px] font-semibold text-gray-700 transition-colors hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-white/[0.13] dark:focus-visible:ring-offset-[#1e1e1e]">
            <Github size={13} aria-hidden="true" /> GitHub
          </a>
        )}
      </div>
    </article>
  )
}
