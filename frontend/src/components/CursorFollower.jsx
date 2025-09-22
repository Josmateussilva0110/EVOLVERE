import { useState, useEffect } from "react"
import { Sparkles, Star, Heart, Zap } from "lucide-react"

/**
 * Componente que cria um ícone animado que segue o cursor do mouse
 * com interações divertidas e animações suaves.
 * 
 * @returns {JSX.Element} Componente do seguidor de cursor
 */
function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [currentIcon, setCurrentIcon] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const icons = [
    { component: Sparkles, color: "text-yellow-400", size: "w-6 h-6" },
    { component: Star, color: "text-blue-400", size: "w-5 h-5" },
    { component: Heart, color: "text-red-400", size: "w-5 h-5" },
    { component: Zap, color: "text-purple-400", size: "w-6 h-6" }
  ]

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        setIsHovering(true)
        setCurrentIcon((prev) => (prev + 1) % icons.length)
      } else {
        setIsHovering(false)
      }
    }

    // Adicionar listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver)

    // Trocar ícone a cada 3 segundos
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 3000)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
      clearInterval(iconInterval)
    }
  }, [icons.length])

  if (!isVisible) return null

  const CurrentIcon = icons[currentIcon].component

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
      style={{
        left: position.x - 12,
        top: position.y - 12,
        transform: isHovering ? 'scale(1.5) rotate(180deg)' : 'scale(1) rotate(0deg)'
      }}
    >
      <div className={`${icons[currentIcon].color} ${icons[currentIcon].size} transition-all duration-500`}>
        <CurrentIcon className={`${icons[currentIcon].size} ${isHovering ? 'animate-bounce' : 'animate-pulse'}`} />
      </div>
      
      {/* Efeito de partículas */}
      {isHovering && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-100"></div>
          <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-200"></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-red-400 rounded-full animate-ping delay-300"></div>
        </div>
      )}
    </div>
  )
}

export default CursorFollower
