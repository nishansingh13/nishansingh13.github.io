import problems from '../data/problems.json'

const problemMap = Object.fromEntries(problems.map(p => [p.id, p]))

export default function DailyLog({ dailyLog }) {
  const dates = Object.keys(dailyLog).sort((a, b) => b.localeCompare(a))

  if (dates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No activity yet</p>
        <p className="text-sm">Start solving problems — completed and redo items will appear here by date.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-green-400">Daily Activity Log</h2>
      {dates.map(date => {
        const entries = dailyLog[date]
        const doneCount = entries.filter(e => e.status === 'done').length
        const almostDoneCount = entries.filter(e => e.status === 'almostdone').length
        const redoCount = entries.filter(e => e.status === 'redo').length

        return (
          <div key={date} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-200">{formatDate(date)}</h3>
              <div className="flex gap-2 text-xs">
                {doneCount > 0 && <span className="bg-green-900 text-green-300 px-2 py-0.5 rounded-full">{doneCount} done</span>}
                {almostDoneCount > 0 && <span className="bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">{almostDoneCount} almost</span>}
                {redoCount > 0 && <span className="bg-orange-900 text-orange-300 px-2 py-0.5 rounded-full">{redoCount} redo</span>}
                <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{entries.length} total</span>
              </div>
            </div>
            <ul className="space-y-1">
              {entries.map((entry, i) => {
                const problem = problemMap[entry.problemId]
                if (!problem) return null
                return (
                  <li key={i} className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-gray-750">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.status === 'done' ? 'bg-green-500' : entry.status === 'almostdone' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                    <span className="text-gray-300 flex-1 truncate">{problem.name}</span>
                    <span className="text-xs text-gray-500">{problem.lc !== 'GFG' ? `LC ${problem.lc}` : 'GFG'}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${entry.status === 'done' ? 'text-green-400' : entry.status === 'almostdone' ? 'text-blue-400' : 'text-orange-400'}`}>
                      {entry.status === 'done' ? 'Done' : entry.status === 'almostdone' ? 'Almost Done' : 'Redo'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((today - date) / (1000 * 60 * 60 * 24))

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}
