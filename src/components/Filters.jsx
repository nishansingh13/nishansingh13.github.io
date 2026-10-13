import problems from '../data/problems.json'

const categories = [...new Set(problems.map(p => p.category))]

export default function Filters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        type="text"
        placeholder="Search by name or LC#..."
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 w-52"
      />

      <select
        value={filters.category}
        onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 cursor-pointer"
      >
        <option value="">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        value={filters.status}
        onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 cursor-pointer"
      >
        <option value="">All Status</option>
        <option value="todo">Todo</option>
        <option value="inprogress">In Progress</option>
        <option value="almostdone">Almost Done</option>
        <option value="done">Done</option>
        <option value="redo">Need Redo</option>
      </select>

      <select
        value={filters.difficulty}
        onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value }))}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 cursor-pointer"
      >
        <option value="">All Difficulty</option>
        <option value="Hard">Hard</option>
        <option value="Medium">Medium</option>
      </select>
    </div>
  )
}
