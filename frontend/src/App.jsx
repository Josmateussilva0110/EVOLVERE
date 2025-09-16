import { Routes, Route, useLocation } from "react-router-dom"
import Register from "./components/pages/auth/Register"
import Login from "./components/pages/auth/Login"
import Home from "./components/pages/Home"
import Profile from "./components/pages/Profile"
import FlashMessage from "./components/layout/Message"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/NavBar"
import Container from "./components/layout/Container"
import PrivateRoute from "./context/PrivateRouter"

function App() {
  const location = useLocation()

  // Rotas onde NÃO deve aparecer Navbar e Footer
  const hideLayout = ["/login", "/register"].includes(location.pathname)

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

          {/* Rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Container>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
