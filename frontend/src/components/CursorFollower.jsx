import { useState, useEffect } from "react"
import { Sparkles, Star, Heart, Zap } from "lucide-react"

/**
 * @file CursorFollower.jsx
 * @description Componente visual que exibe um ícone animado que segue o cursor do mouse na tela.
 * O ícone muda periodicamente e reage quando o usuário passa o cursor sobre botões,
 * criando um efeito interativo e divertido com pequenas partículas.
 *
 * O objetivo é melhorar a experiência visual e a imersão do usuário na interface.
 *
 * @module components/Animations/CursorFollower
 */

/**
 * @component CursorFollower
 * @description Cria um seguidor de cursor animado com ícones interativos.
 * O ícone muda automaticamente a cada 3 segundos, e ao passar o mouse sobre botões,
 * ele aumenta de tamanho, gira, muda de ícone e exibe um pequeno efeito de partículas coloridas.
 *
 * @example
 * ```jsx
 * import CursorFollower from "./components/CursorFollower"
 *
 * function App() {
 *   return (
 *     <div>
 *       <CursorFollower />
 *       <button>Exemplo</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @returns {JSX.Element|null} Um componente visual fixo que segue o cursor, ou `null` se não estiver visível.
 */
function CursorFollower() {
  /**
   * @constant {Object} position - Coordenadas (x, y) atuais do cursor.
   * @property {number} x - Posição horizontal do cursor.
   * @property {number} y - Posição vertical do cursor.
   */
  const [position, setPosition] = useState({ x: 0, y: 0 })

  /**
   * @constant {boolean} isVisible - Define se o ícone seguidor deve ser exibido.
   */
  const [isVisible, setIsVisible] = useState(false)

  /**
   * @constant {number} currentIcon - Índice do ícone atualmente exibido.
   */
  const [currentIcon, setCurrentIcon] = useState(0)

  /**
   * @constant {boolean} isHovering - Indica se o cursor está sobre um botão.
   * Quando verdadeiro, ativa animações de destaque e partículas.
   */
  const [isHovering, setIsHovering] = useState(false)

  /**
   * @constant {Array<Object>} icons - Lista de ícones disponíveis com suas respectivas cores e tamanhos.
   */
  const icons = [
    { component: Sparkles, color: "text-yellow-400", size: "w-6 h-6" },
    { component: Star, color: "text-blue-400", size: "w-5 h-5" },
    { component: Heart, color: "text-red-400", size: "w-5 h-5" },
    { component: Zap, color: "text-purple-400", size: "w-6 h-6" }
  ]

  /**
   * @hook useEffect
   * @description Garante que os eventos do mouse sejam monitorados para atualizar
   * a posição, visibilidade e interação com botões. Também alterna automaticamente o ícone a cada 3 segundos.
   */
  useEffect(() => {
    /**
     * @function handleMouseMove
     * @description Atualiza a posição do seguidor conforme o movimento do cursor.
     * @param {MouseEvent} e - Evento de movimento do mouse.
     */
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    /**
     * @function handleMouseEnter
     * @description Torna o seguidor visível quando o cursor entra na janela.
     */
    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    /**
     * @function handleMouseLeave
     * @description Oculta o seguidor quando o cursor sai da janela.
     */
    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    /**
     * @function handleMouseOver
     * @description Detecta quando o cursor passa sobre um botão
     * e alterna o ícone atual, ativando o estado de destaque.
     * @param {MouseEvent} e - Evento de sobreposição do mouse.
     */
    const handleMouseOver = (e) => {
      if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
        setIsHovering(true)
        setCurrentIcon((prev) => (prev + 1) % icons.length)
      } else {
        setIsHovering(false)
      }
    }

    // Adiciona listeners globais
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleMouseOver)

    // Alterna ícones automaticamente a cada 3 segundos
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length)
    }, 3000)

    // Limpa os eventos e intervalos ao desmontar o componente
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleMouseOver)
      clearInterval(iconInterval)
    }
  }, [icons.length])

  // Não renderiza nada enquanto o cursor não estiver visível
  if (!isVisible) return null

  /**
   * @constant {React.Component} CurrentIcon - Ícone atualmente ativo.
   */
  const CurrentIcon = icons[currentIcon].component

  /**
   * @returns {JSX.Element} Ícone animado posicionado conforme o cursor.
   */
  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
      style={{
        left: position.x - 12,
        top: position.y - 12,
        transform: isHovering ? "scale(1.5) rotate(180deg)" : "scale(1) rotate(0deg)"
      }}
    >
      {/* Ícone principal */}
      <div className={`${icons[currentIcon].color} ${icons[currentIcon].size} transition-all duration-500`}>
        <CurrentIcon
          className={`${icons[currentIcon].size} ${isHovering ? "animate-bounce" : "animate-pulse"}`}
        />
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
