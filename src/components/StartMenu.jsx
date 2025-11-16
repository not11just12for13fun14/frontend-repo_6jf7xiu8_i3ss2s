import { useState } from 'react'
import { User, Settings, Power, AppWindow, Folder, FileText, Calculator, Music2, Image as ImageIcon } from 'lucide-react'

export default function StartMenu({ open, onOpenApp }) {
  if (!open) return null
  const apps = [
    { id: 'explorer', title: 'Explorador de Arquivos', icon: <Folder size={18}/> },
    { id: 'notes', title: 'Bloco de Notas', icon: <FileText size={18}/> },
    { id: 'calc', title: 'Calculadora', icon: <Calculator size={18}/> },
    { id: 'music', title: 'Música', icon: <Music2 size={18}/> },
    { id: 'gallery', title: 'Galeria', icon: <ImageIcon size={18}/> },
  ]

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-[680px] h-[480px] rounded-2xl backdrop-blur-2xl bg-white/70 border border-white/20 shadow-2xl grid grid-cols-3 overflow-hidden">
      <div className="col-span-2 p-6 overflow-auto">
        <h3 className="font-semibold text-gray-700 mb-3">Aplicativos fixados</h3>
        <div className="grid grid-cols-4 gap-3">
          {apps.map(a => (
            <button key={a.id} onClick={() => onOpenApp(a.id)} className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/70 hover:bg-blue-50 border border-white/20 shadow">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-inner">
                {a.icon}
              </div>
              <span className="text-sm text-gray-700">{a.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="border-l border-white/20 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600" />
          <div>
            <p className="font-medium text-gray-800">Você</p>
            <p className="text-xs text-gray-500">Conectado</p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2">
          <button className="p-3 rounded-xl bg-white/70 hover:bg-white shadow flex items-center justify-center"><Settings size={18}/></button>
          <button className="p-3 rounded-xl bg-white/70 hover:bg-white shadow flex items-center justify-center"><User size={18}/></button>
          <button className="p-3 rounded-xl bg-white/70 hover:bg-white shadow flex items-center justify-center"><Power size={18}/></button>
        </div>
      </div>
    </div>
  )
}
