import { Routes, Route, useLocation } from "react-router-dom"
import Register from "./components/pages/auth/Register"
import Login from "./components/pages/auth/Login"
import Home from "./components/pages/public/Home"
import About from "./components/pages/public/About"
import Profile from "./components/pages/Profile"
import UserAccount from "./components/pages/auth/UserAccount"
import FlashMessage from "./components/layout/Message"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/NavBar"
import Container from "./components/layout/Container"
import PrivateRoute from "./context/PrivateRouter"
import ManagementDisciplines from "./components/pages/coordinator/DisciplineManagement"
import DisciplineList from "./components/pages/coordinator/ListDisciplines" 

/**
 * Componente principal da aplicação Evolvere.
 * 
 * Gerencia o roteamento global e a renderização condicional de componentes de layout.
 * Define quais páginas devem exibir o Navbar e Footer, e quais devem ter layout próprio.
 * 
 * Estrutura de roteamento:
 * - Rotas públicas: login, register, home, about, user/account
 * - Rotas privadas: profile, disciplinas/teste (requer autenticação)
 * 
 * @returns {JSX.Element} Componente principal da aplicação
 */
function App() {
  const location = useLocation()

  // Rotas onde NÃO deve aparecer Navbar e Footer
  const hideLayout = ["/login", "/register", "/user/account", "/", "/about"].includes(location.pathname)

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
          <Route path="/about" element={<About />} />
          <Route path="/user/account" element={<UserAccount/>} />

          {/* Rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/ManagementDisciplines/registerdisciplines" element={<ManagementDisciplines />} />
            <Route path="/ManagementDisciplines/listdisciplines" element={<DisciplineList />} />
          </Route>
          
        </Routes>
      </Container>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
