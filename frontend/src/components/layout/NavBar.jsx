import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useContext, useState, useEffect } from 'react'
import { Context } from '../../context/UserContext'
import { ChevronDown, User } from 'lucide-react'
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

  useEffect(() => {
    if (user) {
      async function fetchUser() {
        const response = await requestData(`/user/${user.id}`, "GET", {}, true)
        console.log(response)
        if (response.success) setRequestUser(response.data.user)
        else setRequestUser(null)
      }
      fetchUser()
    }
  }, [user])


  const path = location.pathname
  const bgColor =
    path.startsWith('/teacher') ? 'bg-[#1A2434]' :
    path.startsWith('/student') ? 'bg-green-900' :
    path.startsWith('/coordinator') ? 'bg-gray-900' :
    path === '/' ? 'bg-[#15165E]' :
    'bg-transparent'

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
              {/* 🔹 Se não estiver logado, mostra os botões */}
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
            <>

              {/* 🔹 Se estiver logado, mostra a foto de perfil ou ícone padrão */}
              <div className="relative flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2"
                >
                  {requestUser?.photo ? (
                    <Image
                      src={`${import.meta.env.VITE_BASE_URL}/${requestUser.photo}`}
                      alt={requestUser.username || "Foto do usuário"}
                      size={58}
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full">
                      <User className="text-white" size={40} />
                    </div>
                  )}
                  <ChevronDown className="text-white" size={20} />
                </div>

                {/* 🔹 Menu dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-[72px] w-60 bg-white text-gray-800 rounded-xl shadow-lg py-2 z-50
      before:content-[''] before:absolute before:-top-2 before:right-4 before:border-8 before:border-transparent before:border-b-white"
                  >
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Perfil
                    </button>
                    
                    {(requestUser?.role === 'Coordenador' || requestUser?.registration === 'admin') && (
                      <button
                        onClick={() => navigate("/coordinator")}
                        className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                      >
                        área do Coordenador
                      </button>

                    )}

                    {(requestUser?.role === 'Professor' || requestUser?.registration === 'admin') ? (
                      <button
                        onClick={() => navigate("/teacher/discipline/manage")}
                        className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                      >
                        área do Professor
                      </button>

                    ) : (
                      <button
                        onClick={() => navigate("/student/home")}
                        className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                      >
                        área do Aluno
                      </button>
                    )}


                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
