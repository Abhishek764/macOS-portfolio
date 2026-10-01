"use client"

import { ArrowRight, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react"

interface WelcomeWindowProps {
  onOpenProjects: () => void
  onOpenResume: () => void
  onOpenContact: () => void
}

export default function WelcomeWindow({ onOpenProjects, onOpenResume, onOpenContact }: WelcomeWindowProps) {
  return (
    <div className="relative h-full overflow-auto bg-[#f7f7f9]/90 font-sans text-gray-900 dark:bg-[#171719]/95 dark:text-gray-100">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-400/10" />
      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center px-7 py-10 md:px-12">
        <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/10"><Sparkles size={14} aria-hidden="true" /></span>
          Welcome to my workspace
        </div>
        <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
          <img src="/photos/abhishek.jpg" alt="Abhishek Kumar" className="h-24 w-24 rounded-[28px] object-cover shadow-2xl ring-1 ring-black/10 dark:ring-white/10" />
          <div>
            <h1 className="text-[35px] font-semibold tracking-[-0.055em] text-gray-950 dark:text-white md:text-[42px]">Abhishek Kumar</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-6 text-gray-600 dark:text-gray-300">I design cloud-native systems and full-stack products that feel as considered as they are reliable.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-green-700 dark:text-green-300"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Open to meaningful work</span>
          <span className="rounded-full border border-black/[0.08] bg-black/[0.03] px-3 py-1.5 dark:border-white/[0.1] dark:bg-white/[0.06]">DevOps · Full-stack · AI</span>
        </div>
        <div className="mt-9 flex flex-wrap gap-2.5">
          <button type="button" onClick={onOpenProjects} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-[12px] font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#171719]">Explore projects <ArrowRight size={15} aria-hidden="true" /></button>
          <button type="button" onClick={onOpenResume} className="inline-flex items-center gap-2 rounded-xl border border-black/[0.1] bg-white/70 px-4 py-3 text-[12px] font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-white/[0.13] dark:focus-visible:ring-offset-[#171719]"><Download size={15} aria-hidden="true" /> Open resume</button>
          <button type="button" onClick={onOpenContact} className="inline-flex items-center gap-2 rounded-xl border border-black/[0.1] bg-white/70 px-4 py-3 text-[12px] font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:bg-black/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-white/[0.12] dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-white/[0.13] dark:focus-visible:ring-offset-[#171719]"><Mail size={15} aria-hidden="true" /> Contact</button>
        </div>
        <div className="mt-10 flex items-center gap-4 border-t border-black/[0.08] pt-5 text-[12px] dark:border-white/[0.09]">
          <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"><Github size={14} aria-hidden="true" /> GitHub</a>
          <a href="https://www.linkedin.com/in/abhiyad-dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"><Linkedin size={14} aria-hidden="true" /> LinkedIn</a>
        </div>
      </div>
    </div>
  )
}
