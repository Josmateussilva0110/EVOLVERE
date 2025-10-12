import { useNavigate } from "react-router-dom"
import { Users, Trophy, Target, ArrowRight, Play, BookOpen, Brain, Zap, Star, CheckCircle } from "lucide-react"
import Image from "../../form/Image"
import CursorFollower from "../../CursorFollower"

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
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#1a1a5e] to-[#2d2d8a] relative overflow-hidden">
      {/* Cursor Follower */}
      <CursorFollower />
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-pulse">
        <BookOpen className="w-8 h-8 text-yellow-400/30" />
      </div>
      <div className="absolute top-40 right-20 animate-bounce">
        <Brain className="w-6 h-6 text-blue-400/30" />
      </div>
      <div className="absolute bottom-40 left-20 animate-pulse">
        <Zap className="w-7 h-7 text-purple-400/30" />
      </div>
      <div className="absolute top-60 right-1/3 animate-bounce delay-1000">
        <Star className="w-5 h-5 text-yellow-400/40" />
      </div>



      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 mr-2" />
            Plataforma #1 em Educação Online
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Aprenda. <span className="text-yellow-400 relative">
              Pratique.
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-yellow-400/30 rounded-full"></div>
            </span><br />
            <span className="text-yellow-400">Evolua.</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            A plataforma onde aprendizado, prática e feedback se encontram.<br />
            Organize seus estudos, evolua com constância e alcance seus objetivos acadêmicos.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">10K+</div>
              <div className="text-sm text-gray-400">Estudantes</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">500+</div>
              <div className="text-sm text-gray-400">Cursos</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">95%</div>
              <div className="text-sm text-gray-400">Satisfação</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-yellow-400 text-[#060060] text-xl font-bold rounded-2xl hover:bg-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/25 flex items-center justify-center space-x-3 group"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Começar Agora</span>
            </button>
            <button 
              onClick={() => navigate("/about")}
              className="px-8 py-4 border-2 border-white text-white text-xl font-semibold rounded-2xl hover:bg-white hover:text-[#060060] transition-all duration-300 flex items-center justify-center space-x-3 backdrop-blur-sm"
            >
              <span>Saiba Mais</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-6">Por que escolher a Evolvere?</h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nossa plataforma combina tecnologia avançada com metodologias comprovadas de ensino
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-[#060060]" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Objetivos Claros</h4>
              {/* TODO: Alterar o texto desta seção - revisar conteúdo sobre objetivos claros */}
              <p className="text-gray-300 leading-relaxed">
                Defina metas específicas e acompanhe seu progresso com métricas detalhadas
              </p>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-[#060060]" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Comunidade Ativa</h4>
              {/* TODO: Alterar o texto desta seção - revisar conteúdo sobre comunidade ativa */}
              <p className="text-gray-300 leading-relaxed">
                Conecte-se com outros estudantes e professores para trocar experiências
              </p>
              <div className="mt-4 flex justify-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-[#060060]" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Gamificação</h4>
              <p className="text-gray-300 leading-relaxed">
                Aprenda de forma divertida com sistema de conquistas e recompensas
              </p>
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-12 text-center">
          <h3 className="text-4xl font-bold text-[#060060] mb-6">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-xl text-[#060060]/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já transformaram sua forma de aprender
          </p>
          <button 
            onClick={() => navigate("/register")}
            className="px-10 py-4 bg-[#060060] text-white text-xl font-bold rounded-2xl hover:bg-[#060060]/90 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#060060]/25 group"
          >
            <span className="group-hover:translate-x-1 transition-transform inline-block">Criar Conta Grátis</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
