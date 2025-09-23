import { Link } from 'react-router-dom'
import { useContext, useState, useEffect} from 'react'
import { Context } from '../../context/UserContext'
import { ChevronDown } from 'lucide-react'
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


  /**
   * Efeito colateral responsável por buscar os dados do usuário autenticado.
   *
   * - Executa sempre que o valor de `user` mudar.
   * - Se existir um usuário válido (`user`), faz uma requisição GET para
   *   a rota `/user/:id` usando o utilitário `requestData`.
   * - Caso a resposta seja bem-sucedida (`response.success === true`),
   *   armazena os dados do usuário em `requestUser`.
   * - Caso contrário, limpa o estado (`setRequestUser(null)`).
   *
   * @function useEffect
   * @dependency [user] → dispara sempre que o objeto `user` mudar.
   */
  useEffect(() => {
    if(user) {
      async function fetchUser() {
        const response = await requestData(`/user/${user.id}`, "GET", {}, true)
        if (response.success) {
          setRequestUser(response.data.user)
        } else {
          setRequestUser(null)
        }
      }
      fetchUser()
      }
  }, [user])

  return (
    <nav className="bg-[#060060] shadow-md px-6 py-4 flex justify-between items-center">
    <Link to="/">
      <Image src="/logo.png" alt="logo" size={70} />
    </Link>

      <ul className="flex items-center space-x-6">
        {!authenticated ? (
          <>
            <li><Link to="/register" className="text-white hover:text-yellow-300">Registrar</Link></li>
            <li><Link to="/login" className="text-white hover:text-yellow-300">Login</Link></li>
          </>
        ) : (
          <li className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-600 font-medium"
            >
              {requestUser?.photo ? (
                <Image src={`${import.meta.env.VITE_API_URL}images/users/${requestUser.photo}`} alt={requestUser?.username} size={55}/>
              ) : (
                <span>Olá, {requestUser?.username}</span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-red-100" onClick={() => setDropdownOpen(false)}>Perfil</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100">Sair</button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}


export default Navbar
