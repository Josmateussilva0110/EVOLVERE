import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import Input from "../../form/Input"
import Image from "../../form/Image"
import { useState, useContext } from "react"
import { Context } from "../../../context/UserContext"
import TermsModal from "./TermsModal"


/**
 * Componente de registro de usuários da aplicação Evolvere.
 *
 * Esta tela permite que novos usuários criem uma conta informando:
 * - Nome completo
 * - E-mail
 * - Senha e confirmação de senha
 *
 * Recursos:
 * - Botão para voltar à tela inicial.
 * - Link para redirecionar ao login caso o usuário já possua conta.
 * - Checkbox para aceitar os Termos de Serviço e Política de Privacidade (obrigatório para concluir o cadastro).
 * - Layout responsivo com duas seções:
 *   - Lado esquerdo (desktop): exibe a logo e um texto de boas-vindas.
 *   - Lado direito: contém o formulário de cadastro.
 *
 * Hooks utilizados:
 * - `useState` para controlar os dados do usuário, visibilidade das senhas e aceitação dos termos.
 * - `useContext` para acessar a função `register` do contexto global de autenticação.
 * - `useNavigate` do `react-router-dom` para redirecionamentos.
 *
 * @component
 * @example
 * // Uso básico dentro de uma rota React Router
 * import Register from "./pages/auth/Register";
 *
 * function App() {
 *   return (
 *     <Routes>
 *       <Route path="/register" element={<Register />} />
 *     </Routes>
 *   );
 * }
 *
 * @returns {JSX.Element} Formulário de registro de usuários.
 */
function Register() {
  const [user, setUser] = useState({})
  const [acceptedTerms, setAcceptedTerms] = useState(false) // checkbox
  const [isTermsOpen, setIsTermsOpen] = useState(false) // modal
  const { register } = useContext(Context)
  const navigate = useNavigate()


/**
 * Atualiza os dados do usuário no estado local conforme o input é digitado.
 *
 * @param {React.ChangeEvent<HTMLInputElement>} event - Evento disparado pelo input.
 * @param {string} event.target.name - Nome do campo que está sendo atualizado.
 * @param {string} event.target.value - Valor atual do campo.
 *
 * @returns {void} Atualiza o estado `user` com o novo valor.
 */
  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

/**
 * Função disparada ao submeter o formulário de registro.
 *
 * Previna o comportamento padrão do formulário e verifica se o usuário aceitou
 * os Termos de Serviço antes de chamar a função de registro do contexto.
 *
 * @param {React.FormEvent<HTMLFormElement>} e - Evento de submit do formulário.
 *
 * @returns {Promise<void>} Chama a função `register(user)` se os termos forem aceitos.
 */
  async function submitForm(e) {
    e.preventDefault()
    if (acceptedTerms) {
      register(user)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado Esquerdo */}
      <div className="hidden lg:flex relative basis-[35%] bg-white px-8 sm:px-16">
        <div className="absolute top-0 left-0">
          <Image src={"/logo_preto.png"} alt="Evolvere Logo" size={160} />
        </div>
        <div className="flex flex-col justify-center items-start w-full">
          <h1 className="text-5xl font-bold text-[#060060] mb-6 leading-tight mt-24">
            Seja <br /> Bem-Vindo(a)
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed max-w-sm">
            A Evolvere é o espaço onde aprendizado, prática e feedback se encontram.
            Inscreva-se e descubra como organizar seus estudos de forma clara, evoluir
            com constância e alcançar seus objetivos acadêmicos.
          </p>
        </div>
      </div>

      {/* Lado Direito */}
      <div className="flex justify-center items-center w-full lg:basis-[65%] bg-[#060060] px-6 sm:px-12 relative">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 text-white hover:text-yellow-400 transition-colors duration-300 backdrop-blur-sm bg-white/10 rounded-lg z-10 shadow-sm ring-1 ring-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-10 sm:p-12 md:p-14 w-full max-w-lg text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#060060] tracking-tight mb-3">
            Novo por aqui ?
          </h2>
          <p className="text-gray-600 mb-10 max-w-md mx-auto">
            Crie sua conta para organizar seus estudos e acompanhar sua evolução.
          </p>

          <form onSubmit={submitForm} className="space-y-5">
            <Input
              type="text"
              name="username"
              placeholder="Insira seu nome completo"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />
            <Input
              type="email"
              name="email"
              placeholder="Insira seu endereço de e-mail"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />
            <Input
              type="password"
              name="password"
              placeholder="Digite sua senha"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />
            <Input
              type="password"
              name="confirm_password"
              placeholder="Confirmar senha"
              handleOnChange={handleChange}
              className="text-lg py-3"
            />

            <button
              type="submit"
              className="w-full py-4 bg-yellow-400 text-[#060060] text-lg font-bold rounded-lg shadow-sm hover:bg-yellow-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-white"
            >
              Inscrever-se
            </button>
          </form>

          <p className="mt-4 text-base">
            Já está na Evolvere?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#060060] font-semibold underline decoration-[#060060]/30 underline-offset-4 hover:decoration-[#060060]"
            >
              Entrar
            </button>
          </p>

          {/* Checkbox e link para abrir modal */}
          <div className="flex items-center mt-6 text-left bg-gray-50 rounded-lg px-4 py-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mr-2 w-4 h-4 accent-yellow-400"
            />
            <label htmlFor="terms" className="text-base text-gray-600">
              Eu aceito os{" "}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)} // <-- abre modal
                className="font-semibold text-[#060060] underline decoration-[#060060]/30 underline-offset-4 hover:decoration-[#060060]"
              >
                Termos de Serviço
              </button>{" "}
              e a{" "}
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)} // <-- abre modal
                className="font-semibold text-[#060060] underline decoration-[#060060]/30 underline-offset-4 hover:decoration-[#060060]"
              >
                Política de Privacidade
              </button>{" "}
              da Evolvere
            </label>
          </div>

          {/* Modal de Termos */}
          <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
        </div>
      </div>
    </div>
  )
}

export default Register
