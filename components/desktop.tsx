"use client"

import { useEffect, useRef, useCallback } from "react"
import MenuBar from "@/components/menu-bar"
import Terminal from "@/components/terminal"
import PhotoGallery from "@/components/photo-gallery"
import Certifications from "@/components/certifications"
import SystemPreferences from "@/components/system-preferences"
import { User } from "lucide-react"
import { FaReact, FaDocker, FaAws } from "react-icons/fa"
import { SiSolidity } from "react-icons/si"

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
  const { windows, openWindow, closeWindow, setActiveWindow, updateWindowPosition, updateWindowSize } = useWindows()
  const { widgets, areWidgetsVisible, updateWidgetPosition, toggleWidgetVisibility, toggleAllWidgets } = useWidgets()

  const desktopRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)
  const openGalleryWindowRef = useRef<() => void>()
  const resetWallpaperRef = useRef<() => void>()
  const openTerminalWindowRef = useRef<() => void>()

  useEffect(() => {
    return () => { isMountedRef.current = false }
  }, [])

  const openTerminalWindow = useCallback(() => {
    openWindow(
      "terminal",
      "Terminal",
      <img src="/icons/terminal.png" alt="Terminal" className="w-4 h-4" />,
      <Terminal />,
      { x: 100, y: 80 },
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
          I&apos;m <span className="font-semibold text-blue-600 dark:text-blue-400">Abhishek</span>, a passionate and forward-thinking full-stack developer, with a strong foundation in modern web technologies and an expanding skill set that includes <span className="font-medium">DevOps practices</span>, <span className="font-medium">blockchain integration</span>, and emerging <span className="font-medium">agentic AI systems</span>.
        </p>
        <p className="mb-6 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          My approach to software development is both holistic and innovation-driven—focusing on building scalable, secure, and high-performance applications aligned with evolving industry standards.
        </p>
        <p className="mb-8 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          With a strong belief in continuous learning, clean architecture, and purposeful code, I&apos;m eager to contribute to high-impact teams driving digital transformation and technological innovation.
        </p>

        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          Skills & Tools
        </h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-[14px]">
          <li className="flex items-center gap-2"><FaReact className="text-blue-500" /> <span className="font-medium">Full-stack Development</span> (MERN Stack)</li>
          <li className="flex items-center gap-2"><FaAws className="text-orange-500" /> <span className="font-medium">Cloud Platforms</span> (AWS)</li>
          <li className="flex items-center gap-2"><FaDocker className="text-blue-400" /> <span className="font-medium">DevOps & Containerization</span> (Docker, Kubernetes)</li>
          <li className="flex items-center gap-2"><SiSolidity className="text-gray-600 dark:text-gray-400" /> <span className="font-medium">Blockchain Development</span> (Solidity, Smart Contracts)</li>
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">BlockBox</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">React • Solidity • Hardhat • IPFS</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              A blockchain-based platform for secure and decentralized photo sharing with smart contracts for secure data transactions and ownership.
            </p>
            <div className="flex gap-2">
              <a href="#" className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white transition-colors">Demo</a>
              <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">TaskSphere</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">React • Node.js • MongoDB • Docker • Kubernetes • AWS</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              A highly scalable To-Do List application using a three-tier architecture with containerized services deployed on AWS EKS.
            </p>
            <div className="flex gap-2">
              <a href="#" className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white transition-colors">Demo</a>
              <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Blogging Platform</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">MERN Stack • JWT Authentication</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              A full-featured blogging platform with user authentication, rich text editor, and personalized dashboard for tracking posts and interactions.
            </p>
            <div className="flex gap-2">
              <a href="https://blogging-website-frontend-git-main-abhishek764s-projects.vercel.app/" className="text-xs bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white transition-colors">Demo</a>
              <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </div>,
    )
  }, [openWindow])

  const openResumeWindow = useCallback(() => {
    openWindow(
      "resume",
      "Resume",
      <img src="/icons/documents.png" alt="Resume" className="w-4 h-4" />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-[#1e1e1e] font-sans text-sm text-gray-800 dark:text-gray-200">
        <div className="flex justify-between items-start mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Abhishek Kumar</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <a href="mailto:abhishek.sphs01@gmail.com" className="text-blue-500 hover:underline">abhishek.sphs01@gmail.com</a>
              {" • "}
              <a href="tel:+917645990776" className="text-blue-500 hover:underline">+91-7645990776</a>
            </p>
          </div>
          <div className="text-right space-y-1">
            <a href="https://www.linkedin.com/in/abhishek-kumar-831056237/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block text-sm">LinkedIn</a>
            <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block text-sm">GitHub</a>
            <button
              onClick={() => {
                const link = document.createElement("a")
                link.href = "/resume/abhishek.pdf"
                link.download = "Abhishek-Kumar-Resume.pdf"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                showNotification("Resume download started")
              }}
              className="mt-2 inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            >
              ↓ Download PDF
            </button>
          </div>
        </div>

        <section className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Skills</h2>
          <p className="text-sm leading-relaxed">
            <strong>Languages:</strong> C++, JavaScript, Python, Java, Solidity, Bash<br />
            <strong>Frameworks:</strong> NodeJS, React, ExpressJS, Tailwind, Three.js, LangChain<br />
            <strong>Cloud:</strong> AWS (EC2, S3, Lambda, BedRock...)<br />
            <strong>DevOps:</strong> Jenkins, GitHub Actions, Docker, Kubernetes, Terraform, Ansible<br />
            <strong>Other:</strong> Git, Figma, Prometheus, Grafana
          </p>
        </section>

        <section className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Projects</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>BlockBox</strong> – Blockchain-based photo sharing platform with smart contracts and IPFS.</li>
            <li><strong>TaskSphere</strong> – Kubernetes-powered To-Do app using MERN stack and AWS EKS with CI/CD.</li>
            <li><strong>Blogging Platform</strong> – Full-stack blog with JWT auth, rich editor, and user dashboard.</li>
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

        <section>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Education</h2>
          <p className="text-sm"><strong>Lovely Professional University</strong> – B.Tech CSE (2020–2025), CGPA: 6.58</p>
          <p className="text-sm mt-1"><strong>R.K. Dwarika College</strong>, Patna – Intermediate, 69%</p>
          <p className="text-sm mt-0.5"><strong>Park Mount High School</strong>, Patna – Matriculation, 81%</p>
        </section>
      </div>,
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
          <a href="mailto:abhishek.sphs01@gmail.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">✉️</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
              <p className="text-blue-500">abhishek.sphs01@gmail.com</p>
            </div>
          </a>
          <a href="https://www.linkedin.com/in/abhishek-kumar-831056237/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">💼</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">LinkedIn</p>
              <p className="text-blue-500">linkedin.com/in/abhishek-kumar</p>
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
    window.open("https://www.linkedin.com/in/abhishek-kumar-831056237/", "_blank", "noopener,noreferrer")
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
      className="h-screen w-screen overflow-hidden bg-black text-gray-900 dark:text-white flex flex-col"
      ref={desktopRef}
    >
      {/* Menu bar */}
      <MenuBar onToggleWidgets={toggleAllWidgets} areWidgetsVisible={areWidgetsVisible} />

      {/* Desktop area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: wallpaper ? `url(${wallpaper})` : "url(/wallpapers/default-wallpaper.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
      />
    </div>
  )
}
