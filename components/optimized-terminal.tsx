"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, memo } from "react"

interface CommandHistory {
  command: string
  output: React.ReactNode
}

// Memoized terminal output component for better performance
const TerminalOutput = memo(({ command, output }: CommandHistory) => (
  <div>
    {command && (
      <div className="flex items-center gap-1">
        <span className="text-green-500">user@macOS:~$</span>
        <span>{command}</span>
      </div>
    )}
    <div className="pl-0 mt-1">{output}</div>
  </div>
))

TerminalOutput.displayName = "TerminalOutput"

/**
 * Terminal component that emulates macOS Terminal.app
 * Supports various commands and provides a realistic terminal experience
 */
export default function OptimizedTerminal() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<CommandHistory[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const commandHistoryRef = useRef<HTMLDivElement>(null)

  // Maximum number of commands to keep in history
  const MAX_HISTORY_LENGTH = 100

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
    // Scroll to bottom when history changes, but only if user is already at the bottom
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10

      if (isAtBottom) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }
  }, [history])

  /**
   * Adds a command and its output to the terminal history
   */
  const addToHistory = useCallback((command: string, output: React.ReactNode) => {
    setHistory((prev) => {
      const newHistory = [...prev, { command, output }]
      // Keep only the last MAX_HISTORY_LENGTH commands
      return newHistory.length > MAX_HISTORY_LENGTH ? newHistory.slice(-MAX_HISTORY_LENGTH) : newHistory
    })
  }, [])

  /**
   * Handles form submission when a command is entered
   */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!input.trim()) return

      const command = input.trim().toLowerCase()
      let output: React.ReactNode

      // Add command to history
      setCommandHistory((prev) => [command, ...prev.slice(0, 19)]) // Keep last 20 commands
      setHistoryIndex(-1)

      // Process commands
      try {
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
                <p className="text-green-500 font-bold">About Me</p>
                <p>Hi there! I'm a passionate developer with expertise in web technologies.</p>
                <p>
                  I specialize in building modern web applications using React, Next.js, and other cutting-edge
                  technologies.
                </p>
                <p>
                  With a strong foundation in both frontend and backend development, I create seamless user experiences
                  and robust applications.
                </p>
              </div>
            )
            break

          // Other command cases would go here...

          case "clear":
            setHistory([])
            setInput("")
            return

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

        addToHistory(input, output)
        setInput("")
      } catch (error) {
        console.error("Error processing command:", error)
        addToHistory(input, <p className="text-red-500">An error occurred while processing your command.</p>)
        setInput("")
      }
    },
    [input, addToHistory],
  )

  /**
   * Handles keyboard navigation and tab completion
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
          addToHistory(
            input,
            <div>
              <p>Available completions:</p>
              <div className="flex flex-wrap gap-x-4">
                {matchingCommands.map((cmd) => (
                  <span key={cmd} className="text-blue-500">
                    {cmd}
                  </span>
                ))}
              </div>
            </div>,
          )
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
    },
    [input, historyIndex, commandHistory, addToHistory],
  )

  return (
    <div
      ref={terminalRef}
      className="h-full bg-gray-900 text-white font-mono p-4 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Command history */}
      <div ref={commandHistoryRef} className="space-y-3 pb-2">
        {history.map((item, index) => (
          <TerminalOutput key={index} command={item.command} output={item.output} />
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
          aria-label="Terminal input"
        />
      </form>
    </div>
  )
}
