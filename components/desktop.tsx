"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import MenuBar from "@/components/menu-bar"
import Terminal from "@/components/terminal"
import PhotoGallery from "@/components/photo-gallery"
import Certifications from "@/components/certifications"
import SystemPreferences from "@/components/system-preferences"
import { User, Folder, HardDrive } from "lucide-react"
import { FaReact, FaDocker, FaAws, FaJenkins } from "react-icons/fa"
import { SiSolidity, SiKubernetes, SiTerraform } from "react-icons/si"

import WindowManager from "@/components/desktop/window-manager"
import Dock from "@/components/desktop/dock"
import WidgetsContainer from "@/components/desktop/widgets-container"
import ContextMenu from "@/components/desktop/context-menu"

import { useWindows } from "@/hooks/use-windows"
import { useWidgets } from "@/hooks/use-widgets"
import { useNotifications } from "@/hooks/use-notifications"
import { useWallpaper } from "@/hooks/use-wallpaper"

export default function Desktop() {
  const { showNotification } = useNotifications()
  const { wallpaper, wallpaperTitle, handleSetWallpaper, resetWallpaper } = useWallpaper(showNotification)
  const { windows, openWindow, closeWindow, minimizeWindow, restoreWindow, setActiveWindow, updateWindowPosition, updateWindowSize } = useWindows()
  const { widgets, areWidgetsVisible, updateWidgetPosition, toggleWidgetVisibility, toggleAllWidgets } = useWidgets()

  const desktopRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)
  const openGalleryWindowRef = useRef<() => void>()
  const resetWallpaperRef = useRef<() => void>()
  const openTerminalWindowRef = useRef<() => void>()
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

  useEffect(() => {
    return () => { isMountedRef.current = false }
  }, [])

  // Deselect desktop icons when clicking anywhere that isn't one
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-desktop-icon]")) setSelectedIcon(null)
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [])

  // Dock behaviour: restore/focus a running app instead of spawning a duplicate
  const handleDockWindowClick = useCallback((windowId: string, openFn: () => void) => {
    const existing = windows.find((w) => w.id === windowId)
    if (existing) {
      restoreWindow(windowId) // un-minimizes and brings to front
    } else {
      openFn()
    }
  }, [windows, restoreWindow])

  const openTerminalWindow = useCallback(() => {
    openWindow(
      "terminal",
      "Terminal",
      <img src="/icons/terminal.png" alt="Terminal" className="w-4 h-4" />,
      <Terminal />,
      { x: 340, y: 90 },
    )
  }, [openWindow])

  const openAboutWindow = useCallback(() => {
    openWindow(
      "about",
      "About Me",
      <User size={16} />,
      <div className="p-8 overflow-auto h-full bg-white dark:bg-[#1e1e1e]">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
          About Me
        </h2>
        <p className="mb-6 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          I&apos;m <span className="font-semibold text-blue-600 dark:text-blue-400">Abhishek Kumar</span>, a DevOps engineer and full-stack developer with a strong foundation in modern web technologies and cloud-native infrastructure — spanning <span className="font-medium">CI/CD pipelines</span>, <span className="font-medium">infrastructure as code</span>, <span className="font-medium">GitOps</span>, and <span className="font-medium">AI-powered applications</span>.
        </p>
        <p className="mb-6 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          I&apos;m an active open-source contributor to <span className="font-medium">Open Library (Internet Archive)</span>, with two merged pull requests fixing a cross-thread race condition in FastAPI partials and modernizing core library modules.
        </p>
        <p className="mb-8 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          With a strong belief in continuous learning, clean architecture, and purposeful code, I&apos;m eager to contribute to high-impact teams driving digital transformation and technological innovation.
        </p>

        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          Skills & Tools
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-[14px]">
          <li className="flex items-center gap-2"><FaReact className="text-blue-500" /> <span className="font-medium">Full-stack Development</span> (Next.js, React, Node.js, FastAPI)</li>
          <li className="flex items-center gap-2"><FaAws className="text-orange-500" /> <span className="font-medium">Cloud Platforms</span> (AWS — EKS, EC2, S3, Lambda, IAM, KMS, VPC)</li>
          <li className="flex items-center gap-2"><FaDocker className="text-blue-400" /> <span className="font-medium">Containers & Orchestration</span> (Docker, Kubernetes, Helm, ArgoCD)</li>
          <li className="flex items-center gap-2"><FaJenkins className="text-red-500" /> <span className="font-medium">CI/CD & DevSecOps</span> (Jenkins, GitOps, SonarQube, Trivy)</li>
          <li className="flex items-center gap-2"><SiKubernetes className="text-blue-600" /> <span className="font-medium">Monitoring & Observability</span> (Prometheus, Grafana, exporters)</li>
          <li className="flex items-center gap-2"><SiTerraform className="text-purple-500" /> <span className="font-medium">Infrastructure as Code</span> (Terraform, eksctl, GitOps)</li>
          <li className="flex items-center gap-2"><SiSolidity className="text-gray-600 dark:text-gray-400" /> <span className="font-medium">AI & Agentic Systems</span> (LangChain, RAG, generative AI pipelines)</li>
        </ul>
      </div>,
    )
  }, [openWindow])

  const openProjectsWindow = useCallback(() => {
    openWindow(
      "projects",
      "Projects",
      <img src="/icons/code.png" alt="Projects" className="w-4 h-4" />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-[#1e1e1e]">
        <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-gray-100">My Projects</h2>

        <div className="space-y-4">
          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">macOS Portfolio</h3>
              <span className="text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">Latest</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Next.js 15 • React 19 • Tailwind CSS • TypeScript</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              A pixel-perfect macOS desktop simulator serving as a developer portfolio — complete with draggable windows, dock with physics-based magnification, terminal emulator, and system preferences.
            </p>
            <div className="flex gap-2">
              <a href="https://abhiyad.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white transition-colors">Live</a>
              <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">AI Music Generation SaaS</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Next.js 15 • TypeScript • FastAPI • AWS • Modal • HuggingFace • Inngest • BetterAuth</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Cloud-native SaaS generating original music from text prompts by orchestrating 3 generative AI models (ACE-Step, Qwen2-7B, SDXL-Turbo) on AWS. Cut wait time by 40% under peak load with a serverless GPU pipeline on Modal backed by Inngest async job queues and credit-based billing via BetterAuth.
            </p>
            <div className="flex gap-2">
              <a href="https://github.com/Abhishek764/ACE-step-music-gen" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">AskMedi: RAG Medical Agent</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Python • LangChain • OpenAI • Pinecone • Flask • AWS</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              RAG-powered agent that retrieves source-grounded data from a structured medical corpus to recommend medicines for diagnosed symptoms — 35% higher accuracy over a keyword-search baseline and sub-2-second latency across 500+ test queries.
            </p>
            <div className="flex gap-2">
              <a href="https://github.com/Abhishek764/AskMedi" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Retail Microservices Platform</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Terraform • AWS EKS • Kubernetes • Helm • ArgoCD • GitOps • NGINX • Docker</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Production-pattern AWS EKS platform provisioned end-to-end with Terraform — VPC across 3 AZs, EKS Auto Mode, customer-managed KMS — with a GitOps bootstrap via ArgoCD so a single terraform apply stands up a self-syncing, self-healing deployment of 5 microservices behind NGINX ingress.
            </p>
            <div className="flex gap-2">
              <a href="https://github.com/Abhishek764/Retail-Microservices-Platform" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Starbucks DevSecOps CI/CD Pipeline</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Jenkins • Docker • Kubernetes (EKS) • SonarQube • Trivy • Prometheus • Grafana</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Jenkins CI/CD pipeline gating every deployment on static analysis (SonarQube) and container vulnerability scanning (Trivy) before promotion to AWS EKS — instrumented with Prometheus/Grafana and automated security-scan email reports on every build.
            </p>
            <div className="flex gap-2">
              <a href="https://github.com/Abhishek764/starbucks-website-deployment" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Blogging Website</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Node.js • Express.js • React.js • MongoDB • JWT</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Full-featured blogging platform with JWT authentication, CRUD post management, a rich text editor, and a comments/likes system — validated end-to-end across 50 onboarded test users with Jest-based integration tests.
            </p>
            <div className="flex gap-2">
              <a href="https://blogging-website-frontend-git-main-abhishek764s-projects.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white transition-colors">Live</a>
              <a href="https://github.com/Abhishek764/blogging-website-backend" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </div>,
    )
  }, [openWindow])

  const openResumeWindow = useCallback(() => {
    const ResumeContent = () => {
      const [activeTab, setActiveTab] = useState<"fullstack" | "devops">("fullstack")
      return (
        <div className="p-6 overflow-auto h-full bg-white dark:bg-[#1e1e1e] font-sans text-sm text-gray-800 dark:text-gray-200">
          <div className="flex justify-between items-start mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Abhishek Kumar</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <a href="mailto:work.abhishek91@gmail.com" className="text-blue-500 hover:underline">work.abhishek91@gmail.com</a>
                {" • "}
                <a href="tel:+917645990776" className="text-blue-500 hover:underline">+91-7645990776</a>
              </p>
            </div>
            <div className="text-right space-y-1">
              <a href="https://www.linkedin.com/in/abhiyad-dev/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block text-sm">LinkedIn</a>
              <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block text-sm">GitHub</a>
            </div>
          </div>

          {/* Resume Tab Selector */}
          <div className="flex gap-1 mb-5 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("fullstack")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "fullstack"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              Full-Stack Resume
            </button>
            <button
              onClick={() => setActiveTab("devops")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "devops"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              DevOps Resume
            </button>
          </div>

          {activeTab === "fullstack" ? (
            <>
              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Skills</h2>
                <p className="text-sm leading-relaxed">
                  <strong>Languages:</strong> C++, JavaScript, Python, Java, Bash<br />
                  <strong>Frameworks:</strong> Next.js, React, Node.js, FastAPI, ExpressJS, Tailwind, LangChain<br />
                  <strong>Cloud:</strong> AWS (EKS, EC2, S3, Lambda, IAM, KMS, VPC)<br />
                  <strong>DevOps:</strong> Docker, Kubernetes, Helm, ArgoCD, Jenkins, GitHub Actions, Terraform<br />
                  <strong>Other:</strong> Git, MongoDB, PostgreSQL, HuggingFace, Pinecone, OpenAI
                </p>
              </section>

              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Projects</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>AI Music Generation SaaS</strong> – Next.js 15 platform orchestrating 3 generative AI models on a Modal serverless GPU pipeline; 40% lower wait time under peak load.</li>
                  <li><strong>AskMedi (RAG Medical Agent)</strong> – LangChain + OpenAI + Pinecone agent for source-grounded medicine recommendations; 35% higher accuracy than keyword baseline.</li>
                  <li><strong>Blogging Website</strong> – Full-stack blog with JWT auth, rich text editor, comments/likes; validated across 50 test users with Jest integration tests.</li>
                </ul>
              </section>

              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Open Source</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Open Library (Internet Archive)</strong> – 2 merged PRs: fixed a cross-thread race condition in FastAPI partials and modernized core library modules.</li>
                </ul>
              </section>

              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Certifications</h2>
                <ul className="list-disc pl-5 text-sm space-y-0.5">
                  <li>Cloud Computing (NPTEL, Sept–Nov 2024)</li>
                  <li>Full Stack MERN (CipherSchools, June–July 2024)</li>
                  <li>DSA Course by Abdul Bari (Udemy, Feb–May 2024)</li>
                </ul>
              </section>

              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Education</h2>
                <p className="text-sm"><strong>Lovely Professional University</strong> – B.Tech CSE (2020–2025), CGPA: 7.1</p>
                <p className="text-sm mt-1"><strong>R.K. Dwarika College</strong>, Patna – Intermediate, 69%</p>
                <p className="text-sm mt-0.5"><strong>Park Mount High School</strong>, Patna – Matriculation, 81%</p>
              </section>

              <button
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = "/resume/ABHISHEK_13_AUG_2026.pdf"
                  link.download = "Abhishek-Kumar-FullStack-Resume.pdf"
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  showNotification("Full-Stack resume download started")
                }}
                className="mt-2 inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-medium transition-colors"
              >
                ↓ Download Full-Stack Resume (PDF)
              </button>
            </>
          ) : (
            <>
              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">DevOps Skills</h2>
                <p className="text-sm leading-relaxed">
                  <strong>CI/CD:</strong> Jenkins, GitHub Actions, GitOps (ArgoCD)<br />
                  <strong>Containerization:</strong> Docker, Kubernetes (EKS), Helm<br />
                  <strong>IaC:</strong> Terraform, eksctl, CloudFormation<br />
                  <strong>Cloud:</strong> AWS (EKS, EC2, S3, Lambda, ECR, IAM, KMS, VPC, CloudWatch)<br />
                  <strong>Security:</strong> SonarQube, Trivy, IAM least-privilege, KMS encryption<br />
                  <strong>Monitoring:</strong> Prometheus, Grafana<br />
                  <strong>Scripting:</strong> Bash, Python
                </p>
              </section>

              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">DevOps Projects</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Retail Microservices Platform</strong> – Production-pattern AWS EKS platform built with Terraform (VPC across 3 AZs, EKS Auto Mode, KMS) and GitOps bootstrap via ArgoCD; one terraform apply stands up a self-syncing deployment of 5 microservices behind NGINX ingress.</li>
                  <li><strong>Starbucks DevSecOps Pipeline</strong> – Jenkins pipeline gating deploys on SonarQube static analysis and Trivy vulnerability scans before promotion to AWS EKS, with Prometheus/Grafana observability and automated security email reports.</li>
                  <li><strong>AI Music Generation SaaS (Infra)</strong> – AWS deployment of a 3-model generative pipeline using Modal serverless GPUs, Inngest async job queues, and credit-based billing.</li>
                </ul>
              </section>

              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Certifications</h2>
                <ul className="list-disc pl-5 text-sm space-y-0.5">
                  <li>Cloud Computing (NPTEL, Sept–Nov 2024)</li>
                  <li>Full Stack MERN (CipherSchools, June–July 2024)</li>
                  <li>DSA Course by Abdul Bari (Udemy, Feb–May 2024)</li>
                </ul>
              </section>

              <section className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Education</h2>
                <p className="text-sm"><strong>Lovely Professional University</strong> – B.Tech CSE (2020–2025), CGPA: 7.1</p>
              </section>

              <button
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = "/resume/abhishek_devops_sept_18.pdf"
                  link.download = "Abhishek-Kumar-DevOps-Resume.pdf"
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  showNotification("DevOps resume download started")
                }}
                className="mt-2 inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-medium transition-colors"
              >
                ↓ Download DevOps Resume (PDF)
              </button>
            </>
          )}
        </div>
      )
    }

    openWindow(
      "resume",
      "Resume",
      <img src="/icons/documents.png" alt="Resume" className="w-4 h-4" />,
      <ResumeContent />,
      { x: 100, y: 50 },
      { width: 800, height: 600 },
    )
  }, [openWindow, showNotification])

  const openContactWindow = useCallback(() => {
    openWindow(
      "contact",
      "Contact",
      <img src="/icons/mail.png" alt="Contact" className="w-4 h-4" />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-[#1e1e1e] font-sans text-gray-800 dark:text-gray-200">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">Let&apos;s Connect</h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Whether you&apos;re looking to collaborate on a project, have an opportunity, or just want to say hello — feel free to reach out!
        </p>
        <div className="space-y-4 text-sm">
          <a href="tel:+917645990776" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">📞</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Phone</p>
              <p className="text-blue-500">+91-7645990776</p>
            </div>
          </a>
          <a href="mailto:work.abhishek91@gmail.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">✉️</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
              <p className="text-blue-500">work.abhishek91@gmail.com</p>
            </div>
          </a>
          <a href="https://www.linkedin.com/in/abhiyad-dev/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">💼</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">LinkedIn</p>
              <p className="text-blue-500">linkedin.com/in/abhiyad-dev</p>
            </div>
          </a>
          <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">🐙</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">GitHub</p>
              <p className="text-blue-500">github.com/Abhishek764</p>
            </div>
          </a>
        </div>
      </div>,
    )
  }, [openWindow])

  const openGalleryWindow = useCallback(() => {
    openWindow(
      "gallery",
      "Photos",
      <img src="/icons/photos.png" alt="Photos" className="w-4 h-4" />,
      <PhotoGallery onSetWallpaper={handleSetWallpaper} />,
      { x: 80, y: 60 },
      { width: 900, height: 600 },
    )
  }, [openWindow, handleSetWallpaper])

  const openCertificationsWindow = useCallback(() => {
    openWindow(
      "certifications",
      "Certifications",
      <img src="/icons/certificate.png" alt="Certifications" className="w-4 h-4" />,
      <Certifications />,
      { x: 150, y: 100 },
      { width: 900, height: 600 },
    )
  }, [openWindow])

  const openWallpaperSettingsWindow = useCallback(() => {
    openWindow(
      "wallpaper-settings",
      "System Preferences",
      <img src="/icons/settings.png" alt="System Preferences" className="w-4 h-4" />,
      <SystemPreferences
        wallpaper={wallpaper}
        wallpaperTitle={wallpaperTitle}
        onOpenGallery={openGalleryWindow}
        onResetWallpaper={resetWallpaper}
      />,
      { x: 100, y: 60 },
      { width: 720, height: 500 },
    )
  }, [openWindow, wallpaper, wallpaperTitle, openGalleryWindow, resetWallpaper])

  const openLinkedInProfile = useCallback(() => {
    window.open("https://www.linkedin.com/in/abhiyad-dev/", "_blank", "noopener,noreferrer")
  }, [])

  const openGitHubProfile = useCallback(() => {
    window.open("https://github.com/Abhishek764", "_blank", "noopener,noreferrer")
  }, [])

  const openLeetCodeProfile = useCallback(() => {
    window.open("https://leetcode.com/u/user2044wT/", "_blank", "noopener,noreferrer")
  }, [])

  // Event listeners for terminal commands
  useEffect(() => {
    const handleOpenGallery = () => openGalleryWindowRef.current?.()
    const handleResetWallpaper = () => resetWallpaperRef.current?.()

    document.addEventListener("openGallery", handleOpenGallery)
    document.addEventListener("resetWallpaper", handleResetWallpaper)

    return () => {
      document.removeEventListener("openGallery", handleOpenGallery)
      document.removeEventListener("resetWallpaper", handleResetWallpaper)
    }
  }, [])

  useEffect(() => { openGalleryWindowRef.current = openGalleryWindow }, [openGalleryWindow])
  useEffect(() => { resetWallpaperRef.current = resetWallpaper }, [resetWallpaper])
  useEffect(() => { openTerminalWindowRef.current = openTerminalWindow }, [openTerminalWindow])

  // Open terminal after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        openTerminalWindowRef.current?.()
      }
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-black text-gray-900 dark:text-white relative"
      ref={desktopRef}
    >
      {/* Wallpaper — fills the entire screen, including behind the menu bar */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: wallpaper ? `url(${wallpaper})` : "url(/wallpapers/sequoia-twilight.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Menu bar — translucent overlay floating on the wallpaper */}
      <MenuBar onToggleWidgets={toggleAllWidgets} areWidgetsVisible={areWidgetsVisible} />

      {/* Desktop area (windows, widgets, icons) — below the menu bar */}
      <div className="absolute inset-x-0 top-[26px] bottom-0 overflow-hidden">
        {/* Desktop icons */}
        <div className="absolute top-3 right-3 z-[5] flex flex-col items-center gap-5 select-none pointer-events-none">
          <button
            data-desktop-icon
            className={`pointer-events-auto flex flex-col items-center gap-1 p-1 rounded-md ${selectedIcon === "macintosh-hd" ? "bg-blue-500/40" : ""}`}
            onClick={() => setSelectedIcon("macintosh-hd")}
            onDoubleClick={openAboutWindow}
          >
            <HardDrive size={42} strokeWidth={1.2} className="text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
            <span className="text-[11px] text-white font-medium px-1 rounded desktop-icon-label">Macintosh HD</span>
          </button>
          <button
            data-desktop-icon
            className={`pointer-events-auto flex flex-col items-center gap-1 p-1 rounded-md ${selectedIcon === "projects-folder" ? "bg-blue-500/40" : ""}`}
            onClick={() => setSelectedIcon("projects-folder")}
            onDoubleClick={openProjectsWindow}
          >
            <Folder size={42} strokeWidth={1.2} fill="#63b3f7" className="text-[#3d8fd1] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
            <span className="text-[11px] text-white font-medium px-1 rounded desktop-icon-label">Projects</span>
          </button>
          <button
            data-desktop-icon
            className={`pointer-events-auto flex flex-col items-center gap-1 p-1 rounded-md ${selectedIcon === "resume-pdf" ? "bg-blue-500/40" : ""}`}
            onClick={() => setSelectedIcon("resume-pdf")}
            onDoubleClick={openResumeWindow}
          >
            <img src="/icons/documents.png" alt="Resume.pdf" className="w-[42px] h-[42px] object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" draggable={false} />
            <span className="text-[11px] text-white font-medium px-1 rounded desktop-icon-label">Resume.pdf</span>
          </button>
        </div>

        {/* Widgets */}
        <WidgetsContainer
          widgets={widgets}
          areWidgetsVisible={areWidgetsVisible}
          updateWidgetPosition={updateWidgetPosition}
          toggleWidgetVisibility={toggleWidgetVisibility}
          desktopRef={desktopRef}
        />

        {/* Desktop context menu */}
        <ContextMenu
          openTerminalWindow={openTerminalWindow}
          toggleAllWidgets={toggleAllWidgets}
          openWallpaperSettingsWindow={openWallpaperSettingsWindow}
          resetWallpaper={resetWallpaper}
          areWidgetsVisible={areWidgetsVisible}
          wallpaper={wallpaper}
        />

        {/* Windows */}
        <WindowManager
          windows={windows}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={setActiveWindow}
          onDrag={updateWindowPosition}
          onResize={updateWindowSize}
        />
      </div>

      {/* macOS style dock */}
      <Dock
        windows={windows}
        openAboutWindow={openAboutWindow}
        openProjectsWindow={openProjectsWindow}
        openResumeWindow={openResumeWindow}
        openContactWindow={openContactWindow}
        openGalleryWindow={openGalleryWindow}
        openCertificationsWindow={openCertificationsWindow}
        openTerminalWindow={openTerminalWindow}
        openWallpaperSettingsWindow={openWallpaperSettingsWindow}
        openLinkedInProfile={openLinkedInProfile}
        openGitHubProfile={openGitHubProfile}
        openLeetCodeProfile={openLeetCodeProfile}
        onDockWindowClick={handleDockWindowClick}
      />
    </div>
  )
}
