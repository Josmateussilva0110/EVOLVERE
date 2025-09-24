import { Routes, Route, useLocation } from "react-router-dom"
import Register from "./components/pages/auth/Register"
import Login from "./components/pages/auth/Login"
import ForgotPassword from "./components/pages/auth/ForgotPassword"
import HelpCenter from "./components/pages/auth/HelpCenter"
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
import AccountValidation from './components/pages/auth/Waiting'
import ViewCourses from "./components/pages/coordinator/ViewCourses"
import ListStrudents from "./components/pages/coordinator/ListStudents"
import ManageTeachers from "./components/pages/coordinator/ManageTeachers"
import ManageCourses from "./components/pages/coordinator/ManageCourses"
import Coordinator from "./components/pages/coordinator/Coordinator"


/**
 * Componente raiz da aplicação Evolvere.
 *
 * Responsável por:
 * - Configurar todas as rotas públicas e privadas usando `react-router-dom`.
 * - Exibir Navbar e Footer apenas em páginas públicas específicas.
 * - Renderizar mensagens flash em todas as páginas.
 *
 * Rotas públicas:
 * - "/" → Home
 * - "/about" → About
 * - "/login" → Login
 * - "/register" → Register
 * - "/forgot_password" → ForgotPassword
 * - "/help" → HelpCenter
 * - "/user/account" → UserAccount
 * - "/await/approval" → AccountValidation
 *
 * Rotas privadas (protegidas pelo `PrivateRoute`):
 * - "/profile" → Profile
 * - "/management/disciplines/register" → ManagementDisciplines
 * - "/management/disciplines/list" → DisciplineList
 *
 * @component
 * @example
 * return (
 *   <App />
 * )
 *
 * @returns {JSX.Element} Estrutura de roteamento da aplicação com layout condicional.
 */
function App() {
  const location = useLocation()
  // Rotas onde NÃO deve aparecer Navbar e Footer
  const hideLayout = ["/login", "/register", "/forgot_password", "/help", "/", "/about", "/await/approval", "/user/account"].includes(location.pathname)


  return (
    <>
      {!hideLayout && <Navbar />}
      <Container>
        <FlashMessage />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/account" element={<UserAccount/>} />
          <Route path="/await/approval" element={<AccountValidation/>} />


          {/* Rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/management/coordinator/discipline/register" element={<ManagementDisciplines />} />
            <Route path="/management/coordinator/discipline/list" element={<DisciplineList />} />
            <Route path="/management/coordinator/course/view" element={<ViewCourses />} />
            <Route path="/management/coordinator/student/list" element={<ListStrudents />} />
            <Route path="/management/coordinator/teacher/manage" element={<ManageTeachers />} />
            <Route path="/management/coordinator/course/manage" element={<ManageCourses />} />
            <Route path="/management/coordinator" element={<Coordinator />} />

          </Route>
          
        </Routes>
      </Container>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
