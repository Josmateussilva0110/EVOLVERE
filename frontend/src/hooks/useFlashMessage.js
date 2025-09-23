import { useCallback } from 'react'
import bus from '../utils/bus'


/**
 * Hook para disparar mensagens rápidas (flash messages) na aplicação.
 *
 * Utiliza um EventBus (`bus`) para emitir eventos do tipo `"flash"`,
 * que podem ser capturados pelo componente `FlashMessage`.
 *
 * @returns {Object} Objeto contendo a função `setFlashMessage`.
 * @property {Function} setFlashMessage - Função para exibir uma mensagem.
 * @param {string} setFlashMessage.message - Texto da mensagem a ser exibida.
 * @param {'success'|'error'} setFlashMessage.type - Tipo da mensagem, que define cor e ícone.
 *
 * @example
 * import useFlashMessage from '../hooks/useFlashMessage';
 *
 * function MyComponent() {
 *   const { setFlashMessage } = useFlashMessage();
 *   
 *   function handleClick() {
 *     setFlashMessage('Operação realizada com sucesso!', 'success');
 *   }
 *   
 *   return <button onClick={handleClick}>Disparar Mensagem</button>;
 * }
 */
export default function useFlashMessage() {
  const setFlashMessage = useCallback((message, type) => {
    bus.emit('flash', { message, type })
  }, [])

  return { setFlashMessage }
}
