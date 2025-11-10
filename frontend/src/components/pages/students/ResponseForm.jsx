/**
 * @file ResponseForm.jsx
 * @description Página de visualização de um formulário/simulado específico.
 * Exibe título, descrição, data de atualização, pontuação total,
 * perguntas e alternativas (destacando as corretas).
 * 
 * @module pages/Form/ResponseForm
 */

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import requestData from "../../../utils/requestApi";
import { Context } from "../../../context/UserContext"
import useFlashMessage from "../../../hooks/useFlashMessage"

/**
 * @component ResponseForm
 * @description Exibe os detalhes completos de um formulário específico, incluindo
 * suas perguntas, opções e informações gerais. 
 * 
 * O componente busca os dados do formulário com base no ID passado pela URL
 * e renderiza as informações com destaque visual para as alternativas corretas.
 */
export default function ResponseForm() {
    /** 
     * @constant {string} id - ID do formulário obtido dos parâmetros da URL.
     */
    const { id } = useParams();

    /**
     * @constant {number} timeLeft - Tempo restante em segundos para completar o simulado
     */
    const [timeLeft, setTimeLeft] = useState(0);

    /**
     * @constant {Object} user - Dados do usuário atual obtidos do contexto
     */
    const { user } = useContext(Context)


    /**
     * @constant {Function} navigate - Função do React Router para navegação programática.
     */
    const navigate = useNavigate();

    /**
     * @constant {Object|null} form - Objeto contendo os dados do formulário retornado pela API.
     */
    const [form, setForm] = useState(null);

    /**
     * @constant {boolean} loading - Estado de carregamento da página.
     */
    const [loading, setLoading] = useState(true);


    /**
     * @constant {Object} answers - Objeto contendo as respostas do usuário
     * @property {number|string} [questionId] - ID da opção selecionada ou texto da resposta aberta
     */
    const [answers, setAnswers] = useState({});


    const { setFlashMessage } = useFlashMessage()

    /**
     * @function formatTime
     * @description Converte segundos em uma string formatada no padrão HH:MM:SS
     * 
     * @param {number} seconds - Total de segundos a ser convertido
     * @returns {string} Tempo formatado (ex: "01:30:45")
     */
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    // Busca os dados do formulário
    useEffect(() => {
        async function fetchForm() {
            try {
                const response = await requestData(`/form/view/${id}`, "GET", {}, true);
                if (response.success && response.data.form?.length) {
                    const formData = response.data.form[0];
                    setForm(formData);
                    setTimeLeft(formData.totalDuration * 60);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchForm();
    }, [id]);

    // Contagem regressiva do tempo
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => Math.max(prev - 1, 0)), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    /**
     * @function handleSelect
     * @description Atualiza o estado das respostas quando o usuário seleciona uma opção
     * ou digita uma resposta aberta. Mantém um objeto com todas as respostas do usuário.
     * 
     * @param {number} questionId - ID da questão sendo respondida
     * @param {number|string} optionId - ID da opção selecionada ou texto da resposta aberta
     */
    const handleSelect = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };


    /**
     * @function handleSubmit
     * @description Envia as respostas do simulado para o servidor e processa o resultado.
     * Em caso de sucesso, exibe o modal com as estatísticas do resultado.
     * Em caso de erro, exibe uma mensagem de erro.
     * 
     * @async
     * @throws {Error} Erro ao enviar respostas para o servidor
     */
    async function handleSubmit() {
        const payload = {
            form_id: id,
            user_id: user.id,
            answers: Object.entries(answers).map(([question_id, value]) => {
            // Se o valor for número => é uma opção
            if (typeof value === "number" || /^\d+$/.test(value)) {
                return { question_id: parseInt(question_id), option_id: value };
            }
            // Caso contrário => é uma resposta aberta
            return { question_id: parseInt(question_id), open_answer: value };
            }),
        };

        console.log('respostas: ', answers)


        const response = await requestData('/form/answers', "POST", payload, true);
        console.log('form: ', response)
        if (response.success) {
            const hasOpenQuestions = form?.questions?.some(q => q.type === "aberta");

            if (hasOpenQuestions) {
                navigate(`/student/simulated/pending/correction/${response.data.form_id}`);
            } else {
                navigate(`/student/simulated/result/${response.data.form_id}`, {
                    state: { showResultModal: true }
                });
            }
        } else {
            setFlashMessage(response.message, 'error');
        }
    }


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                Carregando simulado...
            </div>
        );
    }

    if (!form) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <p>Nenhum simulado encontrado.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500"
                >
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-cyan-50 px-6 py-10">
            <div className="max-w-5xl mx-auto">
                {/* Cabeçalho */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{form.title}</h1>
                        <p className="text-gray-500 mt-1">{form.description || "Sem descrição"}</p>
                    </div>
                </div>

                {/* Informações gerais */}
                <div className="flex flex-wrap items-center gap-3 mb-6 text-gray-600 text-sm">
                    <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold border border-emerald-300">
                        Total: {form.total_points ?? 0}{" "}
                        {form.total_points === 1 ? "ponto" : "pontos"}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-300">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Perguntas */}
                <div className="space-y-6">
                    {form.questions?.map((q, idx) => (
                        <div
                            key={q.id}
                            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="bg-linear-to-r from-blue-500 to-cyan-400 text-white w-9 h-9 flex items-center justify-center rounded-full font-semibold shadow-md">
                                    {idx + 1}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                        <h3 className="text-gray-800 font-semibold text-lg leading-snug">
                                            {q.text}
                                        </h3>
                                        <div className="self-start px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm border border-yellow-300 whitespace-nowrap">
                                            {q.points ?? 0} {q.points === 1 ? "ponto" : "pontos"}
                                        </div>
                                    </div>

                                    {q.type === "aberta" ? (
                                    <div className="mt-3">
                                    <label className="text-gray-800 text-sm mb-2 block">
                                        Resposta:
                                    </label>
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 text-sm resize-none 
                                                    focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition-all"
                                        rows={4}
                                        placeholder="Digite sua resposta aqui..."
                                        value={answers[q.id] || ""}
                                        onChange={(e) => handleSelect(q.id, e.target.value)} 
                                        />
                                    </div>
                                    ) : (

                                    <ul className="space-y-2">
                                        {q.options?.map((opt) => {
                                            const selected = answers[q.id] === opt.id;
                                            return (
                                                <li
                                                    key={opt.id}
                                                    onClick={() => handleSelect(q.id, opt.id)}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200
  hover:scale-[1.01] active:scale-[1.00]
  ${selected ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                                                            : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800"}`}

                                                >
                                                    {selected ? (
                                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-400 shrink-0" />
                                                    )}
                                                    <span className="text-sm font-medium">{opt.text}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Aviso de tempo esgotado */}
                {timeLeft === 0 && (
                <div className="text-center mt-10 text-red-600 font-semibold">
                    Tempo esgotado! Você não pode mais enviar respostas.
                </div>
                )}


                {/* Botão de envio */}
                <div className="flex justify-end mt-10">
                    <button
                        onClick={handleSubmit}
                        disabled={timeLeft === 0}
                        className={`px-6 py-2.5 rounded-2xl font-medium shadow-md transition-all 
                            ${timeLeft === 0 
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                            : "bg-linear-to-r from-blue-500 to-cyan-400 text-white hover:from-blue-600 hover:to-cyan-500"}`}
                        >
                        Enviar
                    </button>

                </div>
            </div>
        </div>
    );
}
