import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"
import useFlashMessage from "../hooks/useFlashMessage"


/**
 * Componente de rota protegida para professores.
 * 
 * Este componente verifica se o usuário está autenticado e possui permissão de professor
 * antes de permitir o acesso às rotas internas (filhos). Caso o usuário não esteja logado,
 * ele será redirecionado para a página de login. Se o usuário estiver logado, mas não
 * tiver a role adequada, será exibida uma mensagem de erro e ele será redirecionado para a home.
 * 
 * @component
 * @example
 * // Uso com react-router-dom v6
 * <Route path="/teacher" element={<TeacherRoute />}>
 *   <Route path="dashboard" element={<TeacherDashboard />} />
 * </Route>
 * 
 * @returns {JSX.Element} - Retorna um <Outlet /> para renderizar as rotas filhas se a validação passar,
 * ou redireciona para "/login" ou "/" dependendo do estado do usuário.
 */
function TeacherRoute() {
  const { setFlashMessage } = useFlashMessage()
  const { user } = useContext(UserContext)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== 3 && user.role !== 1) {
    setFlashMessage('Rota destinada para professores', 'error')
    return <Navigate to="/" /> 
  }

  return <Outlet />
}

export default TeacherRoute
