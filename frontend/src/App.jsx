import { useLocation } from "react-router-dom"
import FlashMessage from "./components/layout/Message"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/NavBar"
import Container from "./components/layout/Container"
import AppRoutes from "./routes/Index"

function App() {
  const location = useLocation()
  const isCoordinator = location.pathname.startsWith("/coordinator")
  const hideLayout = isCoordinator || [
    "/login", "/register", "/forgot_password", "/help", "/", "/about",
    "/await/approval", "/user/account", "/student/home", "/student/disciplines/view"
  ].includes(location.pathname) || location.pathname.startsWith("/teacher")

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
