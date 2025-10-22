import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"
import useFlashMessage from "../hooks/useFlashMessage"

/**
 * @file StudentRoute.jsx
 * @description Componente de rota protegida que restringe o acesso apenas a usuários
 * com papel de **Aluno** ou **Administrador**. Caso o usuário não esteja autenticado
 * ou não tenha o papel permitido, ele é redirecionado e recebe uma mensagem de erro.
 *
 * @module routes/StudentRoute
 */

/**
 * @component StudentRoute
 * @description Rota protegida exclusiva para usuários com função de aluno (role = 4)
 * ou administrador (role = 1).  
 * Este componente é utilizado dentro do sistema de rotas do React Router,
 * garantindo que apenas usuários autorizados acessem determinadas páginas.
 *
 * - Se o usuário **não estiver logado**, é redirecionado para `/login`.
 * - Se o usuário **não tiver o papel correto**, é redirecionado para `/` com uma mensagem de erro.
 * - Caso contrário, o conteúdo da rota é exibido normalmente via `<Outlet />`.
 *
 * @example
 * ```jsx
 * import { Routes, Route } from "react-router-dom"
 * import StudentRoute from "./routes/StudentRoute"
 * import DashboardAluno from "./pages/aluno/DashboardAluno"
 *
 * function AppRoutes() {
 *   return (
 *     <Routes>
 *       <Route element={<StudentRoute />}>
 *         <Route path="/aluno/dashboard" element={<DashboardAluno />} />
 *       </Route>
 *     </Routes>
 *   )
 * }
 * ```
 *
 * @returns {JSX.Element} Redireciona ou renderiza o conteúdo da rota conforme as permissões do usuário.
 */
function StudentRoute() {
  /**
   * @constant {Function} setFlashMessage - Função responsável por exibir mensagens de feedback ao usuário.
   * Proveniente do hook personalizado `useFlashMessage`.
   */
  const { setFlashMessage } = useFlashMessage()

  /**
   * @constant {Object|null} user - Objeto do usuário autenticado obtido via `UserContext`.
   * Contém informações como nome, e-mail e nível de permissão (`role`).
   * @property {number} role - Define o tipo de usuário (ex: 1 = admin, 4 = aluno).
   */
  const { user } = useContext(UserContext)

  console.log("user no context:", user)

  /**
   * Caso o usuário não esteja logado, redireciona para a página de login.
   */
  if (!user) {
    return <Navigate to="/login" />
  }

  /**
   * Caso o usuário não tenha permissão (não seja aluno nem admin),
   * exibe uma mensagem de erro e o redireciona para a página inicial.
   */
  if (user.role !== 4 && user.role !== 1) {
    setFlashMessage("Rota destinada para alunos", "error")
    return <Navigate to="/" />
  }

  /**
   * Se o usuário tiver permissão, renderiza o conteúdo interno da rota.
   */
  return <Outlet />
}

export default StudentRoute
