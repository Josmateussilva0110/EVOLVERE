import { useCallback } from 'react'
import bus from '../utils/bus'

export default function useFlashMessage() {
  const setFlashMessage = useCallback((message, type) => {
    bus.emit('flash', { message, type })
  }, [])

  return { setFlashMessage }
}
