import { useMemo } from 'react'
import { Folder, FileText, Image as ImageIcon, Music2 } from 'lucide-react'

export default function Desktop({ onOpenApp }) {
  const icons = useMemo(() => [
    { id: 'explorer', title: 'Arquivos', icon: <Folder size={24}/> },
    { id: 'notes', title: 'Notas', icon: <FileText size={24}/> },
    { id: 'gallery', title: 'Galeria', icon: <ImageIcon size={24}/> },
    { id: 'music', title: 'Música', icon: <Music2 size={24}/> },
  ], [])

  return (
    <div className="absolute inset-0 p-6 grid grid-cols-1 content-start gap-4 select-none">
      {icons.map((it) => (
        <button key={it.id} onDoubleClick={() => onOpenApp(it.id)} className="group w-28 h-24 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex flex-col items-center justify-center gap-2 text-white shadow">
          <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30">
            {it.icon}
          </div>
          <span className="text-xs">{it.title}</span>
        </button>
      ))}
    </div>
  )
}
