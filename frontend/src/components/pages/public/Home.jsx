import { useNavigate } from "react-router-dom"
import { Users, Trophy, Target, ArrowRight, Play } from "lucide-react"
import Image from "../../form/Image"

/**
 * Componente da página inicial da aplicação Evolvere.
 * 
 * Renderiza uma landing page moderna e atrativa com:
 * - Header com logo e navegação principal
 * - Seção hero com call-to-actions
 * - Cards de funcionalidades da plataforma
 * - Seção de estatísticas e depoimentos
 * - Call-to-action final para conversão
 * 
 * @returns {JSX.Element} Componente React da página inicial
 */
function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#1a1a5e] to-[#2d2d8a]">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="/logo.png" alt="Evolvere Logo" size={48} />
            <h1 className="text-3xl font-bold text-white">Evolvere</h1>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate("/login")}
              className="px-6 py-3 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Entrar
            </button>
            <button 
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-yellow-400 text-[#060060] font-bold rounded-xl hover:bg-yellow-500 transition-all duration-300 shadow-lg"
            >
              Começar
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Aprenda. <span className="text-yellow-400">Pratique.</span><br />
            <span className="text-yellow-400">Evolua.</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            A plataforma onde aprendizado, prática e feedback se encontram.<br />
            Organize seus estudos, evolua com constância e alcance seus objetivos acadêmicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-yellow-400 text-[#060060] text-xl font-bold rounded-2xl hover:bg-yellow-500 transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3"
            >
              <Play className="w-6 h-6" />
              <span>Começar Agora</span>
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="px-8 py-4 border-2 border-white text-white text-xl font-semibold rounded-2xl hover:bg-white hover:text-[#060060] transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <span>Saiba Mais</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-6">Por que escolher a Evolvere?</h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nossa plataforma combina tecnologia avançada com metodologias comprovadas de ensino
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Objetivos Claros</h4>
            {/* TODO: Alterar o texto desta seção - revisar conteúdo sobre objetivos claros */}
            <p className="text-gray-300 leading-relaxed">
              Defina metas específicas e acompanhe seu progresso com métricas detalhadas
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Comunidade Ativa</h4>
            {/* TODO: Alterar o texto desta seção - revisar conteúdo sobre comunidade ativa */}
            <p className="text-gray-300 leading-relaxed">
              Conecte-se com outros estudantes e professores para trocar experiências
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Gamificação</h4>
            <p className="text-gray-300 leading-relaxed">
              Aprenda de forma divertida com sistema de conquistas e recompensas
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-12 text-center">
          <h3 className="text-4xl font-bold text-[#060060] mb-6">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-xl text-[#060060]/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já transformaram sua forma de aprender
          </p>
          <button 
            onClick={() => navigate("/register")}
            className="px-10 py-4 bg-[#060060] text-white text-xl font-bold rounded-2xl hover:bg-[#060060]/90 transition-all duration-300 shadow-2xl"
          >
            Criar Conta Grátis
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-12 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p>&copy; 2025 Evolvere. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
