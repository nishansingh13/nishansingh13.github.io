const STATUS_COLORS = {
  todo: 'bg-red-500/20 text-red-400 border-red-500/30',
  inprogress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  almostdone: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  done: 'bg-green-500/20 text-green-400 border-green-500/30',
  redo: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
}

const STATUS_LABELS = {
  todo: 'Todo',
  inprogress: 'In Progress',
  almostdone: 'Almost Done',
  done: 'Done',
  redo: 'Need Redo',
}

export default function ProblemList({ problems, progress, onSelect, onStatusChange, onToggleRevision, selectedId }) {
  const categories = [...new Set(problems.map(p => p.category))]

  if (problems.length === 0) {
    return <p className="text-gray-500 text-center py-8">No problems match your filters.</p>
  }

  return (
    <div className="space-y-6">
      {categories.map(cat => {
        const catProblems = problems.filter(p => p.category === cat)
        if (catProblems.length === 0) return null
        return (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-purple-400 mb-2 sticky top-0 bg-gray-900 py-1 z-10">
              {cat} ({catProblems.length})
            </h3>
            <div className="space-y-1">
              {catProblems.map(problem => {
                const status = progress[problem.id]?.status || 'todo'
                const revision = progress[problem.id]?.revision || false
                const isSelected = selectedId === problem.id
                return (
                  <div
                    key={problem.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-800 ${isSelected ? 'bg-gray-800 ring-1 ring-purple-500' : ''}`}
                    onClick={() => onSelect(problem)}
                  >
                    <select
                      value={status}
                      onChange={e => { e.stopPropagation(); onStatusChange(problem.id, e.target.value) }}
                      onClick={e => e.stopPropagation()}
                      className={`text-xs px-2 py-1 rounded border cursor-pointer ${STATUS_COLORS[status]} bg-transparent`}
                    >
                      <option value="todo">Todo</option>
                      <option value="inprogress">In Progress</option>
                      <option value="almostdone">Almost Done</option>
                      <option value="done">Done</option>
                      <option value="redo">Need Redo</option>
                    </select>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm truncate block">
                        {problem.lc && problem.lc !== 'GFG' && <span className="text-gray-500">LC {problem.lc} — </span>}
                        {problem.lc === 'GFG' && <span className="text-gray-500">GFG — </span>}
                        {problem.name}
                      </span>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); onToggleRevision(problem.id) }}
                      className={`text-xs px-2 py-0.5 rounded ${revision ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-500'} hover:opacity-80`}
                      title={revision ? 'Remove from revision' : 'Mark for revision'}
                    >
                      {revision ? '★' : '☆'}
                    </button>

                    <span className="text-xs text-gray-600">{problem.difficulty}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
