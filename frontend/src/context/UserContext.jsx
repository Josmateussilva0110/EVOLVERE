import { createContext, useState, useEffect } from "react"
import requestData from "../utils/requestApi"
import useAuth from "../hooks/useAuth"

const Context = createContext()

export function UserProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  const { login, register, logout, updateUser, localLogout } = useAuth({ setAuthenticated, setUser })

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
