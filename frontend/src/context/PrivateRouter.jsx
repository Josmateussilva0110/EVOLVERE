import { useContext } from "react"
import { Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"
import SessionExpired from "../components/pages/auth/SessionExpired"


/**
 * Componente de rota privada.
 *
 * Funciona como um wrapper para rotas que requerem autenticação.
 * - Exibe uma mensagem de carregamento enquanto a sessão é verificada.
 * - Se o usuário não estiver autenticado, redireciona ou exibe uma tela de sessão expirada.
 * - Se o usuário estiver autenticado, renderiza o conteúdo das rotas filhas via `<Outlet />`.
 *
 * Hooks utilizados:
 * - `useContext(UserContext)` para acessar informações de autenticação e estado de carregamento.
 *
 * Componentes internos:
 * - `SessionExpired`: tela exibida quando a sessão do usuário não é válida.
 * - `Outlet`: usado pelo React Router para renderizar rotas filhas.
 *
 * @component
 * @example
 * // Uso dentro do React Router v6
 * <Routes>
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/profile" element={<Profile />} />
 *   </Route>
 * </Routes>
 *
 * @returns {JSX.Element} Componente que controla acesso a rotas privadas.
 */
function PrivateRoute() {
  const { authenticated, loading } = useContext(UserContext)

  if (loading) {
    return <p>Carregando sessão...</p>
  }

  if (!authenticated) {
    return <SessionExpired />
  }

  return <Outlet />
}

export default PrivateRoute
