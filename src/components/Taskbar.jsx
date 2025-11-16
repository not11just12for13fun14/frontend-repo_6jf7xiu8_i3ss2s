import { useMemo } from 'react'
import { Home, Search, Settings, Folder, Music2, Image as ImageIcon } from 'lucide-react'

export default function Taskbar({ onStart, windows, activeId, onToggleDesktop }) {
  const time = useMemo(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), [])
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 backdrop-blur-xl bg-white/60 border-t border-white/20 flex items-center px-3 gap-2">
      <button onClick={onStart} className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 hover:bg-white font-medium shadow">
        <Home size={18} />
        Iniciar
      </button>

      <div className="flex-1 flex items-center gap-2">
        <button className={`px-3 py-2 rounded-full ${activeId ? 'bg-blue-100' : 'bg-white/70'} shadow`} onClick={onToggleDesktop}>
          Área de Trabalho
        </button>
        {windows.map(w => (
          <button key={w.id} className={`px-3 py-2 rounded-full bg-white/70 shadow ${w.id===activeId ? 'ring-2 ring-blue-400' : ''}`}>{w.title}</button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-white/70"><Search size={18}/></button>
        <button className="p-2 rounded-full hover:bg-white/70"><Folder size={18}/></button>
        <button className="p-2 rounded-full hover:bg-white/70"><Music2 size={18}/></button>
        <button className="p-2 rounded-full hover:bg-white/70"><ImageIcon size={18}/></button>
        <button className="p-2 rounded-full hover:bg-white/70"><Settings size={18}/></button>
        <span className="ml-2 text-sm text-gray-700 bg-white/70 px-2 py-1 rounded">{time}</span>
      </div>
    </div>
  )
}
