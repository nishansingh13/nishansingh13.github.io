import { useState, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import problems from './data/problems.json'
import Dashboard from './components/Dashboard'
import ProblemList from './components/ProblemList'
import NotesPanel from './components/NotesPanel'
import Filters from './components/Filters'
import DailyLog from './components/DailyLog'

function App() {
  const [progress, setProgress] = useLocalStorage('dsa-progress', {})
  const [notes, setNotes] = useLocalStorage('dsa-notes', {})
  const [dailyLog, setDailyLog] = useLocalStorage('dsa-daily-log', {})
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [view, setView] = useState('problems') // problems | dashboard | revision | log
  const [filters, setFilters] = useState({ search: '', category: '', status: '', difficulty: '' })

  const filteredProblems = useMemo(() => {
    return problems.filter(p => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matchName = p.name.toLowerCase().includes(q)
        const matchLC = p.lc?.toString().includes(q)
        if (!matchName && !matchLC) return false
      }
      if (filters.category && p.category !== filters.category) return false
      if (filters.difficulty && p.difficulty !== filters.difficulty) return false
      if (filters.status) {
        const status = progress[p.id]?.status || 'todo'
        if (status !== filters.status) return false
      }
      return true
    })
  }, [filters, progress])

  const revisionProblems = useMemo(() => {
    return problems.filter(p => progress[p.id]?.revision)
  }, [progress])

  const handleStatusChange = (id, status) => {
    const prevStatus = progress[id]?.status || 'todo'
    setProgress(prev => ({ ...prev, [id]: { ...prev[id], status } }))

    // Log to daily activity when marking as done, almostdone, or redo (not inprogress)
    if ((status === 'done' || status === 'almostdone' || status === 'redo') && prevStatus !== status) {
      const now = new Date()
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      setDailyLog(prev => {
        const dayEntries = (prev[today] || []).filter(e => e.problemId !== id)
        return { ...prev, [today]: [...dayEntries, { problemId: id, status, time: Date.now() }] }
      })
    }
  }

  const handleToggleRevision = (id) => {
    setProgress(prev => ({
      ...prev,
      [id]: { ...prev[id], revision: !prev[id]?.revision }
    }))
  }

  const handleSaveNotes = (id, text) => {
    setNotes(prev => ({ ...prev, [id]: text }))
  }

  const handleExport = () => {
    const data = { progress, notes, dailyLog, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dsa-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result)
        if (data.progress) setProgress(data.progress)
        if (data.notes) setNotes(data.notes)
        if (data.dailyLog) setDailyLog(data.dailyLog)
      } catch { /* ignore invalid files */ }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-purple-400">DSA Tracker</h1>
          <nav className="flex gap-1">
            <NavBtn active={view === 'problems'} onClick={() => setView('problems')}>Problems</NavBtn>
            <NavBtn active={view === 'dashboard'} onClick={() => setView('dashboard')}>Dashboard</NavBtn>
            <NavBtn active={view === 'revision'} onClick={() => setView('revision')}>
              Revise Today {revisionProblems.length > 0 && <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 rounded-full">{revisionProblems.length}</span>}
            </NavBtn>
            <NavBtn active={view === 'log'} onClick={() => setView('log')}>Daily Log</NavBtn>
          </nav>
          <div className="flex gap-2">
            <button onClick={handleExport} className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">Export</button>
            <label className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
              Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-4">
        {view === 'dashboard' && <Dashboard progress={progress} />}
        {view === 'log' && <DailyLog dailyLog={dailyLog} />}

        {view === 'problems' && (
          <div className="flex gap-4">
            <div className={`flex-1 min-w-0 ${selectedProblem ? 'max-w-[60%]' : ''}`}>
              <div className="mb-4">
                <Filters filters={filters} setFilters={setFilters} />
              </div>
              <ProblemList
                problems={filteredProblems}
                progress={progress}
                onSelect={setSelectedProblem}
                onStatusChange={handleStatusChange}
                onToggleRevision={handleToggleRevision}
                selectedId={selectedProblem?.id}
              />
            </div>
            {selectedProblem && (
              <div className="w-[40%] sticky top-4 self-start max-h-[calc(100vh-6rem)]">
                <NotesPanel
                  problem={selectedProblem}
                  notes={notes[selectedProblem.id]}
                  onSaveNotes={handleSaveNotes}
                  onClose={() => setSelectedProblem(null)}
                />
              </div>
            )}
          </div>
        )}

        {view === 'revision' && (
          <div className="flex gap-4">
            <div className={`flex-1 min-w-0 ${selectedProblem ? 'max-w-[60%]' : ''}`}>
              <h2 className="text-lg font-semibold text-blue-400 mb-4">Revise Today ({revisionProblems.length} problems)</h2>
              {revisionProblems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No problems marked for revision. Click ☆ on any problem to add it here.</p>
              ) : (
                <ProblemList
                  problems={revisionProblems}
                  progress={progress}
                  onSelect={setSelectedProblem}
                  onStatusChange={handleStatusChange}
                  onToggleRevision={handleToggleRevision}
                  selectedId={selectedProblem?.id}
                />
              )}
            </div>
            {selectedProblem && (
              <div className="w-[40%] sticky top-4 self-start max-h-[calc(100vh-6rem)]">
                <NotesPanel
                  problem={selectedProblem}
                  notes={notes[selectedProblem.id]}
                  onSaveNotes={handleSaveNotes}
                  onClose={() => setSelectedProblem(null)}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

function NavBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${active ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
    >
      {children}
    </button>
  )
}

export default App
