import { Link } from 'react-router-dom'
import { useContext, useState, useEffect} from 'react'
import { Context } from '../../context/UserContext'
import { ChevronDown } from 'lucide-react'
import Image from '../form/Image'
import requestData from '../../utils/requestApi'


function Navbar() {
  const { authenticated, logout, user } = useContext(Context)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [requestUser, setRequestUser] = useState(null)


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
      <Link to="/" className="text-xl font-bold text-white hover:text-yellow-300">Home</Link>

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
