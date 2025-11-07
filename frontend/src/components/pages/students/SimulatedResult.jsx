import { useState, useEffect } from 'react';
import { 
    CheckCircle, 
    XCircle, 
    Clock, 
    Printer, 
    Eye, 
    Info,
    RefreshCw,
    Trophy,
    TrendingUp,
    AlertCircle,
    BookOpen,
    Target,
    Award,
    BarChart3,
    ChevronRight,
    Home,
    FileText
} from 'lucide-react';

// Dados mockados expandidos
const mockResult = {
    id: "sim_123",
    studentName: "Gabriel Silva",
    examTitle: "Simulado - Circuitos Digitais Avançados",
    percentage: 75.5,
    correctAnswers: 34,
    wrongAnswers: 11,
    unanswered: 0,
    totalQuestions: 45,
    timeSpent: "02:14:35",
    timeLimit: "03:00:00",
    completedAt: "2024-11-06T14:30:00",
    subjects: [
        { name: "Matemática", correct: 18, total: 25, percentage: 72 },
        { name: "Física", correct: 8, total: 10, percentage: 80 },
        { name: "Química", correct: 5, total: 6, percentage: 83.3 },
        { name: "Biologia", correct: 3, total: 4, percentage: 75 }
    ],
    questions: [
        { 
            id: 1, 
            subject: "Matemática", 
            topic: "Álgebra Linear",
            correct: true, 
            userAnswer: "B", 
            correctAnswer: "B",
            difficulty: "Médio",
            successRate: 89.2,
            text: "Qual o valor de x na equação 2x + 5 = 15?"
        },
        { 
            id: 2, 
            subject: "Matemática", 
            topic: "Geometria",
            correct: false, 
            userAnswer: "C", 
            correctAnswer: "A",
            difficulty: "Difícil",
            successRate: 45.8,
            text: "Calcule a área do triângulo..."
        },
        { 
            id: 3, 
            subject: "Física", 
            topic: "Cinemática",
            correct: true, 
            userAnswer: "D", 
            correctAnswer: "D",
            difficulty: "Fácil",
            successRate: 92.5,
            text: "Um corpo em movimento retilíneo..."
        },
        { 
            id: 4, 
            subject: "Química", 
            topic: "Química Orgânica",
            correct: false, 
            userAnswer: "A", 
            correctAnswer: "B",
            difficulty: "Médio",
            successRate: 67.3,
            text: "Qual a nomenclatura correta..."
        },
        { 
            id: 5, 
            subject: "Biologia", 
            topic: "Genética",
            correct: true, 
            userAnswer: "C", 
            correctAnswer: "C",
            difficulty: "Difícil",
            successRate: 52.1,
            text: "Sobre a segunda lei de Mendel..."
        }
    ],
};

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-3xl">
                    <h3 className="text-xl font-bold text-gray-800">Detalhes das Questões</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XCircle className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default function SimulatedResult() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('all'); // all, correct, wrong

    useEffect(() => {
        setTimeout(() => {
            setResult(mockResult);
            setLoading(false);
        }, 1000);
    }, []);

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

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'Fácil': return 'bg-green-100 text-green-700 border-green-200';
            case 'Médio': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Difícil': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Carregando resultados...</p>
                </div>
            </div>
        );
    }

    const { 
        studentName, 
        examTitle,
        percentage, 
        correctAnswers, 
        wrongAnswers, 
        unanswered,
        totalQuestions,
        timeSpent,
        subjects,
        questions,
        recommendations
    } = result;

    const colors = getPercentageColor(percentage);
    const strokeDasharray = ((percentage || 0) / 100) * 251.2;

    const filteredQuestions = questions.filter(q => {
        if (selectedFilter === 'correct') return q.correct;
        if (selectedFilter === 'wrong') return !q.correct;
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50">
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
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{examTitle}</h1>
                            <p className="text-gray-600">Concluído em {new Date(result.completedAt).toLocaleString('pt-BR')}</p>
                        </div>
                    </div>
                </div>

                {/* Card Principal de Resultados */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {percentage >= 70 ? `Excelente trabalho, ${studentName}! 🎉` : 
                             percentage >= 60 ? `Bom desempenho, ${studentName}! 👏` :
                             `Continue praticando, ${studentName}! 💪`}
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
                                            {percentage.toFixed(1)}%
                                        </span>
                                        <span className="text-sm text-gray-500 mt-1">Aproveitamento</span>
                                    </div>
                                </div>

                                <div className={`mt-6 px-6 py-3 rounded-full ${colors.light} border-2 ${colors.border}`}>
                                    <span className={`font-bold ${colors.text}`}>
                                        {percentage >= 70 ? "Aprovado ✓" : 
                                         percentage >= 60 ? "Aproveitamento Regular" :
                                         "Precisa Melhorar"}
                                    </span>
                                </div>
                            </div>

                            {/* Estatísticas Detalhadas */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border-2 border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                            <span className="font-semibold text-gray-700">Questões Corretas</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                                            <div className="text-sm font-medium text-green-700">
                                                {((correctAnswers / totalQuestions) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-green-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-2xl border-2 border-red-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <XCircle className="w-6 h-6 text-red-600" />
                                            <span className="font-semibold text-gray-700">Questões Incorretas</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-red-600">{wrongAnswers}</div>
                                            <div className="text-sm font-medium text-red-700">
                                                {((wrongAnswers / totalQuestions) * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-red-200 rounded-full h-2">
                                        <div 
                                            className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${(wrongAnswers / totalQuestions) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <div className="font-semibold text-gray-700">Tempo Utilizado</div>
                                                <div className="text-sm text-gray-500">de 03:00:00 disponíveis</div>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">{timeSpent}</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border-2 border-purple-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-6 h-6 text-purple-600" />
                                            <div>
                                                <div className="font-semibold text-gray-700">Total de Questões</div>
                                                <div className="text-sm text-gray-500">Simulado completo</div>
                                            </div>
                                        </div>
                                        <span className="text-2xl font-bold text-purple-600">{totalQuestions}</span>
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

            {/* Modal de Gabarito Detalhado */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="mb-6">
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedFilter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Todas ({questions.length})
                        </button>
                        <button
                            onClick={() => setSelectedFilter('correct')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedFilter === 'correct' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Acertos ({correctAnswers})
                        </button>
                        <button
                            onClick={() => setSelectedFilter('wrong')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                selectedFilter === 'wrong' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Erros ({wrongAnswers})
                        </button>
                    </div>

                    <div className="space-y-4">
                        {filteredQuestions.map((q) => (
                            <div 
                                key={q.id} 
                                className={`p-5 rounded-2xl border-2 ${
                                    q.correct 
                                        ? 'bg-green-50 border-green-200' 
                                        : 'bg-red-50 border-red-200'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                            {q.id}
                                        </span>
                                        <div>
                                            <span className="font-bold text-gray-800">{q.subject}</span>
                                            <span className="text-gray-500 text-sm ml-2">• {q.topic}</span>
                                        </div>
                                    </div>
                                    {q.correct ? (
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-600" />
                                    )}
                                </div>

                                <p className="text-gray-700 mb-4">{q.text}</p>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <span className="text-sm text-gray-600">Sua resposta:</span>
                                        <div className={`font-bold text-lg ${q.correct ? 'text-green-600' : 'text-red-600'}`}>
                                            Alternativa {q.userAnswer}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600">Resposta correta:</span>
                                        <div className="font-bold text-lg text-green-600">
                                            Alternativa {q.correctAnswer}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <span className={`px-3 py-1 rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                                        {q.difficulty}
                                    </span>
                                    <span className="text-gray-600">
                                        {q.successRate}% dos alunos acertaram
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

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