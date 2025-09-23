import api from './api'

/**
 * Função utilitária para requisições HTTP à API.
 *
 * Suporta GET, POST, PUT, DELETE e envia FormData quando necessário.
 * Também trata sessão expirada disparando um evento global `SESSION_EXPIRED`.
 *
 * @async
 * @function requestData
 * @param {string} endpoint - Rota da API (ex: "/user/session").
 * @param {string} [method='get'] - Método HTTP: GET, POST, PUT, DELETE.
 * @param {object|FormData} [data={}] - Dados da requisição. Para GET, enviados como params.
 * @param {boolean} [withCredentials=false] - Envia cookies de sessão se true.
 *
 * @returns {Promise<object>} Objeto com:
 *  - `success` {boolean} indica se a requisição foi bem-sucedida
 *  - `status` {number} código HTTP retornado
 *  - `data` {any} dados retornados pela API
 *  - `message` {string} mensagem de resposta ou erro
 *
 * @example
 * // GET simples
 * const response = await requestData('/user/session');
 *
 * // POST com corpo
 * const response = await requestData('/login', 'POST', { email, password });
 *
 * // Enviar FormData
 * const formData = new FormData();
 * formData.append('photo', file);
 * const response = await requestData('/user/1', 'PATCH', formData, true);
 */
async function requestData(endpoint, method = 'get', data = {}, withCredentials = false) {
  try {
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
    }

    // Se for GET, envia como params
    if (config.method === 'get') {
      config.params = data
    } else {
      config.data = data
    }

    // Se for FormData, força multipart
    if (data instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      }
    }

    if (withCredentials) {
      config.withCredentials = true // Axios envia cookies
    }

    const response = await api(config)

    return {
      success: true,
      status: response.status,
      data: response.data,
      message: response.data.message
    }
  } catch (err) {
    if (err.response?.status === 401) {
      // dispara evento global
      window.dispatchEvent(new Event('SESSION_EXPIRED'))
    }
    return {
      success: false,
      status: err.response?.status || 500,
      message: err.response?.data?.message || err.message,
    }
  }
}

export default requestData
