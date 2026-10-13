import { useState, useEffect } from 'react'

export default function NotesPanel({ problem, notes, onSaveNotes, onClose }) {
  const [text, setText] = useState(notes || '')

  useEffect(() => {
    setText(notes || '')
  }, [problem?.id, notes])

  if (!problem) return null

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-200 truncate">
          {problem.lc && problem.lc !== 'GFG' ? `LC ${problem.lc} — ` : problem.lc === 'GFG' ? 'GFG — ' : ''}
          {problem.name}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg">×</button>
      </div>

      <div className="flex gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">{problem.category}</span>
        <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded">{problem.difficulty}</span>
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your notes here... (approach, patterns, edge cases, time complexity)"
        className="flex-1 w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
      />

      <button
        onClick={() => onSaveNotes(problem.id, text)}
        className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-colors"
      >
        Save Notes
      </button>
    </div>
  )
}
