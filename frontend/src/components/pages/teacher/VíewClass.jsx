import { useState } from "react"
import { Trash2, Eye, ArrowDownToLine, Users, BookOpen, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ViewClass() {
  const navigate = useNavigate()

  // Dados de exemplo (adicione mais para testar a paginação)
  const alunos = ["Lucas", "Mateus", "Gabriel", "Rai Damásio", "João", "Maria", "Ana", "Pedro"]
  const simulados = [
    { nome: "questões sobre laços", respondido: 3 },
    { nome: "Arvores", respondido: 5 },
    { nome: "Funções", respondido: 2 },
    { nome: "Estruturas", respondido: 4 },
    { nome: "Vetores", respondido: 1 }
  ]
  const materiais = [
    { nome: "Livro de redes" },
    { nome: "aula 1" },
    { nome: "aula 2" },
    { nome: "Slides" },
    { nome: "Exercícios" }
  ]

  // Paginação
  const ITEMS_PER_PAGE = 4
  const [pageAlunos, setPageAlunos] = useState(1)
  const [pageSimulados, setPageSimulados] = useState(1)
  const [pageMateriais, setPageMateriais] = useState(1)

  // Helpers de paginação
  const getPage = (arr, page) => arr.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const totalPages = arr => Math.ceil(arr.length / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060060] via-[#060060] to-[#060060] flex flex-col items-center py-4 px-2 relative">
      {/* Background Glass Circles */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg text-center mb-7 tracking-tight animate-fade-in">
        Turma A
      </h1>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <button className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 animate-fade-in">
          <Users className="w-5 h-5" />
          Gerar Convite
        </button>
        <button
          className="bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-[#060060] font-bold px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 animate-fade-in"
          onClick={() => navigate("/teacher/material/register")}
        >
          <BookOpen className="w-5 h-5" />
          Cadastrar Material
        </button>
        <button className="bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-[#060060] font-bold px-6 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 animate-fade-in">
          <FileText className="w-5 h-5" />
          Cadastrar Simulado
        </button>
      </div>

      {/* Grid principal */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Alunos */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 flex flex-col min-h-[270px] animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg text-[#060060]">Alunos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-semibold text-gray-700 pb-1">Nome</th>
                  <th className="font-semibold text-gray-700 pb-1 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {getPage(alunos, pageAlunos).map((aluno, idx) => (
                  <tr key={aluno}>
                    <td className="py-2 border-b border-gray-200">{aluno}</td>
                    <td className="py-2 border-b border-gray-200 text-right">
                      <button className="p-1 hover:bg-red-50 rounded transition group">
                        <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginação */}
          <div className="flex justify-end mt-auto pt-2 gap-2 items-center">
            <button
              className="p-1 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPageAlunos(page => Math.max(1, page - 1))}
              disabled={pageAlunos === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5 text-[#060060]" />
            </button>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#060060] text-white text-xs font-bold select-none shadow">
              {pageAlunos}
            </span>
            <button
              className="p-1 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPageAlunos(page => Math.min(totalPages(alunos), page + 1))}
              disabled={pageAlunos === totalPages(alunos)}
              aria-label="Próxima página"
            >
              <ChevronRight className="w-5 h-5 text-[#060060]" />
            </button>
          </div>
        </div>

        {/* Simulados */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 flex flex-col min-h-[270px] animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-6 h-6 text-yellow-500" />
            <span className="font-bold text-lg text-[#060060]">Simulados</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-semibold text-gray-700 pb-1">Nome</th>
                  <th className="font-semibold text-gray-700 pb-1">Respondido</th>
                  <th className="font-semibold text-gray-700 pb-1 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {getPage(simulados, pageSimulados).map((sim, idx) => (
                  <tr key={sim.nome}>
                    <td className="py-2 border-b border-gray-200">{sim.nome}</td>
                    <td className="py-2 border-b border-gray-200">{sim.respondido}</td>
                    <td className="py-2 border-b border-gray-200 text-right flex gap-1 justify-end">
                      <button className="p-1 hover:bg-blue-50 rounded transition group">
                        <Eye className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded transition group">
                        <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginação */}
          <div className="flex justify-end mt-auto pt-2 gap-2 items-center">
            <button
              className="p-1 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPageSimulados(page => Math.max(1, page - 1))}
              disabled={pageSimulados === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5 text-[#060060]" />
            </button>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#060060] text-white text-xs font-bold select-none shadow">
              {pageSimulados}
            </span>
            <button
              className="p-1 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPageSimulados(page => Math.min(totalPages(simulados), page + 1))}
              disabled={pageSimulados === totalPages(simulados)}
              aria-label="Próxima página"
            >
              <ChevronRight className="w-5 h-5 text-[#060060]" />
            </button>
          </div>
        </div>
      </div>

      {/* Materiais */}
      <div className="w-full max-w-3xl animate-fade-in mb-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-6 flex flex-col min-h-[200px]">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-green-600" />
            <span className="font-bold text-lg text-[#060060]">Materiais</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-semibold text-gray-700 pb-1">Nome</th>
                  <th className="font-semibold text-gray-700 pb-1 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {getPage(materiais, pageMateriais).map((mat, idx) => (
                  <tr key={mat.nome}>
                    <td className="py-2 border-b border-gray-200">{mat.nome}</td>
                    <td className="py-2 border-b border-gray-200 text-right flex gap-1 justify-end">
                      <button className="p-1 hover:bg-blue-50 rounded transition group">
                        <ArrowDownToLine className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded transition group">
                        <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginação */}
          <div className="flex justify-end mt-auto pt-2 gap-2 items-center">
            <button
              className="p-1 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPageMateriais(page => Math.max(1, page - 1))}
              disabled={pageMateriais === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-5 h-5 text-[#060060]" />
            </button>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#060060] text-white text-xs font-bold select-none shadow">
              {pageMateriais}
            </span>
            <button
              className="p-1 rounded-full hover:bg-[#060060]/10 transition disabled:opacity-40"
              onClick={() => setPageMateriais(page => Math.min(totalPages(materiais), page + 1))}
              disabled={pageMateriais === totalPages(materiais)}
              aria-label="Próxima página"
            >
              <ChevronRight className="w-5 h-5 text-[#060060]" />
            </button>
          </div>
        </div>
      </div>

      {/* Animação fade-in */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
    </div>
  )
}