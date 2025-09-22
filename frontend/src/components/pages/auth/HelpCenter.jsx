import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Search, MessageCircle, Phone, Mail, HelpCircle, 
         User, Lock, CreditCard, Settings, FileText, ChevronRight } from "lucide-react"

/**
 * Componente da página "Central de Ajuda" da aplicação Evolvere.
 * 
 * Fornece acesso a FAQs, contato e recursos de suporte para os usuários.
 * Inclui busca por tópicos e categorias organizadas de ajuda.
 * 
 * @returns {JSX.Element} Componente React da central de ajuda
 */
function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedCategory, setExpandedCategory] = useState(null)
  const navigate = useNavigate()

  const helpCategories = [
    {
      id: "account",
      title: "Conta e Perfil",
      icon: User,
      color: "bg-blue-100 text-blue-600",
      topics: [
        "Como criar uma conta",
        "Como alterar minha senha",
        "Como atualizar meu perfil",
        "Problemas de login",
        "Como excluir minha conta",
        "Verificar dados pessoais",
        "Alterar foto de perfil",
        "Configurações de privacidade"
      ]
    },
    {
      id: "security",
      title: "Segurança",
      icon: Lock,
      color: "bg-red-100 text-red-600",
      topics: [
        "Como proteger minha conta",
        "Recuperação de senha",
        "Verificação em duas etapas",
        "Denunciar atividade suspeita",
        "Histórico de acessos",
        "Sessões ativas",
        "Alterar email de recuperação",
        "Política de segurança"
      ]
    },
    {
      id: "technical",
      title: "Problemas Técnicos",
      icon: Settings,
      color: "bg-purple-100 text-purple-600",
      topics: [
        "Problemas de carregamento",
        "Erros de sistema",
        "Compatibilidade de navegador",
        "Problemas de conexão",
        "Vídeos não carregam",
        "Aplicativo não abre",
        "Sincronização de dados",
        "Requisitos do sistema"
      ]
    },
    {
      id: "courses",
      title: "Cursos e Aprendizado",
      icon: FileText,
      color: "bg-yellow-100 text-yellow-600",
      topics: [
        "Como acessar cursos",
        "Problemas com vídeos",
        "Certificados",
        "Progresso não salvo",
        "Baixar materiais",
        "Fóruns de discussão",
        "Avaliações e exercícios",
        "Cronograma de estudos"
      ]
    }
  ]

  const faqs = [
    {
      question: "Como posso recuperar minha senha?",
      answer: "Clique em 'Esqueci a senha' na tela de login e siga as instruções enviadas por email."
    },
    {
      question: "A plataforma é gratuita?",
      answer: "Oferecemos planos gratuitos e premium. O plano gratuito inclui acesso a cursos básicos."
    },
    {
      question: "Como posso cancelar minha assinatura?",
      answer: "Acesse Configurações > Assinatura e clique em 'Cancelar assinatura'."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim, utilizamos criptografia de ponta e seguimos as melhores práticas de segurança."
    }
  ]

  const filteredCategories = helpCategories.filter(category => 
    selectedCategory === "all" || category.id === selectedCategory
  )

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#1a1a5e] to-[#2d2d8a]">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-white hover:text-yellow-400 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Voltar</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Central de Ajuda</h1>
          <div className="w-20"></div> {/* Spacer para centralizar o título */}
        </div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Busca */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar ajuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-lg bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:outline-none focus:bg-white shadow-lg"
            />
          </div>
        </div>

        {/* Categorias */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Categorias de Ajuda</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                className={`bg-white/10 backdrop-blur-sm rounded-xl transition-all duration-300 cursor-pointer ${
                  expandedCategory === category.id 
                    ? 'bg-white/20 shadow-lg' 
                    : 'hover:bg-white/15'
                }`}
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${category.color}`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-semibold text-white">{category.title}</h3>
                    </div>
                    <ChevronRight 
                      className={`w-4 h-4 text-white transition-transform duration-300 ${
                        expandedCategory === category.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                  
                  {expandedCategory === category.id && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="space-y-2">
                        {category.topics.map((topic, index) => (
                          <div 
                            key={index} 
                            className="flex items-center p-2 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Aqui você pode implementar a navegação para o tópico específico
                              console.log(`Clicou em: ${topic}`)
                            }}
                          >
                            <ChevronRight className="w-3 h-3 mr-2 text-yellow-400" />
                            <span className="text-gray-300 text-xs">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {expandedCategory !== category.id && (
                    <div className="space-y-1">
                      {category.topics.slice(0, 2).map((topic, index) => (
                        <div key={index} className="text-gray-300 text-xs flex items-center">
                          <ChevronRight className="w-3 h-3 mr-1" />
                          {topic}
                        </div>
                      ))}
                      <div className="text-yellow-400 text-xs font-medium">
                        +{category.topics.length - 2} mais tópicos
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">Ainda precisa de ajuda?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Nossa equipe de suporte está pronta para ajudar você. Entre em contato conosco através dos canais abaixo.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-xl p-6">
              <MessageCircle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Chat Online</h3>
              <p className="text-gray-300 text-sm mb-4">Resposta rápida em tempo real</p>
              <button className="w-full py-2 bg-yellow-400 text-[#060060] font-bold rounded-lg hover:bg-yellow-500 transition">
                Iniciar Chat
              </button>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <Mail className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-300 text-sm mb-4">suporte@evolvere.com</p>
              <button className="w-full py-2 bg-yellow-400 text-[#060060] font-bold rounded-lg hover:bg-yellow-500 transition">
                Enviar Email
              </button>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <Phone className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Telefone</h3>
              <p className="text-gray-300 text-sm mb-4">(11) 99999-9999</p>
              <button className="w-full py-2 bg-yellow-400 text-[#060060] font-bold rounded-lg hover:bg-yellow-500 transition">
                Ligar Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
