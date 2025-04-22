"use client"

import { useState, useEffect } from "react"
import { X, Edit2, Check, Plus, Trash2 } from "lucide-react"

interface Note {
  id: string
  content: string
  date: string
}

export default function NotesWidget({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("portfolio-notes")
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (e) {
        console.error("Failed to parse saved notes", e)
      }
    } else {
      // Set default notes if none exist
      const defaultNotes = [
        {
          id: "1",
          content: "Welcome to your notes widget! Add quick thoughts and reminders here.",
          date: new Date().toISOString(),
        },
      ]
      setNotes(defaultNotes)
      localStorage.setItem("portfolio-notes", JSON.stringify(defaultNotes))
    }
  }, [])

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem("portfolio-notes", JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    if (!newNote.trim()) return

    const newNoteObj = {
      id: Date.now().toString(),
      content: newNote,
      date: new Date().toISOString(),
    }

    setNotes((prev) => [newNoteObj, ...prev])
    setNewNote("")
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const startEditing = (note: Note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const saveEdit = () => {
    if (!editingId) return

    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingId ? { ...note, content: editContent, date: new Date().toISOString() } : note,
      ),
    )

    setEditingId(null)
    setEditContent("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  return (
    <div className="w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between widget-drag-handle cursor-move">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Quick Notes</h3>
        <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <X size={14} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Add a new note..."
            className="flex-1 bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNote()
              }
            }}
          />
          <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-500" onClick={addNote}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No notes yet. Add one above!</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notes.map((note) => (
              <div key={note.id} className="p-3">
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <textarea
                      className="w-full bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      autoFocus
                    />
                    <div className="flex justify-end">
                      <button
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-green-500"
                        onClick={saveEdit}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(note.date)}</span>
                      <div className="flex gap-1">
                        <button
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                          onClick={() => startEditing(note)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
