import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Sparkles, Star } from "lucide-react"
import Input from "../../form/Input"
import { Context } from "../../../context/UserContext"

/**
 * Componente de Login.
 *
 * Exibe um formulário de autenticação com campos de e-mail e senha,
 * além de botões para login, voltar, criar conta e acessar a central de ajuda.
 *
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
function Login() {
  const [user, setUser] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(Context)
  const navigate = useNavigate()

  /**
   * Atualiza o estado `user` conforme o usuário digita nos campos.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de mudança no input.
   */
  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  /**
   * Envia o formulário de login.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} event - Evento de envio do formulário.
   */
  async function submitForm(event) {
    event.preventDefault()
    login(user)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#1a1a5e] to-[#2d2d8a] relative overflow-hidden flex items-center justify-center px-4 sm:px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 sm:w-80 sm:h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 max-w-[90vw] max-h-[90vw] bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-16 left-6 sm:top-20 sm:left-10 animate-pulse">
        <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400/30" />
      </div>
      <div className="absolute top-36 right-10 sm:top-40 sm:right-20 animate-bounce">
        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400/30" />
      </div>
      <div className="absolute bottom-36 left-6 sm:bottom-40 sm:left-20 animate-pulse">
        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400/30" />
      </div>
      <div className="absolute top-52 right-1/4 animate-bounce delay-1000">
        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400/40" />
      </div>

      {/* Botão Voltar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-2 px-3 py-2 text-white hover:text-yellow-400 transition-colors duration-300 backdrop-blur-sm bg-white/10 rounded-lg z-10"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Voltar</span>
      </button>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl
                w-full max-w-[90vw] sm:max-w-[400px] md:max-w-[480px]
                p-4 sm:p-5 md:p-6 text-center relative z-10">
        {/* Logo/Badge */}
        <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-yellow-400/20 text-yellow-600 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-5">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Bem-vindo de volta!
        </div>

        {/* Título */}
        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-[#060060] mb-4 sm:mb-5 leading-tight">
          Faça login na sua <br />
          <span className="text-yellow-500">conta</span>
        </h2>

        <form onSubmit={submitForm} className="space-y-3 sm:space-y-4">
          <Input
            text=""
            type="email"
            name="email"
            placeholder="Insira seu endereço de e-mail"
            handleOnChange={handleChange}
            className="w-full"
          />

          <div className="relative">
            <Input
              text=""
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Digite sua senha"
              handleOnChange={handleChange}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
            </button>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot_password")}
              className="text-xs sm:text-sm text-[#060060] hover:text-yellow-500 transition-colors font-medium"
            >
              Esqueci a senha
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 bg-yellow-400 text-[#060060] font-bold rounded-xl 
                 hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25
                 flex items-center justify-center space-x-2 group"
          >
            <span>Iniciar sessão</span>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-2.5 sm:py-3 bg-white border-2 border-[#060060] text-[#060060] font-bold rounded-xl 
                 hover:bg-[#060060] hover:text-white transition-all duration-300
                 flex items-center justify-center space-x-2 group"
          >
            <span>Criar conta</span>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-4 sm:mt-5 p-2 sm:p-3 bg-gray-50 rounded-xl">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            Está com problemas para entrar?
          </p>
          <button
            type="button"
            onClick={() => navigate("/help")}
            className="text-xs sm:text-sm text-[#060060] font-semibold hover:text-yellow-500 transition-colors
                 flex items-center justify-center space-x-1 sm:space-x-2 mx-auto"
          >
            <span>Central de Ajuda</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default Login
