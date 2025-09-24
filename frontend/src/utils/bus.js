import EventEmitter from "eventemitter3"


/**
 * Event bus global para comunicação entre componentes.
 *
 * Utiliza a biblioteca `eventemitter3` para disparar e escutar eventos
 * dentro da aplicação React sem a necessidade de passar props manualmente.
 *
 * Exemplo de uso:
 * ```javascript
 * import bus from './bus';
 *
 * // Emitir um evento
 * bus.emit('flash', { message: 'Sucesso!', type: 'success' });
 *
 * // Escutar um evento
 * bus.on('flash', (payload) => console.log(payload.message));
 * ```
 *
 * @module bus
 * @type {EventEmitter}
 */
const bus = new EventEmitter()

export default bus
