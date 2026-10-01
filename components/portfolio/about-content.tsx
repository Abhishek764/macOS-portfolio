"use client"

import { ArrowUpRight, Cloud, Code2, Cpu, Github, Linkedin, Mail, ShieldCheck } from "lucide-react"

interface AboutContentProps { onContact: () => void }

const capabilities = [
  { title: "Product engineering", description: "Next.js, React, Node.js, FastAPI, and purposeful interfaces.", icon: Code2 },
  { title: "Cloud platforms", description: "AWS infrastructure across EKS, EC2, S3, Lambda, IAM, KMS, and VPC.", icon: Cloud },
  { title: "AI systems", description: "RAG pipelines, agentic workflows, generative AI, and retrieval systems.", icon: Cpu },
  { title: "Delivery & security", description: "Docker, Kubernetes, GitOps, CI/CD, observability, and DevSecOps.", icon: ShieldCheck },
]

export default function AboutContent({ onContact }: AboutContentProps) {
  return (
    <div className="h-full overflow-auto bg-[#f7f7f9]/90 p-6 font-sans text-gray-900 dark:bg-[#171719]/95 dark:text-gray-100 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
          <img src="/photos/abhishek.jpg" alt="Abhishek Kumar" className="h-20 w-20 rounded-[24px] object-cover shadow-xl ring-1 ring-black/10 dark:ring-white/10" />
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Profile</p>
            <h2 className="text-[27px] font-semibold tracking-[-0.04em] text-gray-950 dark:text-white">Abhishek Kumar</h2>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">DevOps engineer · full-stack developer · open-source contributor</p>
          </div>
        </div>
        <div className="mb-8 max-w-2xl space-y-4 text-[14px] leading-7 text-gray-600 dark:text-gray-300">
          <p>I build reliable products and the cloud-native systems beneath them — from CI/CD pipelines and infrastructure as code to AI-powered applications.</p>
          <p>I&apos;m an active Open Library contributor with two merged pull requests improving FastAPI partials and modernizing core library modules.</p>
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {capabilities.map(({ title, description, icon: Icon }, index) => <div key={title} className="portfolio-card portfolio-reveal rounded-2xl border border-black/[0.08] bg-white/65 p-4 backdrop-blur-xl dark:border-white/[0.1] dark:bg-white/[0.06]" style={{ animationDelay: `${index * 50}ms` }}><Icon size={18} className="mb-4 text-blue-600 dark:text-blue-300" aria-hidden="true" /><h3 className="mb-1 text-[13px] font-semibold text-gray-900 dark:text-white">{title}</h3><p className="text-[12px] leading-5 text-gray-500 dark:text-gray-400">{description}</p></div>)}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onContact} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-3.5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#171719]">Let&apos;s connect <ArrowUpRight size={14} aria-hidden="true" /></button>
          <a href="mailto:work.abhishek91@gmail.com" className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.1] bg-white/70 px-3.5 py-2.5 text-[12px] font-semibold text-gray-700 hover:bg-black/[0.06] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-white/[0.13]"><Mail size={14} aria-hidden="true" /> Email</a>
          <a href="https://www.linkedin.com/in/abhiyad-dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.1] bg-white/70 px-3.5 py-2.5 text-[12px] font-semibold text-gray-700 hover:bg-black/[0.06] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-white/[0.13]"><Linkedin size={14} aria-hidden="true" /> LinkedIn</a>
          <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.1] bg-white/70 px-3.5 py-2.5 text-[12px] font-semibold text-gray-700 hover:bg-black/[0.06] dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-white/[0.13]"><Github size={14} aria-hidden="true" /> GitHub</a>
        </div>
      </div>
    </div>
  )
}
