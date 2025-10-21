import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"
import useFlashMessage from "../hooks/useFlashMessage"



function StudentRoute() {
  const { setFlashMessage } = useFlashMessage()
  const { user } = useContext(UserContext)

  console.log('user no context: ',user)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== 4 && user.role !== 1) {
    setFlashMessage('Rota destinada para alunos', 'error')
    return <Navigate to="/" /> 
  }

  return <Outlet />
}

export default StudentRoute
