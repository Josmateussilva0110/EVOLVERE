import { useNavigate } from "react-router-dom"

function SessionExpired() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-red-600">
        Sua sessão expirou
      </h1>
      <p className="mb-6 text-gray-700">
        Por favor, faça login novamente para continuar.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white 
           hover:bg-blue-700 transform hover:-translate-y-1 
           transition-transform duration-200 ease-in-out"
      >
        Ir para login
      </button>
    </div>
  )
}

export default SessionExpired
