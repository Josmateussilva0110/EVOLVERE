import axios from 'axios'


const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Instância personalizada do Axios para realizar requisições HTTP.
 *
 * Configura a URL base da API para `http://localhost:8080`, evitando
 * a repetição desse endereço em múltiplos lugares da aplicação.
 *
 * Exemplo de uso:
 * ```javascript
 * import requestApi from './requestApi';
 *
 * const response = await requestApi.get('/user/session');
 * ```
 *
 * @module requestApi
 */
export default axios.create({
    baseURL: BASE_URL
})
