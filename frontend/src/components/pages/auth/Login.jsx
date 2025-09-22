import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Sparkles, Star } from "lucide-react"
import Input from "../../form/Input"
import { Context } from "../../../context/UserContext"

function Login() {
  const [user, setUser] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(Context)
  const navigate = useNavigate()

  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  async function submitForm(event) {
    event.preventDefault()
    login(user)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#1a1a5e] to-[#2d2d8a] relative overflow-hidden flex items-center justify-center px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-pulse">
        <Mail className="w-8 h-8 text-yellow-400/30" />
      </div>
      <div className="absolute top-40 right-20 animate-bounce">
        <Lock className="w-6 h-6 text-blue-400/30" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse">
        <Sparkles className="w-7 h-7 text-purple-400/30" />
      </div>
      <div className="absolute top-60 right-1/3 animate-bounce delay-1000">
        <Star className="w-5 h-5 text-yellow-400/40" />
      </div>

      {/* Botão Voltar */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 text-white hover:text-yellow-400 transition-colors duration-300 backdrop-blur-sm bg-white/10 rounded-lg z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 md:p-16 w-full max-w-md text-center relative z-10">
        {/* Logo/Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-yellow-400/20 text-yellow-600 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          Bem-vindo de volta!
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#060060] mb-8 leading-tight">
          Faça login na sua <br />
          <span className="text-yellow-500">conta</span>
        </h2>

        <form onSubmit={submitForm} className="space-y-6">
          <div className="space-y-5">
            <div className="relative">
              <Input
                text=""
                type="email"
                name="email"
                placeholder="Insira seu endereço de e-mail"
                handleOnChange={handleChange}
              />
            </div>

            <div className="relative">
              <Input
                text=""
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Digite sua senha"
                handleOnChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot_password")}
                className="text-sm text-[#060060] hover:text-yellow-500 transition-colors font-medium"
              >
                Esqueci a senha
              </button>
            </div>
          </div>

          {/* Botão Iniciar sessão */}
          <button
            type="submit"
            className="w-full py-4 bg-yellow-400 text-[#060060] font-bold rounded-xl 
                       hover:bg-yellow-500 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25
                       flex items-center justify-center space-x-2 group"
          >
            <span>Iniciar sessão</span>
            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Botão Criar conta */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-4 bg-white border-2 border-[#060060] text-[#060060] font-bold rounded-xl 
                       hover:bg-[#060060] hover:text-white transition-all duration-300
                       flex items-center justify-center space-x-2 group"
          >
            <span>Criar conta</span>
            <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-2">
            Está com problemas para entrar?
          </p>
          <button
            type="button"
            onClick={() => navigate("/help")}
            className="text-[#060060] font-semibold hover:text-yellow-500 transition-colors
                       flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Central de Ajuda</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login