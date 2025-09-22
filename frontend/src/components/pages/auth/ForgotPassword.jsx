import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Input from "../../form/Input"

/**
 * Componente da página "Esqueci a Senha" da aplicação Evolvere.
 * 
 * Permite que o usuário solicite a recuperação de senha através do email.
 * Inclui validação de email e feedback visual para o usuário.
 * 
 * @returns {JSX.Element} Componente React da página de recuperação de senha
 */
function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(event) {
    setEmail(event.target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    
    // Simular envio de email (aqui você integraria com sua API)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  if (isSubmitted) {
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
        <CheckCircle className="w-6 h-6 text-blue-400/30" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse">
        <ArrowLeft className="w-7 h-7 text-purple-400/30" />
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 md:p-16 w-full max-w-md text-center relative z-10">
        {/* Badge de sucesso */}
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-6">
          <CheckCircle className="w-4 h-4 mr-2" />
          Email enviado com sucesso!
        </div>

        {/* Ícone de sucesso */}
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#060060] mb-4">
          Email enviado!
        </h2>

        {/* Mensagem */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Enviamos um link de recuperação para <strong className="text-[#060060]">{email}</strong>. 
          Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
        </p>

        {/* Botões */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-yellow-400 text-[#060060] font-bold rounded-xl 
                       hover:bg-yellow-500 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25 group"
          >
            <span className="group-hover:translate-x-1 transition-transform inline-block">Voltar ao Login</span>
          </button>
          
          <button
            onClick={() => {
              setIsSubmitted(false)
              setEmail("")
            }}
            className="w-full py-4 bg-white border-2 border-[#060060] text-[#060060] font-bold rounded-xl 
                       hover:bg-[#060060] hover:text-white hover:scale-105 transition-all duration-300 group"
          >
            <span className="group-hover:translate-x-1 transition-transform inline-block">Enviar novamente</span>
          </button>
        </div>
        </div>
      </div>
    )
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
        <CheckCircle className="w-6 h-6 text-blue-400/30" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse">
        <ArrowLeft className="w-7 h-7 text-purple-400/30" />
      </div>

      {/* Botão Voltar */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 text-white hover:text-yellow-400 transition-colors duration-300 backdrop-blur-sm bg-white/10 rounded-lg z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 md:p-16 w-full max-w-md text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-yellow-400/20 text-yellow-600 rounded-full text-sm font-medium mb-6">
          <Mail className="w-4 h-4 mr-2" />
          Recuperação de senha
        </div>

        {/* Ícone */}
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
          <Mail className="w-10 h-10 text-white" />
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#060060] mb-4">
          Esqueceu sua senha?
        </h2>

        {/* Descrição */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Não se preocupe! Digite seu email e enviaremos um link para você redefinir sua senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            text=""
            type="email"
            name="email"
            placeholder="Digite seu endereço de email"
            handleOnChange={handleChange}
            value={email}
            required
          />

          {/* Botão Enviar */}
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-4 bg-yellow-400 text-[#060060] font-bold rounded-xl 
                       hover:bg-yellow-500 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       flex items-center justify-center group"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#060060] mr-2"></div>
                <span>Enviando...</span>
              </>
            ) : (
              <span className="group-hover:translate-x-1 transition-transform inline-block">Enviar link de recuperação</span>
            )}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 mb-2">
            Lembrou da senha?
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#060060] font-semibold hover:text-yellow-500 transition-colors
                       flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Fazer login</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
