import { Routes, Route, useLocation } from "react-router-dom"
import Register from "./components/pages/auth/Register"
import Login from "./components/pages/auth/Login"
import Home from "./components/pages/Home"
import Profile from "./components/pages/Profile"
import UserAccount from "./components/pages/auth/UserAccount"
import FlashMessage from "./components/layout/Message"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/NavBar"
import Container from "./components/layout/Container"
import PrivateRoute from "./context/PrivateRouter"
import ManagementDisciplines from "./components/pages/coordinator/Discipline management" 

function App() {
  const location = useLocation()

  // Rotas onde NÃO deve aparecer Navbar e Footer
  const hideLayout = ["/login", "/register", "/user/account"].includes(location.pathname)

  return (
    <>
      {!hideLayout && <Navbar />}
      <Container>
        <FlashMessage />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/user/account" element={<UserAccount/>} />

          {/* Rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/disciplinas/teste" element={<ManagementDisciplines />} />
          </Route>
        </Routes>
      </Container>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
