import { useEffect, useRef } from 'react'

export default function Window({ id, title, children, onClose, onFocus, zIndex, position, size, setPosition, setSize, isActive }) {
  const winRef = useRef(null)
  const posRef = useRef({ x: position.x, y: position.y })
  const sizeRef = useRef({ w: size.w, h: size.h })
  const dragging = useRef(false)
  const resizing = useRef(false)
  const resizeDir = useRef(null)

  useEffect(() => {
    posRef.current = position
  }, [position])

  useEffect(() => {
    sizeRef.current = size
  }, [size])

  useEffect(() => {
    const onMouseMove = (e) => {
      if (dragging.current) {
        const dx = e.movementX
        const dy = e.movementY
        const nx = Math.max(0, posRef.current.x + dx)
        const ny = Math.max(0, posRef.current.y + dy)
        posRef.current = { x: nx, y: ny }
        setPosition(id, nx, ny)
      } else if (resizing.current) {
        const rect = winRef.current.getBoundingClientRect()
        let w = sizeRef.current.w
        let h = sizeRef.current.h
        let x = posRef.current.x
        let y = posRef.current.y

        if (resizeDir.current.includes('e')) {
          w = Math.max(300, rect.width + e.movementX)
        }
        if (resizeDir.current.includes('s')) {
          h = Math.max(200, rect.height + e.movementY)
        }
        if (resizeDir.current.includes('w')) {
          w = Math.max(300, rect.width - e.movementX)
          x = Math.max(0, posRef.current.x + e.movementX)
        }
        if (resizeDir.current.includes('n')) {
          h = Math.max(200, rect.height - e.movementY)
          y = Math.max(0, posRef.current.y + e.movementY)
        }

        sizeRef.current = { w, h }
        posRef.current = { x, y }
        setSize(id, w, h)
        setPosition(id, x, y)
      }
    }
    const onMouseUp = () => {
      dragging.current = false
      resizing.current = false
      resizeDir.current = null
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [id, setPosition, setSize])

  const startDrag = (e) => {
    dragging.current = true
    onFocus(id)
    document.body.style.userSelect = 'none'
  }

  const startResize = (dir) => (e) => {
    resizing.current = true
    resizeDir.current = dir
    onFocus(id)
    document.body.style.userSelect = 'none'
  }

  return (
    <div
      ref={winRef}
      onMouseDown={() => onFocus(id)}
      className={`absolute rounded-xl overflow-hidden shadow-2xl border transition-all ${isActive ? 'border-blue-400/60 ring-2 ring-blue-400/20' : 'border-white/10'} backdrop-blur-xl bg-white/70`}
      style={{ left: position.x, top: position.y, width: size.w, height: size.h, zIndex }}
    >
      <div className={`flex items-center justify-between px-3 py-2 cursor-move select-none ${isActive ? 'bg-white/70' : 'bg-white/40'}`} onMouseDown={startDrag}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400/80" onClick={() => onClose(id)}></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
          <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
          <span className="ml-2 font-medium text-gray-700">{title}</span>
        </div>
        <button onClick={() => onClose(id)} className="text-gray-500 hover:text-gray-800">✕</button>
      </div>
      <div className="w-full h-[calc(100%-40px)] bg-white/60 p-4 overflow-auto">
        {children}
      </div>

      {/* Resize handles */}
      <div onMouseDown={startResize('n')} className="absolute top-0 left-0 right-0 h-1 cursor-n-resize"></div>
      <div onMouseDown={startResize('s')} className="absolute bottom-0 left-0 right-0 h-1 cursor-s-resize"></div>
      <div onMouseDown={startResize('e')} className="absolute right-0 top-0 bottom-0 w-1 cursor-e-resize"></div>
      <div onMouseDown={startResize('w')} className="absolute left-0 top-0 bottom-0 w-1 cursor-w-resize"></div>
      <div onMouseDown={startResize('ne')} className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize"></div>
      <div onMouseDown={startResize('nw')} className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize"></div>
      <div onMouseDown={startResize('se')} className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize"></div>
      <div onMouseDown={startResize('sw')} className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize"></div>
    </div>
  )
}
