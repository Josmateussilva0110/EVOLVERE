import { BarChart3, TrendingUp, Award, Target, ArrowLeft } from "lucide-react";

export default function Desempenho() {
  const dados = [
    { disciplina: "Estruturas de Dados", nota: 9.2, cor: "from-blue-500 to-blue-600" },
    { disciplina: "Banco de Dados II", nota: 8.8, cor: "from-purple-500 to-purple-600" },
    { disciplina: "Redes de Computadores", nota: 9.0, cor: "from-emerald-500 to-emerald-600" },
  ];
  
  const mediaGeral = (dados.reduce((acc, d) => acc + d.nota, 0) / dados.length).toFixed(1);
  const melhorNota = Math.max(...dados.map(d => d.nota));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          {/* Botão Voltar */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 mb-6 px-5 py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-gray-200 hover:border-green-300"
            >
              <ArrowLeft 
                size={20} 
                strokeWidth={2.5} 
                className="group-hover:-translate-x-1 transition-transform duration-300" 
              />
              <span>Voltar</span>
            </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">Desempenho Acadêmico</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Acompanhe suas notas e progresso</p>
            </div>
          </div>
        </div>
        

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 lg:mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-2">Média Geral</p>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800">{mediaGeral}</p>
                <p className="text-emerald-600 text-xs sm:text-sm font-medium mt-2 sm:mt-3 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Excelente desempenho
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-2">Melhor Nota</p>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800">{melhorNota.toFixed(1)}</p>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 sm:mt-3">
                  {dados.find(d => d.nota === melhorNota)?.disciplina}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Disciplinas */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Disciplinas</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Detalhamento por matéria</p>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-5">
              {dados.map((d, i) => (
                <div 
                  key={i} 
                  className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-800">{d.disciplina}</h3>
                        {d.nota >= 9.0 ? (
                          <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-md">
                            Excelente
                          </span>
                        ) : d.nota >= 8.5 ? (
                          <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                            Ótimo
                          </span>
                        ) : (
                          <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-md">
                            Bom
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600">Nota média do semestre</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${d.cor} bg-clip-text text-transparent`}>
                          {d.nota}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé com informação */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-slate-500 text-xs sm:text-sm">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}