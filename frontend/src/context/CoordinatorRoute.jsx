import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"

function CoordinatorRoute() {
  const { user } = useContext(UserContext)

  console.log('user in contex: ', user)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (user.role !== 2 && user.role !== 1) {
    return <Navigate to="/" /> 
  }

  return <Outlet />
}

export default CoordinatorRoute
