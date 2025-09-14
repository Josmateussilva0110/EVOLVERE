import api from './api'

// endpoint: rota da API
// method: GET, POST, PUT, DELETE
// data: corpo da requisição (se houver)
// withCredentials: envia cookies de sessão
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
