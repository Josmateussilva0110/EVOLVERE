import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import bus from '../../utils/bus'



/**
 * Componente de mensagens rápidas (FlashMessage).
 *
 * Responsável por exibir notificações temporárias de sucesso ou erro
 * em um canto da tela, com suporte a animações do `framer-motion`.
 *
 * Funcionamento:
 * - Escuta eventos disparados no `bus` com a chave `"flash"`.
 * - Exibe a mensagem com ícone correspondente (`success` ou `error`).
 * - Remove automaticamente após 3 segundos ou manualmente via botão de fechar.
 *
 * Hooks utilizados:
 * - `useState` e `useEffect` para controle de estado e timeout.
 * - `framer-motion` (`AnimatePresence` e `motion.div`) para animações de entrada e saída.
 *
 * Estilização:
 * - Posição fixa no canto superior direito.
 * - Cores e ícones variam conforme o tipo da mensagem (`success` ou `error`).
 *
 * @component
 * @example
 * // Disparando uma mensagem de sucesso:
 * import bus from "../../utils/bus";
 *
 * function handleSave() {
 *   bus.emit("flash", { message: "Salvo com sucesso!", type: "success" });
 * }
 *
 * // Disparando uma mensagem de erro:
 * bus.emit("flash", { message: "Ocorreu um erro.", type: "error" });
 *
 * @returns {JSX.Element} Caixa de mensagem animada que aparece temporariamente na tela.
 */
function FlashMessage() {
  const [flashMessage, setFlashMessage] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  /**
   * Efeito colateral responsável por escutar eventos do `bus` com a chave `"flash"`.
   *
   * - Quando um evento é disparado, atualiza o estado `flashMessage` com os dados recebidos (`message` e `type`).
   * - Cancela qualquer timeout anterior antes de criar um novo.
   * - Define um timeout de 3 segundos para remover automaticamente a mensagem.
   * - Faz a limpeza removendo o listener e limpando o timeout quando o componente é desmontado
   *   ou quando `timeoutId` muda.
   *
   * @function useEffect
   * @dependency [timeoutId] → garante que o timeout anterior seja sempre limpo e recriado.
   */
  useEffect(() => {
    const handleFlash = (payload) => {
      const { message, type } = payload
      setFlashMessage({ message, type })

      // limpa timeout anterior
      if (timeoutId) clearTimeout(timeoutId)

      const id = setTimeout(() => setFlashMessage(null), 3000)
      setTimeoutId(id)
    }

    bus.on('flash', handleFlash)
    return () => {
      bus.off('flash', handleFlash)
      if (timeoutId) clearTimeout(timeoutId) 
    }
  }, [timeoutId])

  /**
   * Fecha manualmente a mensagem de flash.
   *
   * - Cancela o timeout em execução (se existir).
   * - Remove imediatamente a mensagem chamando `setFlashMessage(null)`.
   *
   * Usado no botão de fechar (`X`) dentro da mensagem.
   *
   * @function closeMessage
   * @returns {void}
   */
  const closeMessage = () => {
    if (timeoutId) clearTimeout(timeoutId) 
    setFlashMessage(null)
  }

  const typeStyles = {
    success: {
      bg: "bg-green-500 border-green-600 text-white",
      icon: <CheckCircle className="w-5 h-5 text-white" />
    },
    error: {
      bg: "bg-red-500 border-red-600 text-white",
      icon: <XCircle className="w-5 h-5 text-white" />
    },
  }

  return (
    <div className="fixed top-5 right-5 z-50">
      <AnimatePresence>
        {flashMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg border ${typeStyles[flashMessage.type]?.bg || "bg-gray-700 text-white border-gray-600"}`}
          >
            {typeStyles[flashMessage.type]?.icon}
            <span className="flex-1">{flashMessage.message}</span>
            {/* Botão de fechar */}
            <button
              onClick={closeMessage}
              className="ml-2 text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FlashMessage
