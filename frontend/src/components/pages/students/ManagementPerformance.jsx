import { BarChart3, TrendingUp, Award, Target, ArrowLeft, Loader2, TrendingDown, CheckCircle, XCircle } from "lucide-react"; // Adicionado ícones
import { useState, useEffect } from "react";
// --- Ajuste o caminho para seus arquivos utilitários ---
import requestData from "../../../utils/requestApi"; 
import useFlashMessage from "../../../hooks/useFlashMessage"; 

// --- COMPONENTE AUXILIAR PARA BADGE DE NOTA ---
// Movido para fora para organizar a lógica de classificação
function GradeBadge({ grade }) {
  const g = Number(grade);
  if (g >= 9.0) {
    return (
      <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold rounded-full shadow-md">
        Excelente
      </span>
    );
  }
  if (g >= 8.0) {
    return (
      <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-md">
        Ótimo
      </span>
    );
  }
  if (g >= 7.0) {
    return (
      <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold rounded-full shadow-md">
        Bom
      </span>
    );
  }
  if (g >= 5.0) {
    return (
      <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-md">
        Regular
      </span>
    );
  }
  // Se a nota for menor que 5 (ex: 0.0)
  return (
    <span className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-md">
      Ruim
    </span>
  );
}

// --- COMPONENTE AUXILIAR PARA STATUS DA MÉDIA GERAL ---
function OverallStatus({ grade }) {
  const g = Number(grade);
  if (g >= 9.0) {
    return (
      <p className="text-emerald-600 text-xs sm:text-sm font-medium mt-2 sm:mt-3 flex items-center gap-1">
        <TrendingUp className="w-4 h-4" />
        Excelente desempenho
      </p>
    );
  }
  if (g >= 7.0) {
    return (
      <p className="text-blue-600 text-xs sm:text-sm font-medium mt-2 sm:mt-3 flex items-center gap-1">
        <CheckCircle className="w-4 h-4" />
        Bom desempenho
      </p>
    );
  }
  // Se a nota for menor que 7 (ex: 0.0)
  return (
    <p className="text-red-600 text-xs sm:text-sm font-medium mt-2 sm:mt-3 flex items-center gap-1">
      <TrendingDown className="w-4 h-4" />
      Precisa melhorar
    </p>
  );
}


export default function Desempenho() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    async function fetchPerformance() {
      try {
        setLoading(true);
        const response = await requestData("/performance/me", "GET", {}, true);

        // Lógica de verificação da resposta (considerando 'data' aninhado ou não)
        let responseData = null;
        if (response.success && response.data?.data) {
          responseData = response.data.data;
        } else if (response.success && response.data) {
          responseData = response.data;
        }

        if (responseData) {
          setPerformance(responseData);
        } else {
          const errorMsg = response.message || "Não foi possível carregar os dados de desempenho.";
          setError(errorMsg);
          if (setFlashMessage) setFlashMessage(errorMsg, "error");
        }
      } catch (err) {
        console.error("Erro ao buscar desempenho:", err);
        const errorMsg = "Erro de conexão com o servidor.";
        setError(errorMsg);
        if (setFlashMessage) setFlashMessage(errorMsg, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchPerformance();
  }, [setFlashMessage]);

  // --- DADOS DINÂMICOS (com valores padrão '0.0') ---
  const disciplines = performance?.disciplines || [];
  const mediaGeral = performance?.overallAverage || "0.0";
  const melhorNota = performance?.bestGrade?.grade || "0.0";
  const melhorDisciplina = performance?.bestGrade?.name || "N/A";

  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-emerald-500 to-emerald-600",
    "from-red-500 to-red-600",
    "from-yellow-500 to-yellow-600",
  ];
  const getColor = (index) => colors[index % colors.length];

  // --- RENDERIZAÇÃO CONDICIONAL ---

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="ml-4 text-xl text-slate-700">Carregando desempenho...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 p-4 text-center">
        <XCircle className="w-12 h-12 text-red-600 mb-4" />
        <p className="text-xl text-red-700">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="ml-4 mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!performance) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-xl text-slate-700">Nenhum dado de desempenho encontrado.</p>
      </div>
    );
  }

  // --- RENDERIZAÇÃO DE SUCESSO ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
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
        
        {/* Cards de Estatísticas (CORRIGIDO) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 lg:mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mb-2">Média Geral</p>
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800">{mediaGeral}</p>
                {/* --- USA O COMPONENTE AUXILIAR DINÂMICO --- */}
                <OverallStatus grade={mediaGeral} />
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
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800">{melhorNota}</p>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 sm:mt-3">
                  {melhorDisciplina}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Disciplinas (CORRIGIDO) */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Disciplinas</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Detalhamento por matéria</p>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-5">
              {disciplines.length > 0 ? (
                disciplines.map((d, i) => (
                  <div 
                    key={d.name} 
                    className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800">{d.name}</h3>
                          {/* --- USA O COMPONENTE AUXILIAR DINÂMICO --- */}
                          <GradeBadge grade={d.grade} />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600">Nota média do semestre</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${getColor(i)} bg-clip-text text-transparent`}>
                            {d.grade}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 text-center py-4">Nenhuma nota de disciplina encontrada ainda.</p>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-slate-500 text-xs sm:text-sm">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
}