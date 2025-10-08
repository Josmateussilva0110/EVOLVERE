import { Award, Star, Trophy, Zap, Target, Crown, ArrowLeft, Sparkles } from "lucide-react";

export default function Medalhas() {
  const medalhas = [
    { 
      titulo: "Aluno Destaque", 
      descricao: "Excelência em todas as disciplinas",
      cor: "from-yellow-400 to-orange-500",
      corBg: "from-yellow-50 to-orange-50",
      icone: Crown,
      data: "Conquistada em 15/09/2024",
      pontos: 500,
      raridade: "Lendária"
    },
    { 
      titulo: "Melhor Desempenho", 
      descricao: "Média geral acima de 9.0",
      cor: "from-blue-400 to-cyan-500",
      corBg: "from-blue-50 to-cyan-50",
      icone: Trophy,
      data: "Conquistada em 20/08/2024",
      pontos: 350,
      raridade: "Épica"
    },
    { 
      titulo: "Participante Ativo", 
      descricao: "100% de presença nas aulas",
      cor: "from-green-400 to-emerald-500",
      corBg: "from-green-50 to-emerald-50",
      icone: Zap,
      data: "Conquistada em 10/07/2024",
      pontos: 250,
      raridade: "Rara"
    },
    { 
      titulo: "Mestre da Lógica", 
      descricao: "Nota máxima em Estruturas de Dados",
      cor: "from-purple-400 to-pink-500",
      corBg: "from-purple-50 to-pink-50",
      icone: Target,
      data: "Conquistada em 05/09/2024",
      pontos: 400,
      raridade: "Épica"
    },
    { 
      titulo: "Estrela em Ascensão", 
      descricao: "Maior evolução no semestre",
      cor: "from-indigo-400 to-purple-500",
      corBg: "from-indigo-50 to-purple-50",
      icone: Star,
      data: "Conquistada em 01/10/2024",
      pontos: 300,
      raridade: "Rara"
    },
    { 
      titulo: "Gênio da Inovação", 
      descricao: "Projeto inovador aprovado",
      cor: "from-rose-400 to-red-500",
      corBg: "from-rose-50 to-red-50",
      icone: Sparkles,
      data: "Conquistada em 25/09/2024",
      pontos: 450,
      raridade: "Épica"
    },
  ];

  const totalPontos = medalhas.reduce((acc, m) => acc + m.pontos, 0);
  const medalhasLendarias = medalhas.filter(m => m.raridade === "Lendária").length;
  const medalhasEpicas = medalhas.filter(m => m.raridade === "Épica").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          {/* Botão Voltar */}
          <button 
            onClick={() => window.history.back()}
            className="mb-4 flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md border border-slate-200 hover:bg-slate-50 hover:shadow-lg transition-all duration-300 text-slate-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Voltar</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">Minhas Medalhas</h1>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">Conquistas e reconhecimentos acadêmicos</p>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-2">Total de Pontos</p>
                <p className="text-4xl sm:text-5xl font-bold text-slate-800">{totalPontos}</p>
                <p className="text-blue-600 text-xs sm:text-sm font-medium mt-2">
                  {medalhas.length} medalhas conquistadas
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-2">Lendárias</p>
                <p className="text-4xl sm:text-5xl font-bold text-slate-800">{medalhasLendarias}</p>
                <p className="text-yellow-600 text-xs sm:text-sm font-medium mt-2">
                  Conquistas raras
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-2">Épicas</p>
                <p className="text-4xl sm:text-5xl font-bold text-slate-800">{medalhasEpicas}</p>
                <p className="text-purple-600 text-xs sm:text-sm font-medium mt-2">
                  Grandes feitos
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Medalhas */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Coleção de Medalhas</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Todas as suas conquistas acadêmicas</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {medalhas.map((m, i) => {
                const Icone = m.icone;
                return (
                  <div 
                    key={i} 
                    className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Background decorativo */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${m.cor} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>
                    
                    {/* Badge de Raridade */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2.5 py-1 bg-gradient-to-r ${m.cor} text-white text-xs font-bold rounded-full shadow-md`}>
                        {m.raridade}
                      </span>
                    </div>

                    {/* Ícone da Medalha */}
                    <div className={`relative w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${m.cor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icone className="w-10 h-10 text-white" />
                    </div>

                    {/* Informações */}
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">{m.titulo}</h3>
                      <p className="text-sm text-slate-600">{m.descricao}</p>
                    </div>

                    {/* Detalhes */}
                    <div className={`bg-gradient-to-r ${m.corBg} rounded-xl p-3 space-y-2`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">Pontos:</span>
                        <span className="font-bold text-slate-800">{m.pontos} pts</span>
                      </div>
                      <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
                        {m.data}
                      </div>
                    </div>

                    {/* Efeito brilho no hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Próximas Conquistas */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-slate-700 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-700">
            <h2 className="text-lg sm:text-xl font-bold text-white">Próximas Conquistas</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Continue se esforçando para desbloquear</p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { titulo: "Mestre do Ano", desc: "Média 9.5+ em todos semestres", progresso: 75 },
                { titulo: "100% Dedicado", desc: "Presença perfeita o ano todo", progresso: 85 },
                { titulo: "Líder Natural", desc: "Liderar 3 projetos em grupo", progresso: 60 },
              ].map((conquista, i) => (
                <div key={i} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-slate-500 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{conquista.titulo}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{conquista.desc}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Progresso</span>
                      <span className="text-white font-bold">{conquista.progresso}%</span>
                    </div>
                    <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                        style={{ width: `${conquista.progresso}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-slate-500 text-xs sm:text-sm">
            Continue conquistando medalhas e desbloqueando novas recompensas!
          </p>
        </div>
      </div>
    </div>
  );
}