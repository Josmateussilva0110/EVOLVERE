import { useState, useEffect } from 'react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    Printer, 
    Eye, 
    Trophy,
    Target,
    Home,
    FileText
} from 'lucide-react';

import { useParams, useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import formatDateRequests from "../../../utils/formatDateRequests";




export default function SimulatedResult() {
    const { form_id } = useParams();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState({})
    const [selectedFilter, setSelectedFilter] = useState('all'); // all, correct, wrong

    useEffect(() => {
        async function fetchResults() {
            const response = await requestData(`/form/results/${form_id}`, 'GET', {}, true)
            console.log('results: ',response)

            if (response && response.success) {
                setResults(response.data.results)
                setLoading(false)
            } 
        }
        fetchResults()
    }, [form_id])


    const getPercentageColor = (percentage) => {
        if (percentage < 60) return {
            text: 'text-red-600',
            bg: 'bg-red-500',
            light: 'bg-red-50',
            border: 'border-red-200'
        };
        if (percentage < 80) return {
            text: 'text-yellow-600',
            bg: 'bg-yellow-500',
            light: 'bg-yellow-50',
            border: 'border-yellow-200'
        };
        return {
            text: 'text-green-600',
            bg: 'bg-green-500',
            light: 'bg-green-50',
            border: 'border-green-200'
        };
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Carregando resultados...</p>
                </div>
            </div>
        );
    }


    const colors = getPercentageColor(results.percent_correct );
    const strokeDasharray = ((results.percent_correct  || 0) / 100) * 251.2;


    return (
        <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-cyan-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Voltar ao Dashboard</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                {/* Título do Simulado */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-400 rounded-2xl">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Simulado - {results.form_name}</h1>
                            <p className="text-gray-600">Concluído em {formatDateRequests(results.updated_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Card Principal de Resultados */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-linear-to-r from-blue-600 to-cyan-500 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {results.percent_correct >= 70 ? `Excelente trabalho, ${results.username}! 🎉` : 
                             results.percent_correct >= 60 ? `Bom desempenho, ${results.username}! 👏` :
                             `Continue praticando, ${results.username}! 💪`}
                        </h2>
                        <p className="text-blue-100">Veja abaixo sua análise detalhada de desempenho</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Círculo de Performance */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative w-56 h-56">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            className="text-gray-200 stroke-current"
                                            strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"
                                        />
                                        <circle
                                            className={`${colors.text} stroke-current`}
                                            strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40"
                                            fill="transparent"
                                            strokeDasharray={`${strokeDasharray} 251.2`}
                                            style={{ transition: 'stroke-dasharray 1s ease-out' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <Trophy className={`w-8 h-8 ${colors.text} mb-2`} />
                                        <span className={`text-4xl font-bold ${colors.text}`}>
                                            {results.percent_correct }%
                                        </span>
                                        <span className="text-sm text-gray-500 mt-1">Aproveitamento</span>
                                    </div>
                                </div>

                                <div className={`mt-6 px-6 py-3 rounded-full ${colors.light} border-2 ${colors.border}`}>
                                    <span className={`font-bold ${colors.text}`}>
                                        {results.percent_correct >= 70 ? "Aprovado ✓" : 
                                         results.percent_correct >= 60 ? "Aproveitamento Regular" :
                                         "Precisa Melhorar"}
                                    </span>
                                </div>
                            </div>

                            {/* Estatísticas Detalhadas */}
                            <div className="space-y-4">
                                <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                            <span className="font-semibold text-gray-700">Questões Corretas</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-green-600">{results.total_correct}</div>
                                            <div className="text-sm font-medium text-green-700">
                                                {((results.total_correct / results.total_questions) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-green-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(results.total_correct / results.total_questions) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-linear-to-br from-red-50 to-rose-50 p-5 rounded-2xl border-2 border-red-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <XCircle className="w-6 h-6 text-red-600" />
                                            <span className="font-semibold text-gray-700">Questões Incorretas</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-red-600">{results.total_wrong}</div>
                                            <div className="text-sm font-medium text-red-700">
                                                {((results.total_wrong / results.total_questions) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-red-200 rounded-full h-2">
                                        <div 
                                            className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(results.total_wrong / results.total_questions) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <div className="font-semibold text-gray-700">Tempo Utilizado</div>
                                                <div className="text-sm text-gray-500">de 03:00:00 disponíveis</div>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">00:10:00</span>
                                    </div>
                                </div>

                                <div className="bg-linear-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-6 h-6 text-purple-600" />
                                            <div>
                                                <div className="font-semibold text-gray-700">Total de Questões</div>
                                                <div className="text-sm text-gray-500">Simulado completo</div>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-purple-600">{results.total_questions}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Ações Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all group"
                    >
                        <Eye className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-gray-800 mb-1">Ver Gabarito Detalhado</h4>
                        <p className="text-sm text-gray-600">Confira todas as questões e respostas</p>
                    </button>

                    <button 
                        onClick={() => window.print()}
                        className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-xl transition-all group"
                    >
                        <Printer className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-gray-800 mb-1">Imprimir Resultados</h4>
                        <p className="text-sm text-gray-600">Salve uma cópia física</p>
                    </button>
                </div>


            </main>


            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
                @media print {
                    header, button, .no-print { display: none !important; }
                }
            `}</style>
        </div>
    );
}