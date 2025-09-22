import { useNavigate } from "react-router-dom"
import { ArrowLeft, BookOpen, Users, Trophy, Target, Award, Clock, CheckCircle, Star, Brain, Zap, Sparkles } from "lucide-react"
import Image from "../../form/Image"

/**
 * Componente da página "Sobre" da aplicação Evolvere.
 * 
 * Apresenta informações detalhadas sobre a plataforma, incluindo:
 * - Missão e valores da empresa
 * - Funcionalidades e diferenciais competitivos
 * - Estatísticas de uso e satisfação
 * - Call-to-actions para conversão
 * 
 * Esta página é acessada através do botão "Saiba Mais" na página inicial
 * e fornece contexto completo sobre os benefícios da plataforma.
 * 
 * @returns {JSX.Element} Componente React da página sobre
 */
function About() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#1a1a5e] to-[#2d2d8a] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 animate-pulse">
        <Brain className="w-8 h-8 text-yellow-400/30" />
      </div>
      <div className="absolute top-40 left-20 animate-bounce">
        <Sparkles className="w-6 h-6 text-blue-400/30" />
      </div>
      <div className="absolute bottom-40 right-20 animate-pulse">
        <Zap className="w-7 h-7 text-purple-400/30" />
      </div>
      <div className="absolute top-60 left-1/3 animate-bounce delay-1000">
        <Star className="w-5 h-5 text-yellow-400/40" />
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image src="/logo.png" alt="Evolvere Logo" size={48} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-3xl font-bold text-white">Evolvere</h1>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 px-4 py-2 text-white hover:text-yellow-400 transition-colors duration-300 backdrop-blur-sm bg-white/5 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Transformando a Educação Digital
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Conheça a <span className="text-yellow-400 relative">
              Evolvere
              <div className="absolute -bottom-2 left-0 right-0 h-2 bg-yellow-400/30 rounded-full"></div>
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            A plataforma revolucionária que transforma a forma como você aprende, 
            pratica e evolui academicamente.
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">3+</div>
              <div className="text-sm text-gray-400">Anos de Experiência</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">50+</div>
              <div className="text-sm text-gray-400">Especialistas</div>
            </div>
            <div className="w-px h-8 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-gray-400">Suporte</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-6">Nossa Missão</h3>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Democratizar o acesso à educação de qualidade através de uma plataforma 
                que combina tecnologia avançada com metodologias pedagógicas comprovadas.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Queremos que cada estudante tenha as ferramentas necessárias para 
                organizar seus estudos, acompanhar seu progresso e alcançar seus 
                objetivos acadêmicos de forma eficiente e motivadora.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-[#060060]" />
              </div>
              <h4 className="text-2xl font-bold text-white text-center mb-4">Objetivo Principal</h4>
              <p className="text-gray-300 text-center leading-relaxed">
                Criar um ecossistema educacional completo que conecta estudantes, 
                professores e instituições em uma jornada de aprendizado contínuo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-6">O que nos torna únicos?</h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Nossa plataforma foi desenvolvida com base em pesquisas educacionais 
            e feedback de milhares de usuários
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Conteúdo Adaptativo</h4>
            {/* TODO: Verificar viabilidade técnica e de implementação do conteúdo adaptativo - avaliar complexidade e recursos necessários */}
            <p className="text-gray-300 leading-relaxed">
              Nossos algoritmos se adaptam ao seu ritmo de aprendizado, 
              oferecendo conteúdo personalizado para maximizar sua evolução.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Comunidade Colaborativa</h4>
            <p className="text-gray-300 leading-relaxed">
              Conecte-se com outros estudantes, participe de grupos de estudo 
              e aprenda com experiências compartilhadas.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Gamificação Inteligente</h4>
            <p className="text-gray-300 leading-relaxed">
              Sistema de conquistas e recompensas que torna o aprendizado 
              mais envolvente e motivador.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Flexibilidade Total</h4>
            <p className="text-gray-300 leading-relaxed">
              Estude no seu ritmo, a qualquer hora e em qualquer lugar. 
              Nossa plataforma se adapta à sua rotina.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Certificação Reconhecida</h4>
            <p className="text-gray-300 leading-relaxed">
              Receba certificados válidos que comprovam suas competências 
              e conhecimentos adquiridos.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-[#060060]" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">Acompanhamento Contínuo</h4>
            <p className="text-gray-300 leading-relaxed">
              Relatórios detalhados do seu progresso e sugestões personalizadas 
              para otimizar seu aprendizado.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-6">Números que impressionam</h3>
            <p className="text-xl text-gray-300">
              A confiança de milhares de estudantes em todo o Brasil
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-lg text-gray-300">Estudantes Ativos</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-lg text-gray-300">Cursos Disponíveis</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-lg text-gray-300">Taxa de Satisfação</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-yellow-400 mb-2">24/7</div>
              <div className="text-lg text-gray-300">Suporte Disponível</div>
            </div>
          </div>
        </div>
      </div>

      {/* Creators Section */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-6">Conheça nossa equipe</h3>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Desenvolvido por estudantes apaixonados por educação e tecnologia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Creator 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold text-[#060060]">L</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Lucas</h4>
            <p className="text-yellow-400 font-medium mb-3 text-sm">Desenvolvedor Full-Stack</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              Especialista em React e Node.js, apaixonado por criar experiências digitais incríveis.
            </p>
          </div>

          {/* Creator 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold text-white">J</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">José</h4>
            <p className="text-yellow-400 font-medium mb-3 text-sm">Arquiteto de Software</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              Focado em arquiteturas escaláveis e soluções robustas para educação online.
            </p>
          </div>

          {/* Creator 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Maria</h4>
            <p className="text-yellow-400 font-medium mb-3 text-sm">Designer UX/UI</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              Criadora de interfaces intuitivas e experiências visuais memoráveis.
            </p>
          </div>

          {/* Creator 4 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Ana</h4>
            <p className="text-yellow-400 font-medium mb-3 text-sm">Especialista em Educação</p>
            <p className="text-gray-300 text-xs leading-relaxed">
              Pedagoga especializada em metodologias de ensino e aprendizagem digital.
            </p>
          </div>
        </div>

        {/* Team Stats */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-3xl p-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">4</div>
              <div className="text-gray-300 text-sm">Desenvolvedores</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">6+</div>
              <div className="text-gray-300 text-sm">Meses de Desenvolvimento</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">100%</div>
              <div className="text-gray-300 text-sm">Dedicação</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">∞</div>
              <div className="text-gray-300 text-sm">Paixão pela Educação</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-12 text-center">
          <h3 className="text-4xl font-bold text-[#060060] mb-6">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-xl text-[#060060]/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já transformaram sua forma de aprender
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-[#060060] text-white text-xl font-bold rounded-2xl hover:bg-[#060060]/90 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#060060]/25 group"
            >
              <span className="group-hover:translate-x-1 transition-transform inline-block">Criar Conta Grátis</span>
            </button>
            <button 
              onClick={() => navigate("/")}
              className="px-10 py-4 border-2 border-[#060060] text-[#060060] text-xl font-semibold rounded-2xl hover:bg-[#060060] hover:text-white hover:scale-105 transition-all duration-300 group"
            >
              <span className="group-hover:translate-x-1 transition-transform inline-block">Voltar ao Início</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 py-12 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 Evolvere. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default About
