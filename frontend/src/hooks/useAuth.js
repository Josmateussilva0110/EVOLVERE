import { useNavigate } from "react-router-dom"
import requestData from "../utils/requestApi"
import useFlashMessage from "./useFlashMessage"


/**
 * Hook de autenticação personalizado.
 *
 * Fornece funções para login, registro, logout, atualização de usuário
 * e logout local (sem chamada à API), gerenciando estado global via callbacks.
 *
 * @param {Object} params - Objetos de callbacks para gerenciar estado global.
 * @param {Function} params.setAuthenticated - Atualiza o estado de autenticação.
 * @param {Function} params.setUser - Atualiza o estado do usuário.
 *
 * @returns {Object} Funções de autenticação e manipulação de usuário.
 */
export default function useAuth({ setAuthenticated, setUser }) {
  const navigate = useNavigate()
  const { setFlashMessage } = useFlashMessage()


  /**
   * Realiza login do usuário.
   *
   * @param {Object} credentials - Credenciais do usuário.
   * @param {string} credentials.email - Email do usuário.
   * @param {string} credentials.password - Senha do usuário.
   * @returns {Promise<Object>} Resposta da API.
   */
  async function login(credentials) {
    const response = await requestData("/login", "POST", credentials, true)
    if (response.success) {
      setAuthenticated(true)
      setUser(response.data.user)
      setFlashMessage(response.data.message, "success")
      navigate("/")
    } else {
      setFlashMessage(response.message, "error")
    }
    return response
  }

  /**
   * Realiza registro de um novo usuário.
   *
   * @param {Object} userData - Dados do usuário para registro.
   * @returns {Promise<Object>} Resposta da API.
   */
  async function register(userData) {
    const response = await requestData("/user/register", "POST", userData, true)
    if (response.success) {
      setAuthenticated(true)
      setUser(response.data.user)
      //setFlashMessage(response.data.message, "success")
      navigate("/user/account")
    } else {
      setFlashMessage(response.message, "error")
    }
    return response
  }

  /**
   * Realiza logout do usuário.
   *
   * @returns {Promise<Object>} Resposta da API.
   */
  async function logout() {
    const response = await requestData("/user/logout", "POST", {}, true)
    if (response.success) {
      setAuthenticated(false)
      setUser(null)
      setFlashMessage(response.data.message, "success")
      navigate("/")
    } else {
      setFlashMessage(response.message, "error")
    }
    return response
  }


  /**
   * Atualiza os dados do usuário autenticado.
   *
   * @param {number} user_id - ID do usuário a ser atualizado.
   * @param {Object} userData - Dados do usuário a atualizar.
   * @returns {Promise<Object>} Resposta da API.
   */
  async function updateUser(user_id, userData) {
    const formData = new FormData()
    Object.keys(userData).forEach((key) => {
      if (key === "photo" && userData.photo instanceof File) {
        formData.append("photo", userData.photo)
      } else {
        formData.append(key, userData[key])
      }
    })

    const response = await requestData(`/user/${user_id}`, "PATCH", formData, true)
    if (response.success) {
      setUser(response.data.user)
      setFlashMessage(response.data.message, "success")
    } else {
      setFlashMessage(response.message, "error")
    }

    return response
  }


  /**
   * Realiza logout local, sem chamada à API.
   * Apenas limpa o estado de autenticação e usuário.
   */
  function localLogout() {
    setAuthenticated(false)
    setUser(null)
  }

  return { login, register, logout, updateUser, localLogout }
}
