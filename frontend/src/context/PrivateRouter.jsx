import { useContext } from "react"
import { Outlet } from "react-router-dom"
import { Context as UserContext } from "./UserContext"
import SessionExpired from "../components/pages/auth/SessionExpired"

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
