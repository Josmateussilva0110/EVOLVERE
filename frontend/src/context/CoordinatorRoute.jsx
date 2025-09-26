import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"


/**
 * Componente CoordinatorRoute
 * 
 * Rota protegida para áreas destinadas a coordenadores acadêmicos.
 * Utiliza o contexto de usuário para determinar se o acesso é permitido.
 * 
 * Comportamento:
 * - Se não houver usuário logado (`user` é null ou undefined), redireciona para a página de login (`/login`).
 * - Se o usuário logado não tiver a função de coordenador (`role` diferente de 1 ou 2), redireciona para a página inicial (`/`).
 * - Caso contrário, renderiza os componentes filhos através do <Outlet />, permitindo o acesso à rota protegida.
 * 
 * Observações:
 * - `user.role` deve ser definido como:
 *   - 1 ou 2 → coordenador com diferentes níveis de permissão
 *   - outros valores → não têm acesso às rotas de coordenador
 * 
 * @component
 * @returns {JSX.Element} Componente <Outlet /> se autorizado, ou <Navigate /> se não autorizado
 */
function CoordinatorRoute() {
  const { user } = useContext(UserContext)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== 2 && user.role !== 1) {
    return <Navigate to="/" /> 
  }

  return <Outlet />
}

export default CoordinatorRoute
