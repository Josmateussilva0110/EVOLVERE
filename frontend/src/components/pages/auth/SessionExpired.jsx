import { useNavigate } from "react-router-dom"


/**
 * Componente de aviso de sessão expirada.
 *
 * Exibe uma mensagem informando ao usuário que a sessão expirou
 * e fornece um botão para redirecionar à tela de login.
 *
 * Recursos:
 * - Mensagem de destaque em vermelho indicando que a sessão expirou.
 * - Texto explicativo pedindo para o usuário realizar login novamente.
 * - Botão estilizado que redireciona para a rota `/login` ao ser clicado.
 *
 * Hooks utilizados:
 * - `useNavigate` do `react-router-dom` para redirecionamento.
 *
 * @component
 * @example
 * // Uso em rotas protegidas quando o token de sessão expira
 * import SessionExpired from "./pages/auth/SessionExpired";
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/session-expired" element={<SessionExpired />} />
 *     </Routes>
 *   );
 * }
 *
 * @returns {JSX.Element} Tela de sessão expirada com redirecionamento para login.
 */
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
