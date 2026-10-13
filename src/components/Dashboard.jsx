import problems from '../data/problems.json'

export default function Dashboard({ progress }) {
  const total = problems.length
  const done = Object.values(progress).filter(p => p.status === 'done').length
  const almostDone = Object.values(progress).filter(p => p.status === 'almostdone').length
  const needRedo = Object.values(progress).filter(p => p.status === 'redo').length
  const inProgress = Object.values(progress).filter(p => p.status === 'inprogress').length
  const remaining = total - done - almostDone - needRedo - inProgress

  const categories = [...new Set(problems.map(p => p.category))]
  const categoryStats = categories.map(cat => {
    const catProblems = problems.filter(p => p.category === cat)
    const catDone = catProblems.filter(p => progress[p.id]?.status === 'done').length
    const catAlmostDone = catProblems.filter(p => progress[p.id]?.status === 'almostdone').length
    const catRedo = catProblems.filter(p => progress[p.id]?.status === 'redo').length
    return { name: cat, total: catProblems.length, done: catDone, almostDone: catAlmostDone, redo: catRedo }
  })

  const pct = total > 0 ? Math.round(((done + almostDone) / total) * 100) : 0
  const attemptedPct = total > 0 ? Math.round(((done + almostDone + needRedo) / total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Done" value={done} color="bg-green-500" />
        <StatCard label="Almost Done" value={almostDone} color="bg-blue-500" />
        <StatCard label="In Progress" value={inProgress} color="bg-yellow-500" />
        <StatCard label="Need Redo" value={needRedo} color="bg-orange-500" />
        <StatCard label="Remaining" value={remaining} color="bg-gray-500" />
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Overall Progress</span>
          <span className="text-sm font-bold text-green-400">{pct}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden">
          <div className="bg-green-500 h-3 transition-all" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
          <div className="bg-blue-500 h-3 transition-all" style={{ width: `${total > 0 ? (almostDone / total) * 100 : 0}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-1">{done + almostDone}/{total} problems completed</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Attempted At Least Once</span>
          <span className="text-sm font-bold text-purple-400">{attemptedPct}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden">
          <div className="bg-green-500 h-3 transition-all" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
          <div className="bg-blue-500 h-3 transition-all" style={{ width: `${total > 0 ? (almostDone / total) * 100 : 0}%` }} />
          <div className="bg-orange-500 h-3 transition-all" style={{ width: `${total > 0 ? (needRedo / total) * 100 : 0}%` }} />
        </div>
        <p className="text-xs text-gray-500 mt-1">{done + almostDone + needRedo}/{total} problems done at least once</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Category Progress</h3>
        {categoryStats.map(cat => {
          const donePct = cat.total > 0 ? (cat.done / cat.total) * 100 : 0
          const almostDonePct = cat.total > 0 ? (cat.almostDone / cat.total) * 100 : 0
          const redoPct = cat.total > 0 ? (cat.redo / cat.total) * 100 : 0
          return (
            <div key={cat.name}>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{cat.name}</span>
                <span>{cat.done + cat.almostDone + cat.redo}/{cat.total}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 flex overflow-hidden">
                <div
                  className="bg-green-500 h-2 transition-all"
                  style={{ width: `${donePct}%` }}
                />
                <div
                  className="bg-blue-500 h-2 transition-all"
                  style={{ width: `${almostDonePct}%` }}
                />
                <div
                  className="bg-orange-500 h-2 transition-all"
                  style={{ width: `${redoPct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 text-center">
      <div className={`inline-block w-3 h-3 rounded-full ${color} mb-2`} />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}
