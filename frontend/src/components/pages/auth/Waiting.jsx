import { useNavigate } from "react-router-dom"
import { Hourglass } from "lucide-react"


/**
 * Componente de validação de conta.
 *
 * Exibe uma tela informando ao usuário que sua conta está em processo de validação
 * e que a equipe entrará em contato via e-mail em breve.
 *
 * Recursos:
 * - Título destacando o status da conta ("Conta em validação").
 * - Ícone de ampulheta animada com efeito visual de "aguarde".
 * - Mensagem explicando que as credenciais institucionais estão sendo verificadas.
 * - Link de suporte em destaque.
 * - Botão para retornar à tela de login.
 *
 * Hooks utilizados:
 * - `useNavigate` do `react-router-dom` para redirecionamento.
 *
 * @component
 * @example
 * // Uso dentro de uma rota
 * import AccountValidation from "./pages/auth/AccountValidation";
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/account-validation" element={<AccountValidation />} />
 *     </Routes>
 *   );
 * }
 *
 * @returns {JSX.Element} Tela informativa de conta em processo de validação.
 */
export default function AccountValidation() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0F68] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold text-[#0A0F68] mb-8">
          Conta em validação
        </h1>

        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Lua amarela */}
            <div className="absolute left-1 w-20 h-20 bg-yellow-400 rounded-full -z-10"></div>
            {/* Ampulheta animada */}
            <Hourglass size={60} className="text-[#0A0F68] animate-flip" />
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6">
          Estamos verificando suas credenciais institucionais. <br />
          Nossa equipe entrará em contato em breve via e-mail.
        </p>
    
        <p className="text-gray-900 font-semibold mb-10">
          Precisa de ajuda?{" "}
          <span className="text-gray-600 font-medium">Contate nosso suporte.</span>
        </p>

        <button
          onClick={() => navigate("/login")}
          className="text-sm text-[#0A0F68] hover:underline"
        >
          Voltar ao login
        </button>
      </div>
    </div>
  )
}
