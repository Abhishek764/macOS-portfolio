"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface CommandHistory {
  command: string
  output: React.ReactNode
}

/**
 * Terminal component that emulates macOS Terminal.app
 * Supports various commands and provides a realistic terminal experience
 */
export default function Terminal() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Display welcome message on mount
    setHistory([
      {
        command: "",
        output: (
          <div className="text-green-500">
            <div className="flex justify-center mb-4">
              <img src="/icons/terminal.png" alt="Terminal" className="w-16 h-16" />
            </div>
            <pre className="font-mono text-xs sm:text-sm whitespace-pre overflow-x-auto">
              {`
___  ___   ___  ___   ___          _    __      _ _       
|  \\/  | | / _ \\ / __| | _ \\___  _ _| |_ / _|___ | (_)___   
| |\\/| | |/ (_) |\\__ \\ |  _/ _ \\| '_|  _|  _/ _ \\| | / _ \\  
|_|  |_|_|\\___/ |___/ |_| \\___/|_|  \\__|_| \\___/|_|_\\___/  
                                                          
`}
            </pre>
            <p className="mb-2">
              Welcome to macOS Portfolio! Type <span className="text-yellow-500">help</span> to see available commands.
            </p>
            <p className="text-xs text-gray-400">System: macOS Portfolio v1.0.0 | Kernel: Next.js 14.0.0</p>
          </div>
        ),
      },
    ])

    // Focus input on mount
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // Scroll to bottom when history changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  /**
   * Handles form submission when a command is entered
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    const command = input.trim().toLowerCase()
    let output: React.ReactNode

    // Add command to history
    setCommandHistory((prev) => [command, ...prev.slice(0, 19)]) // Keep last 20 commands
    setHistoryIndex(-1)

    // Process commands
    switch (command) {
      case "help":
        output = (
          <div className="space-y-1">
            <p>Available commands:</p>
            <p>
              <span className="text-yellow-500">about</span> - Display information about me
            </p>
            <p>
              <span className="text-yellow-500">projects</span> - List my projects
            </p>
            <p>
              <span className="text-yellow-500">skills</span> - Show my technical skills
            </p>
            <p>
              <span className="text-yellow-500">contact</span> - Display contact information
            </p>
            <p>
              <span className="text-yellow-500">certifications</span> - View my certifications
            </p>
            <p>
              <span className="text-yellow-500">gallery</span> - Open photo gallery
            </p>
            <p>
              <span className="text-yellow-500">wallpaper</span> - Open wallpaper settings
            </p>
            <p>
              <span className="text-yellow-500">default-wallpaper</span> - Reset to default wallpaper
            </p>
            <p>
              <span className="text-yellow-500">clear</span> - Clear the terminal
            </p>
            <p>
              <span className="text-yellow-500">neofetch</span> - Display system information
            </p>
            <p>
              <span className="text-yellow-500">ls</span> - List directory contents
            </p>
            <p>
              <span className="text-yellow-500">pwd</span> - Print working directory
            </p>
            <p>
              <span className="text-yellow-500">date</span> - Display current date and time
            </p>
            <p>
              <span className="text-yellow-500">echo [text]</span> - Display a line of text
            </p>
          </div>
        )
        break

      case "about":
        output = (
          <div className="space-y-2">
            <p className="text-green-500 font-bold">About Me — Abhishek Kumar</p>
            <p>Full-stack developer with expertise in MERN stack, DevOps, blockchain, and agentic AI systems.</p>
            <p>Building scalable, secure, and high-performance applications aligned with evolving industry standards.</p>
            <p>Skills: React, Node.js, Docker, Kubernetes, AWS, Solidity, LangChain, Terraform</p>
            <p>Education: B.Tech CSE, Lovely Professional University (2020–2025)</p>
          </div>
        )
        break

      case "projects":
        output = (
          <div className="space-y-2">
            <p className="text-green-500 font-bold">My Projects</p>
            <div>
              <p className="text-blue-500">BlockBox</p>
              <p className="text-xs text-gray-400">React • Solidity • Hardhat • IPFS</p>
              <p className="text-sm">Blockchain-based platform for secure and decentralized photo sharing with smart contracts.</p>
            </div>
            <div>
              <p className="text-blue-500">TaskSphere</p>
              <p className="text-xs text-gray-400">React • Node.js • MongoDB • Docker • Kubernetes • AWS</p>
              <p className="text-sm">Highly scalable To-Do app using three-tier architecture deployed on AWS EKS.</p>
            </div>
            <div>
              <p className="text-blue-500">Blogging Platform</p>
              <p className="text-xs text-gray-400">MERN Stack • JWT Authentication</p>
              <p className="text-sm">Full-featured blogging platform with auth, rich text editor, and dashboard.</p>
            </div>
          </div>
        )
        break

      case "skills":
        output = (
          <div className="space-y-2">
            <p className="text-green-500 font-bold">Technical Skills</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <p className="text-blue-500">Languages</p>
                <p>JavaScript, TypeScript, HTML, CSS, Python</p>
              </div>
              <div>
                <p className="text-blue-500">Frameworks</p>
                <p>React, Next.js, Express, Vue</p>
              </div>
              <div>
                <p className="text-blue-500">Tools</p>
                <p>Git, Docker, Webpack, Jest</p>
              </div>
              <div>
                <p className="text-blue-500">Databases</p>
                <p>MongoDB, PostgreSQL, Firebase</p>
              </div>
            </div>
          </div>
        )
        break

      case "contact":
        output = (
          <div className="space-y-2">
            <p className="text-green-500 font-bold">Contact Information</p>
            <p>Email: <a href="mailto:abhishek.sphs01@gmail.com" className="text-blue-500 underline">abhishek.sphs01@gmail.com</a></p>
            <p>Phone: <a href="tel:+917645990776" className="text-blue-500 underline">+91-7645990776</a></p>
            <p>GitHub: <a href="https://github.com/Abhishek764" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">github.com/Abhishek764</a></p>
            <p>LinkedIn: <a href="https://www.linkedin.com/in/abhishek-kumar-831056237/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">linkedin.com/in/abhishek-kumar</a></p>
            <p>LeetCode: <a href="https://leetcode.com/u/user2044wT/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">leetcode.com/u/user2044wT</a></p>
          </div>
        )
        break

      case "certifications":
        output = (
          <div className="space-y-2">
            <p className="text-green-500 font-bold">My Certifications</p>
            <div>
              <p className="text-blue-500">Cloud Computing</p>
              <p className="text-xs text-gray-400">NPTEL • Sept–Nov 2024</p>
            </div>
            <div>
              <p className="text-blue-500">Full Stack Development using MERN</p>
              <p className="text-xs text-gray-400">CipherSchools • June–July 2024</p>
            </div>
            <div>
              <p className="text-blue-500">Data Structures And Algorithms</p>
              <p className="text-xs text-gray-400">Udemy (Abdul Bari) • Feb–May 2024</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Type <span className="text-yellow-500">open certifications</span> to view in the Certifications app.
            </p>
          </div>
        )
        break

      case "open certifications":
        output = (
          <div className="space-y-2">
            <p className="text-green-500">Opening certifications...</p>
            <p className="text-xs text-gray-400">Tip: You can also click the Certifications icon in the dock.</p>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                 // This is a hack to communicate with the parent component
                 // In a real app, you'd use a proper state management solution
                 setTimeout(() => {
                   const event = new CustomEvent('openCertifications');
                   document.dispatchEvent(event);
                 }, 500);
               `,
              }}
            />
          </div>
        )
        break

      case "gallery":
        output = (
          <div className="space-y-2">
            <p className="text-green-500">Opening photo gallery...</p>
            <p className="text-xs text-gray-400">Tip: You can also click the Photos icon in the dock.</p>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                 // This is a hack to communicate with the parent component
                 // In a real app, you'd use a proper state management solution
                 setTimeout(() => {
                   const event = new CustomEvent('openGallery');
                   document.dispatchEvent(event);
                 }, 500);
               `,
              }}
            />
          </div>
        )
        break

      case "wallpaper":
        output = (
          <div className="space-y-2">
            <p className="text-green-500">Opening wallpaper settings...</p>
            <p className="text-xs text-gray-400">
              Tip: You can also right-click on the desktop and select "Change Wallpaper".
            </p>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                 setTimeout(() => {
                   const event = new CustomEvent('openWallpaperSettings');
                   document.dispatchEvent(event);
                 }, 500);
               `,
              }}
            />
          </div>
        )
        break

      case "default-wallpaper":
      case "reset-wallpaper":
        output = (
          <div className="space-y-2">
            <p className="text-green-500">Resetting wallpaper to default...</p>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                 setTimeout(() => {
                   const event = new CustomEvent('resetWallpaper');
                   document.dispatchEvent(event);
                 }, 500);
               `,
              }}
            />
          </div>
        )
        break

      case "clear":
        setHistory([])
        setInput("")
        return

      case "neofetch":
        output = (
          <div className="flex gap-4">
            <div className="text-blue-500">
              <pre className="font-mono text-xs whitespace-pre">
                {`
                   'c.
                ,xNMM.
              .OMMMMo
              OMMM0,
    .;loddo:' loolloddol;.
  cKMMMMMMMMMMNWMMMMMMMMMM0:
.KMMMMMMMMMMMMMMMMMMMMMMMWd.
XMMMMMMMMMMMMMMMMMMMMMMMX.
;MMMMMMMMMMMMMMMMMMMMMMMM:
:MMMMMMMMMMMMMMMMMMMMMMMM:
.MMMMMMMMMMMMMMMMMMMMMMMMX.
kMMMMMMMMMMMMMMMMMMMMMMMMWd.
.XMMMMMMMMMMMMMMMMMMMMMMMMMMk
 .XMMMMMMMMMMMMMMMMMMMMMMMMK.
   kMMMMMMMMMMMMMMMMMMMMMMd
    ;KMMMMMMMWXXWMMMMMMMk.
      .cooc,.    .,coo:.
`}
              </pre>
            </div>
            <div className="text-sm">
              <p className="text-green-500 font-bold">developer@macOS</p>
              <p>-----------------------</p>
              <p>
                <span className="text-yellow-500">OS:</span> macOS Portfolio v1.0.0
              </p>
              <p>
                <span className="text-yellow-500">Kernel:</span> Next.js 14.0.0
              </p>
              <p>
                <span className="text-yellow-500">Uptime:</span> {Math.floor(Math.random() * 100)} days
              </p>
              <p>
                <span className="text-yellow-500">Shell:</span> React.sh
              </p>
              <p>
                <span className="text-yellow-500">Resolution:</span> Responsive x Adaptive
              </p>
              <p>
                <span className="text-yellow-500">DE:</span> TailwindCSS
              </p>
              <p>
                <span className="text-yellow-500">WM:</span> React Hooks
              </p>
              <p>
                <span className="text-yellow-500">Terminal:</span> WebTerminal
              </p>
              <p>
                <span className="text-yellow-500">CPU:</span> JavaScript V8 @ 60fps
              </p>
              <p>
                <span className="text-yellow-500">Memory:</span> 256MB / 512MB
              </p>
            </div>
          </div>
        )
        break

      case "ls":
        output = (
          <div>
            <p className="text-blue-500">Documents/</p>
            <p className="text-blue-500">Projects/</p>
            <p className="text-blue-500">Photos/</p>
            <p className="text-blue-500">Certifications/</p>
            <p>resume.pdf</p>
            <p>notes.txt</p>
            <p>portfolio.js</p>
          </div>
        )
        break

      case "pwd":
        output = <p>/Users/developer/Portfolio</p>
        break

      case "date":
        output = <p>{new Date().toString()}</p>
        break

      default:
        // Handle echo command
        if (command.startsWith("echo ")) {
          const text = command.substring(5)
          output = <p>{text}</p>
        } else {
          output = (
            <p className="text-red-500">
              Command not found: {command}. Type <span className="text-yellow-500">help</span> to see available
              commands.
            </p>
          )
        }
    }

    setHistory((prev) => [...prev, { command: input, output }])
    setInput("")
  }

  /**
   * Handles keyboard navigation and tab completion
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab completion
    if (e.key === "Tab") {
      e.preventDefault()

      // Simple tab completion
      const commands = [
        "help",
        "about",
        "projects",
        "skills",
        "contact",
        "certifications",
        "open certifications",
        "gallery",
        "wallpaper",
        "default-wallpaper",
        "clear",
        "neofetch",
        "ls",
        "pwd",
        "date",
        "echo",
      ]
      const matchingCommands = commands.filter((cmd) => cmd.startsWith(input.toLowerCase()))

      if (matchingCommands.length === 1) {
        setInput(matchingCommands[0])
      } else if (matchingCommands.length > 1) {
        // Show available completions
        setHistory((prev) => [
          ...prev,
          {
            command: input,
            output: (
              <div>
                <p>Available completions:</p>
                <div className="flex flex-wrap gap-x-4">
                  {matchingCommands.map((cmd) => (
                    <span key={cmd} className="text-blue-500">
                      {cmd}
                    </span>
                  ))}
                </div>
              </div>
            ),
          },
        ])
      }
    }

    // Command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  return (
    <div
      ref={terminalRef}
      className="h-full bg-gray-900 text-white font-mono p-4 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Command history */}
      <div className="space-y-3 pb-2">
        {history.map((item, index) => (
          <div key={index}>
            {item.command && (
              <div className="flex items-center gap-1">
                <span className="text-green-500">user@macOS:~$</span>
                <span>{item.command}</span>
              </div>
            )}
            <div className="pl-0 mt-1">{item.output}</div>
          </div>
        ))}
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        <span className="text-green-500">user@macOS:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none caret-white"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  )
}
