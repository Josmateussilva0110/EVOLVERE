import { useLocation } from "react-router-dom"
import FlashMessage from "./components/layout/Message"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/NavBar"
import Container from "./components/layout/Container"
import AppRoutes from "./routes/Index"

/**
 * @component App
 * @description Componente raiz da aplicação que gerencia a renderização
 * da barra de navegação, rodapé, container principal e mensagens flash
 * dependendo da rota atual.
 *
 * - Oculta Navbar e Footer em rotas específicas, incluindo rotas de coordenador,
 *   rotas estáticas e padrões dinâmicos.
 *
 * @returns {JSX.Element} Estrutura principal da aplicação com layout condicional.
 */
function App() {
  const location = useLocation()
  const path = location.pathname

  const isCoordinator = path.startsWith("/coordinator")

  // Lista de rotas exatas
  const staticPaths = [
    "/login", "/register", "/forgot_password", "/help",
    "/teacher/material/register", "/teacher/class/view",
    "/await/approval", "/user/account", "/student/home",
    "/student/disciplines/view",
    "/profile", "/settings", "/teacher/simulated/register",
    "/teacher/simulated/list", "/teacher/simulated/response/list"
  ]

  // Regex para rotas dinâmicas
  const dynamicPatterns = [
    /^\/teacher\/discipline\/list\/[^/]+$/,
    /^\/teacher\/material\/register\/[^/]+$/,
  ]

  const hideLayout =
    isCoordinator ||
    staticPaths.includes(path) ||
    dynamicPatterns.some((regex) => regex.test(path))

  return (
    <>
      {!hideLayout && <Navbar />}
      <Container>
        <FlashMessage />
        <AppRoutes />
      </Container>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
