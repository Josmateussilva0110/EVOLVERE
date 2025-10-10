import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"
import useFlashMessage from "../hooks/useFlashMessage"



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
