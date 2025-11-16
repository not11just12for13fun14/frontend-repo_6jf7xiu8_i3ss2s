import { useCallback, useMemo, useState } from 'react'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import StartMenu from './components/StartMenu'
import Window from './components/Window'

function App() {
  const [startOpen, setStartOpen] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [showDesktop, setShowDesktop] = useState(true)

  const [windows, setWindows] = useState([])
  const [nextId, setNextId] = useState(1)

  const onFocus = useCallback((id) => {
    setActiveId(id)
    setWindows((ws) => ws.map(w => w.id === id ? { ...w, z: Math.max(...ws.map(x=>x.z||1))+1 } : w))
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(ws => ws.filter(w => w.id !== id))
    if (activeId === id) setActiveId(null)
  }, [activeId])

  const setPosition = useCallback((id, x, y) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, position: { x, y } } : w))
  }, [])

  const setSize = useCallback((id, w, h) => {
    setWindows(ws => ws.map(win => win.id === id ? { ...win, size: { w, h } } : win))
  }, [])

  const openApp = useCallback((appId) => {
    const base = {
      id: nextId,
      z: Math.max(1, ...windows.map(w=>w.z||1)) + 1,
      position: { x: 80 + windows.length * 20, y: 80 + windows.length * 20 },
      size: { w: 720, h: 460 },
    }
    const map = {
      explorer: { title: 'Explorador de Arquivos', app: 'explorer' },
      notes: { title: 'Bloco de Notas', app: 'notes' },
      calc: { title: 'Calculadora', app: 'calc' },
      music: { title: 'Música', app: 'music' },
      gallery: { title: 'Galeria', app: 'gallery' },
    }
    const cfg = map[appId]
    if (!cfg) return
    const win = { ...base, ...cfg }
    setWindows(ws => [...ws, win])
    setActiveId(nextId)
    setNextId(id => id + 1)
    setStartOpen(false)
    setShowDesktop(true)
  }, [nextId, windows.length])

  const onToggleDesktop = useCallback(() => {
    setShowDesktop(v => !v)
  }, [])

  const contentFor = useCallback((w) => {
    switch (w.app) {
      case 'explorer':
        return <Explorer />
      case 'notes':
        return <Notes />
      case 'calc':
        return <Calculator />
      case 'music':
        return <Music />
      case 'gallery':
        return <Gallery />
      default:
        return <div/>
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Wallpaper */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-blue-300 to-indigo-300" />
        <div className="absolute -top-32 -left-24 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-sky-400/60 to-blue-600/60 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-indigo-500/50 to-blue-400/40 blur-3xl" />
      </div>

      {/* Desktop icons */}
      {showDesktop && (
        <Desktop onOpenApp={openApp} />
      )}

      {/* Open windows */}
      {windows.map((w) => (
        <Window
          key={w.id}
          id={w.id}
          title={w.title}
          zIndex={w.z}
          position={w.position}
          size={w.size}
          setPosition={setPosition}
          setSize={setSize}
          onClose={closeWindow}
          onFocus={onFocus}
          isActive={activeId === w.id}
        >
          {contentFor(w)}
        </Window>
      ))}

      {/* Start menu */}
      <StartMenu open={startOpen} onOpenApp={openApp} />

      {/* Taskbar */}
      <Taskbar
        onStart={() => setStartOpen(v => !v)}
        windows={windows}
        activeId={activeId}
        onToggleDesktop={onToggleDesktop}
      />
    </div>
  )
}

function Explorer() {
  const items = [
    { name: 'Documentos', type: 'folder' },
    { name: 'Imagens', type: 'folder' },
    { name: 'Músicas', type: 'folder' },
    { name: 'nota.txt', type: 'file' },
  ]
  return (
    <div className="h-full grid grid-cols-5 gap-3">
      <div className="col-span-1 space-y-2">
        <div className="p-3 rounded-lg bg-white/80 border">Acesso rápido</div>
        <div className="p-3 rounded-lg bg-white/80 border">Este Computador</div>
        <div className="p-3 rounded-lg bg-white/80 border">Downloads</div>
      </div>
      <div className="col-span-4">
        <div className="grid grid-cols-4 gap-3">
          {items.map((it, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/80 border hover:bg-blue-50 cursor-default">
              <div className="w-12 h-12 rounded-lg bg-blue-200 mb-2" />
              <div className="text-sm text-gray-800">{it.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Notes() {
  const [text, setText] = useState('Anotações rápidas...')
  return (
    <div className="h-full flex flex-col">
      <div className="mb-2 text-sm text-gray-600">Sem salvar automático neste protótipo</div>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 p-3 rounded-lg bg-white/80 border outline-none focus:ring-2 focus:ring-blue-300" />
    </div>
  )
}

function Calculator() {
  const [expr, setExpr] = useState('')
  const onPress = (v) => setExpr(e => e + v)
  const evalExpr = () => {
    try { setExpr(String(Function('return ' + expr)())) } catch { setExpr('Erro') }
  }
  const clearExpr = () => setExpr('')
  const keys = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+']
  return (
    <div className="grid grid-cols-4 gap-2">
      <input className="col-span-4 p-3 rounded-lg bg-white/80 border text-right" value={expr} readOnly />
      <button onClick={clearExpr} className="col-span-2 p-3 rounded-lg bg-red-100 hover:bg-red-200">C</button>
      <button onClick={()=>onPress('(')} className="p-3 rounded-lg bg-white/80 hover:bg-white">(</button>
      <button onClick={()=>onPress(')')} className="p-3 rounded-lg bg-white/80 hover:bg-white">)</button>
      {keys.map((k,i)=>(
        <button key={i} onClick={()=> (k==='='? evalExpr(): onPress(k))} className="p-3 rounded-lg bg-white/80 hover:bg-white">
          {k}
        </button>
      ))}
    </div>
  )
}

function Music() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-fuchsia-400 to-purple-600 mb-4 shadow-inner" />
      <p className="text-gray-700">Player de música (demo)</p>
    </div>
  )
}

function Gallery() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Array.from({length:8}).map((_,i)=> (
        <div key={i} className="aspect-video rounded-xl bg-gradient-to-br from-blue-200 to-indigo-200" />
      ))}
    </div>
  )
}

export default App
