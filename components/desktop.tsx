"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import MenuBar from "@/components/menu-bar"
import Terminal from "@/components/terminal"
import PhotoGallery from "@/components/photo-gallery"
import Certifications from "@/components/certifications"
import { User, RefreshCw } from "lucide-react"

// Import new modular components
import WindowManager from "@/components/desktop/window-manager"
import Dock from "@/components/desktop/dock"
import WidgetsContainer from "@/components/desktop/widgets-container"
import ContextMenu from "@/components/desktop/context-menu"

// Import custom hooks
import { useWindows } from "@/hooks/use-windows"
import { useWidgets } from "@/hooks/use-widgets"
import { useNotifications } from "@/hooks/use-notifications"
import { useWallpaper } from "@/hooks/use-wallpaper"

/**
 * Main Desktop component that serves as the container for the entire application
 * Manages windows, widgets, wallpaper, and user interactions
 */
export default function Desktop() {
  // Use custom hooks for state management
  const { showNotification } = useNotifications()
  const { wallpaper, wallpaperTitle, handleSetWallpaper, resetWallpaper } = useWallpaper(showNotification)
  const { windows, openWindow, closeWindow, setActiveWindow, updateWindowPosition, updateWindowSize } = useWindows()
  const { widgets, areWidgetsVisible, updateWidgetPosition, toggleWidgetVisibility, toggleAllWidgets } = useWidgets()

  // State for boot animation
  const [bootComplete, setBootComplete] = useState(false)

  // Reference to the desktop element for positioning
  const desktopRef = useRef<HTMLDivElement>(null)

  // Track if component is mounted
  const isMountedRef = useRef(true)

  // Refs for event handlers
  const openGalleryWindowRef = useRef<() => void>()
  const resetWallpaperRef = useRef<() => void>()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  /**
   * Opens the Terminal window
   */
  const openTerminalWindow = useCallback(() => {
    openWindow(
      "terminal",
      "Terminal",
      <img src="/icons/terminal.png" alt="Terminal" className="w-4 h-4" />,
      <Terminal />,
      { x: 100, y: 80 },
    )
  }, [openWindow])

  /**
   * Opens the About window
   */
  const openAboutWindow = useCallback(() => {
    openWindow(
      "about",
      "About Me",
      <User size={16} />,
      <div className="p-8 overflow-auto h-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg">
  <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
    About Me
  </h2>
  <p className="mb-6 text-lg leading-relaxed text-gray-800 dark:text-gray-300">
    I’m <span className="font-semibold text-blue-600 dark:text-blue-400">Abhishek</span>, a passionate and forward-thinking full-stack developer in training, with a strong foundation in modern web technologies and an expanding skill set that includes <span className="font-medium">DevOps practices</span>, <span className="font-medium">blockchain integration</span>, and emerging <span className="font-medium">agentic AI systems</span>.
    <br /><br />
    My approach to software development is both holistic and innovation-driven—focusing on building scalable, secure, and high-performance applications aligned with evolving industry standards. I’m currently sharpening my expertise in full-stack frameworks, containerization, CI/CD pipelines, and smart contract development, while exploring the convergence of automation and intelligence in software systems.
    <br /><br />
    With a strong belief in continuous learning, clean architecture, and purposeful code, I’m eager to contribute to high-impact teams driving digital transformation and technological innovation.
  </p>

  <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-300 dark:border-gray-700">
    Skills & Tools
  </h3>
  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-base">
    <li><span className="font-medium">Full-stack Development</span> (MERN Stack)</li>
    <li><span className="font-medium">Cloud Platforms</span> (AWS)</li>
    <li><span className="font-medium">DevOps & Containerization</span> (Docker, Kubernetes)</li>
    <li><span className="font-medium">Blockchain Development</span> (Solidity, Smart Contracts)</li>
  </ul>
</div>

    )
  }, [openWindow])

  /**
   * Opens the Projects window
   */
  const openProjectsWindow = useCallback(() => {
    openWindow(
      "projects",
      "Projects",
      <img src="/icons/code.png" alt="Projects" className="w-4 h-4" />,
      <div className="p-6 overflow-auto h-full bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">My Projects</h2>

        <div className="mb-6 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">BlockBox</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-2">React • Solidity • Hardhat • IPFS</p>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            A blockchain-based platform for secure and decentralized photo sharing with smart contracts for secure data
            transactions and ownership.
          </p>
          <div className="flex gap-2">
            <a href="#" className="text-sm bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white">
              Demo
            </a>
            <a
              href="https://github.com/Abhishek764"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mb-6 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">TaskSphere</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-2">React • Node.js • MongoDB • Docker • Kubernetes • AWS</p>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            A highly scalable To-Do List application using a three-tier architecture with containerized services
            deployed on AWS EKS.
          </p>
          <div className="flex gap-2">
            <a href="#" className="text-sm bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white">
              Demo
            </a>
            <a
              href="https://github.com/Abhishek764"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">Blogging Platform</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-2">MERN Stack • JWT Authentication</p>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            A full-featured blogging platform with user authentication, rich text editor, and personalized dashboard for
            tracking posts and interactions.
          </p>
          <div className="flex gap-2">
            <a href="#" className="text-sm bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-white">
              Demo
            </a>
            <a
              href="https://github.com/Abhishek764"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded-md text-gray-800 dark:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>,
    )
  }, [openWindow])

/**
 * Opens the Resume window
 */

const openResumeWindow = useCallback(() => {
  openWindow(
    "resume",
    "Resume",
    <img src="/icons/documents.png" alt="Resume" className="w-4 h-4" />,
    <div className="p-6 overflow-auto h-full bg-white dark:bg-gray-900 font-sans text-sm text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-start mb-4 border-b pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Abhishek Kumar</h1>
          <p>
            <a href="mailto:abhishek.sphs01@gmail.com" className="text-blue-500 hover:underline">
              abhishek.sphs01@gmail.com
            </a>{" "}
            •{" "}
            <a href="tel:+917645990776" className="text-blue-500 hover:underline">
              +91-7645990776
            </a>
          </p>
        </div>
        <div className="text-right space-y-1">
          <a
            href="https://www.linkedin.com/in/abhishek-kumar-831056237/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Abhishek764"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block"
          >
            GitHub
          </a>
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = "/resume/abhishek.pdf";
              link.download = "Abhishek-Kumar-Resume.pdf";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showNotification("Resume download started");
            }}
            className="mt-2 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* SKILLS */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Skills</h2>
        <p>
          <strong>Languages:</strong> C++, JavaScript, Python, Java, Solidity, Bash<br />
          <strong>Frameworks:</strong> NodeJS, React, ExpressJS, Tailwind, Three.js, LangChain<br />
          <strong>Cloud:</strong> AWS (EC2, S3, Lambda, BedRock...)<br />
          <strong>DevOps:</strong> Jenkins, GitHub Actions, Docker, Kubernetes, Terraform, Ansible<br />
          <strong>Other:</strong> Git, Figma, Prometheus, Grafana
        </p>
      </section>

      {/* PROJECTS */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>BlockBox</strong> – Blockchain-based photo sharing platform with smart contracts and IPFS.
          </li>
          <li>
            <strong>TaskSphere</strong> – Kubernetes-powered To-Do app using MERN stack and AWS EKS with CI/CD.
          </li>
          <li>
            <strong>Blogging Platform</strong> – Full-stack blog with JWT auth, rich editor, and user dashboard.
          </li>
        </ul>
      </section>

      {/* CERTIFICATIONS */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Certifications</h2>
        <ul className="list-disc pl-5">
          <li>Cloud Computing (NPTEL, Sept–Nov 2024)</li>
          <li>Full Stack MERN (CipherSchools, June–July 2024)</li>
          <li>DSA Course by Abdul Bari (Udemy, Feb–May 2024)</li>
        </ul>
      </section>

      {/* EDUCATION */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education</h2>
        <p>
          <strong>Lovely Professional University</strong><br />
          B.Tech CSE (2020–2025), CGPA: 6.58
        </p>
        <p className="mt-2">
          <strong>R.K. Dwarika College</strong>, Patna – Intermediate, 69%
        </p>
        <p className="mt-1">
          <strong>Park Mount High School</strong>, Patna – Matriculation, 81%
        </p>
      </section>
    </div>,
    { x: 100, y: 50 },
    { width: 800, height: 600 }
  );
}, [openWindow, showNotification]);



/**
 * Opens the Resume window
 */
/**
 * Opens the contact window
 */
const openContactWindow = useCallback(() => {
  openWindow(
    "contact",
    "Contact",
    <img src="/icons/mail.png" alt="Contact" className="w-4 h-4" />,
    <div className="p-6 overflow-auto h-full bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Let's Connect</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Whether you’re looking to collaborate on a project, have an opportunity, or just want to say hello —
        feel free to reach out!
      </p>

      <div className="space-y-4 text-sm">
        {/* Phone */}
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
            viewBox="0 0 24 24"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <a href="tel:+917645990776" className="text-blue-500 hover:underline">+91-7645990776</a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
            viewBox="0 0 24 24"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <a href="mailto:abhishek.sphs01@gmail.com" className="text-blue-500 hover:underline">abhishek.sphs01@gmail.com</a>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
            viewBox="0 0 24 24"
          >
            <path d="M16 8a6 6 0 0 1 6 6v5h-4v-5a2 2 0 0 0-4 0v5h-4v-9h4v1.5"/>
            <rect x="2" y="9" width="4" height="12"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          <a
            href="https://www.linkedin.com/in/abhishek-kumar-831056237/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            linkedin.com/in/abhishek-kumar-831056237
          </a>
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.89 1.56 2.34 1.11 2.91.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.38-2.03 1.01-2.75-.1-.26-.44-1.3.1-2.72 0 0 .83-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.87c.84.01 1.69.11 2.49.33 1.91-1.29 2.74-1.02 2.74-1.02.55 1.42.21 2.46.1 2.72.63.72 1 1.63 1 2.75 0 3.92-2.35 4.78-4.59 5.03.36.32.68.94.68 1.89 0 1.36-.01 2.45-.01 2.78 0 .27.18.59.69.48A10.3 10.3 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>
          </svg>
          <a
            href="https://github.com/Abhishek764"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            github.com/Abhishek764
          </a>
        </div>
      </div>
    </div>
  );
}, [openWindow]);


/**
 * end the contact window
 */


  /**
   * Opens the Photo Gallery window
   */
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

  /**
   * Opens the Certifications window
   */
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

  /**
   * Opens the Wallpaper Settings window
   */
  const openWallpaperSettingsWindow = useCallback(() => {
    openWindow(
      "wallpaper-settings",
      "Wallpaper Settings",
      <img src="/icons/settings.png" alt="Settings" className="w-4 h-4" />,
      <div className="p-6 bg-white dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Wallpaper Settings</h2>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Current Wallpaper</h3>
          {wallpaper ? (
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">Title: {wallpaperTitle || "Custom Wallpaper"}</p>
              <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                <img
                  src={wallpaper || "/placeholder.svg"}
                  alt="Current Wallpaper"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">Using default gradient wallpaper</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={openGalleryWindow}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <img src="/icons/photos.png" alt="Photos" className="w-4 h-4" />
            Choose from Photos
          </button>

          {wallpaper && (
            <button
              onClick={resetWallpaper}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              <RefreshCw size={16} />
              Reset to Default
            </button>
          )}
        </div>
      </div>,
      { x: 120, y: 120 },
      { width: 500, height: 400 },
    )
  }, [openWindow, wallpaper, wallpaperTitle, openGalleryWindow, resetWallpaper])

  /**
   * Opens the LinkedIn profile in a new tab
   */
  const openLinkedInProfile = useCallback(() => {
    window.open("https://www.linkedin.com/in/abhishek-kumar-831056237/", "_blank", "noopener,noreferrer")
    showNotification("Opening LinkedIn profile in a new tab")
  }, [showNotification])

  /**
   * Opens the GitHub profile in a new tab
   */
  const openGitHubProfile = useCallback(() => {
    window.open("https://github.com/Abhishek764", "_blank", "noopener,noreferrer")
    showNotification("Opening GitHub profile in a new tab")
  }, [showNotification])

  /**
   * Opens the LeetCode profile in a new tab
   */
  const openLeetCodeProfile = useCallback(() => {
    window.open("https://leetcode.com/u/user2044wT/", "_blank", "noopener,noreferrer")
    showNotification("Opening LeetCode profile in a new tab")
  }, [showNotification])

  // Set up event listeners for terminal commands
  useEffect(() => {
    const handleOpenGallery = () => {
      if (openGalleryWindowRef.current) {
        openGalleryWindowRef.current()
      }
    }

    const handleResetWallpaper = () => {
      if (resetWallpaperRef.current) {
        resetWallpaperRef.current()
      }
    }

    document.addEventListener("openGallery", handleOpenGallery)
    document.addEventListener("resetWallpaper", handleResetWallpaper)

    return () => {
      document.removeEventListener("openGallery", handleOpenGallery)
      document.removeEventListener("resetWallpaper", handleResetWallpaper)
    }
  }, [])

  // Update the refs when the functions change
  useEffect(() => {
    openGalleryWindowRef.current = openGalleryWindow
  }, [openGalleryWindow])

  useEffect(() => {
    resetWallpaperRef.current = resetWallpaper
  }, [resetWallpaper])

  // Simulate boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setBootComplete(true)
        // Open terminal by default
        openTerminalWindow()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [openTerminalWindow])

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col"
      ref={desktopRef}
    >
      {/* Menu bar */}
      <MenuBar onToggleWidgets={toggleAllWidgets} areWidgetsVisible={areWidgetsVisible} />

      {/* Desktop area */}
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: wallpaper ? `url(${wallpaper})` : "linear-gradient(120deg, #f0f0f0, #2d3748)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease-in-out",
        }}
      >
        {/* Overlay for better readability with any wallpaper */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/40 pointer-events-none"></div>

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
