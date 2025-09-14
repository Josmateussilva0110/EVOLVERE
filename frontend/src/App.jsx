import { Routes, Route } from 'react-router-dom'
import Register from './components/pages/Auth/register'
import FlashMessage from './components/layout/Message'
import Profile from './components/pages/Auth/Profile'
import Home from './components/pages/Auth/home'
import Login from './components/pages/Auth/Login'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/NavBar'
import Container from './components/layout/Container'
import PokemonDetail from './components/pages/Auth/PokemonDetail'
import PrivateRoute from "./context/PrivateRouter"

function App() {

  return (
    <>
      <Navbar/>
      <Container>
        <FlashMessage/>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/detail/:pokemon_id" element={<PokemonDetail />} />

          {/* Rotas privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Container>
      <Footer/>
    </>
  )
}

export default App
