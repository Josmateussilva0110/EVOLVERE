import { createContext, useState, useEffect } from "react"
import requestData from "../utils/requestApi"
import useAuth from "../hooks/useAuth"

const Context = createContext()

/**
 * Contexto de usuário da aplicação (UserContext).
 *
 * Fornece estado global de autenticação, informações do usuário
 * e funções para login, registro, logout e atualização de usuário.
 *
 * Funcionalidades:
 * - `authenticated`: booleano indicando se o usuário está autenticado.
 * - `user`: objeto com informações do usuário autenticado.
 * - `loading`: booleano indicando se a verificação de sessão está em andamento.
 * - `sessionExpired`: booleano indicando se a sessão expirou.
 * - `setSessionExpired`: função para atualizar o estado de sessão expirada.
 * - `login`, `register`, `logout`, `updateUser`, `localLogout`: funções de autenticação.
 *
 * Hooks utilizados:
 * - `useState` para gerenciar estado de autenticação, usuário, carregamento e sessão expirada.
 * - `useEffect` para:
 *    1. Verificar a sessão atual do usuário no carregamento inicial.
 *    2. Ouvir eventos de `SESSION_EXPIRED` e atualizar o estado.
 *
 * Dependências externas:
 * - `requestData`: função para requisições HTTP autenticadas.
 * - `useAuth`: hook customizado que fornece funções de autenticação.
 *
 * @component
 * @example
 * import { UserProvider } from "./context/UserContext";
 *
 * function App() {
 *   return (
 *     <UserProvider>
 *       <Routes>
 *         <Route path="/login" element={<Login />} />
 *         <Route path="/dashboard" element={<PrivateRoute />} />
 *       </Routes>
 *     </UserProvider>
 *   )
 * }
 *
 * @param {object} props - Propriedades do componente.
 * @param {React.ReactNode} props.children - Elementos filhos que terão acesso ao contexto.
 * 
 * @returns {JSX.Element} Provider que encapsula a aplicação e fornece contexto de usuário.
 */
export function UserProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  const { login, register, logout, updateUser, localLogout } = useAuth({ setAuthenticated, setUser })

/**
 * useEffect principal: verifica a sessão do usuário ao carregar o provedor.
 *
 * - Chama a API `/user/session` para validar a sessão atual.
 * - Atualiza `authenticated` e `user` conforme o resultado.
 * - Caso a sessão seja inválida, define `sessionExpired` como true.
 * - Atualiza `loading` para false após a verificação.
 *
 * @hook
 * @example
 * useEffect(() => {
 *   async function checkSession() {
 *     const response = await requestData("/user/session", "GET", {}, true)
 *     if (response.success) {
 *       setAuthenticated(true)
 *       setUser(response.data.user)
 *     } else {
 *       setAuthenticated(false)
 *       setUser(null)
 *       setSessionExpired(true)
 *     }
 *     setLoading(false)
 *   }
 *   checkSession()
 * }, [])
 */
  useEffect(() => {
    async function checkSession() {
      const response = await requestData("/user/session", "GET", {}, true)
      if (response.success) {
        setAuthenticated(true)
        setUser(response.data.user)
      } else {
        setAuthenticated(false)
        setUser(null)
        setSessionExpired(true)
      }
      setLoading(false)
    }
    checkSession()
  }, [])

/**
 * useEffect de monitoramento de evento `SESSION_EXPIRED`.
 *
 * - Escuta eventos globais de sessão expirada (`window.addEventListener`).
 * - Ao disparar o evento, atualiza:
 *   - `sessionExpired` para true
 *   - `authenticated` para false
 *   - `user` para null
 * - Remove o listener ao desmontar o componente.
 *
 * @hook
 * @example
 * useEffect(() => {
 *   function handleExpired() {
 *     setSessionExpired(true)
 *     setUser(prev => {
 *       if (prev) {
 *         setAuthenticated(false)
 *         return null
 *       }
 *       return prev
 *     })
 *   }
 *
 *   window.addEventListener("SESSION_EXPIRED", handleExpired)
 *   return () => window.removeEventListener("SESSION_EXPIRED", handleExpired)
 * }, [localLogout])
 */
  useEffect(() => {
    function handleExpired() {
      setSessionExpired(true)
      setUser(prev => {
        if (prev) {
          setAuthenticated(false)
          return null
        }
        return prev
      })
    }


    window.addEventListener("SESSION_EXPIRED", handleExpired)
    return () => window.removeEventListener("SESSION_EXPIRED", handleExpired)
  }, [localLogout])

  return (
    <Context.Provider
      value={{
        authenticated,
        user,
        loading,
        sessionExpired,
        setSessionExpired,
        login,
        register,
        logout,
        updateUser,
        localLogout,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export { Context }
