import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, X } from 'lucide-react'
import bus from '../../utils/bus'

function FlashMessage() {
  const [flashMessage, setFlashMessage] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

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
