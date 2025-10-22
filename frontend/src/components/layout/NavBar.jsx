import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect, useRef } from 'react'
import { Context } from '../../context/UserContext'
import { ChevronDown, User, LogOut, UserCircle2, GraduationCap, BookOpen, Shield, Settings } from 'lucide-react'
import Image from '../form/Image'
import requestData from '../../utils/requestApi'


/**
 * Componente de navegação principal (Navbar).
 *
 * Exibe o logotipo, links de autenticação ou menu do usuário,
 * dependendo do estado de autenticação.
 *
 * Funcionalidades:
 * - Se o usuário não estiver autenticado:
 *   - Mostra links para **Registrar** e **Login**.
 * - Se o usuário estiver autenticado:
 *   - Busca os dados do usuário autenticado (nome, foto).
 *   - Mostra saudação com nome ou foto de perfil.
 *   - Exibe um menu dropdown com opções:
 *     - **Perfil**
 *     - **Sair**
 *
 * Hooks utilizados:
 * - `useContext(Context)`: obtém informações de autenticação, usuário e função de logout.
 * - `useState`: controla abertura/fechamento do dropdown e dados requisitados do usuário.
 * - `useEffect`: faz requisição para carregar os dados do usuário sempre que `user` mudar.
 *
 * Dependências externas:
 * - `react-router-dom/Link`: navegação entre páginas.
 * - `lucide-react/ChevronDown`: ícone do menu dropdown.
 * - `requestData`: utilitário para requisições HTTP autenticadas.
 * - `Image`: componente customizado para exibir imagens.
 *
 * @component
 * @example
 * return (
 *   <Navbar />
 * )
 *
 * @returns {JSX.Element} Barra de navegação fixa no topo com logotipo, links ou menu do usuário.
 */
function Navbar() {
  const { authenticated, logout, user } = useContext(Context)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [requestUser, setRequestUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // 🔹 Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [dropdownOpen])

  // 🔹 Busca dados do usuário
  useEffect(() => {
    if (user) {
      async function fetchUser() {
        const response = await requestData(`/user/${user.id}`, "GET", {}, true)
        if (response.success) setRequestUser(response.data.user)
        else setRequestUser(null)
      }
      fetchUser()
    }
  }, [user])


  // 🔹 Define cores conforme rota
  const path = location.pathname
  const bgColor =
    path.startsWith('/teacher') ? 'bg-[#1A2434]' :
    path.startsWith('/student') ? 'bg-green-900' :
    path.startsWith('/coordinator') ? 'bg-gray-900' :
    path.startsWith('/about') ? 'bg-[#15165E]' :
    path === '/' ? 'bg-[#15165E]' :
    'bg-transparent'

  const dropdownColorMap = {
    'bg-[#1A2434]': 'bg-[#1A2434]/95 text-white',
    'bg-green-900': 'bg-green-900/95 text-white',
    'bg-gray-900': 'bg-gray-900/95 text-white',
    'bg-[#15165E]': 'bg-[#15165E]/95 text-white',
  }
  const dropdownColor = dropdownColorMap[bgColor] || 'bg-white text-gray-800'

  return (
    <nav className={`w-full top-0 left-0 z-50 transition-colors duration-500 ${bgColor}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* ---------- LOGO ---------- */}
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Evolvere Logo" size={48} />
          <h1 className="text-3xl font-bold text-white">Evolvere</h1>
        </div>

        {/* ---------- SEÇÃO DIREITA ---------- */}
        <div className="flex items-center space-x-4 relative">
          {!authenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 bg-yellow-400 text-[#060060] font-bold rounded-xl hover:bg-yellow-500 transition-all duration-300"
              >
                Começar
              </button>
            </>
          ) : (
            <div ref={dropdownRef} className="relative flex items-center gap-2">
              {/* Avatar + Nome */}
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                {requestUser?.photo ? (
                  <Image
                    src={`${import.meta.env.VITE_BASE_URL}/${requestUser.photo}`}
                    alt={requestUser.username || "Foto do usuário"}
                    size={48}
                    className="rounded-full border-2 border-white/30"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full">
                    <User className="text-white" size={28} />
                  </div>
                )}
                <ChevronDown
                  className={`text-white transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                  size={20}
                />
              </div>

              {/* ---------- DROPDOWN ---------- */}
              <div
                className={`absolute right-0 top-[72px] w-64 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden transform transition-all duration-300 ease-out origin-top-right z-[9999]
                ${dropdownOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'} 
                ${dropdownColor}`}
              >
                <button
                  onClick={() => {
                    navigate("/profile")
                    setDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all duration-200"
                >
                  <UserCircle2 size={18} /> Perfil
                </button>

                {(requestUser?.role === 'Coordenador' || requestUser?.registration === 'admin') && (
                  <button
                    onClick={() => {
                      navigate("/coordinator")
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all duration-200"
                  >
                    <Shield size={18} /> Área do Coordenador
                  </button>
                )}

                {(requestUser?.role === 'Professor' || requestUser?.registration === 'admin') ? (
                  <button
                    onClick={() => {
                      navigate("/teacher/discipline/manage")
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all duration-200"
                  >
                    <BookOpen size={18} /> Área do Professor
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/student/home")
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-all duration-200"
                  >
                    <GraduationCap size={18} /> Área do Aluno
                  </button>
                )}

                <div className="border-t border-white/10 my-1"></div>

                <button
                  onClick={() => {
                    logout()
                    setDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/20 text-red-400 transition-all duration-200"
                >
                  <LogOut size={18} /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
