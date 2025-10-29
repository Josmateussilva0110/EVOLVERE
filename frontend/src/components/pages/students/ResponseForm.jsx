/**
 * @file ResponseForm.jsx
 * @description Página de visualização de um formulário/simulado específico.
 * Exibe título, descrição, data de atualização, pontuação total,
 * perguntas e alternativas (destacando as corretas).
 * 
 * @module pages/Form/ResponseForm
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import requestData from "../../../utils/requestApi";
import formatDateRequests from "../../../utils/formatDateRequests";

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

    const [timeLeft, setTimeLeft] = useState(0);


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


    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        const ss = String(s).padStart(2, "0");

        return `${hh}:${mm}:${ss}`;
    }


    /**
     * @function useEffect
     * @description Efeito responsável por buscar os dados do formulário assim que
     * o componente é montado ou o ID muda.
     */
    useEffect(() => {
        async function fetchForm() {
            try {
                const response = await requestData(`/form/view/${id}`, "GET", {}, true);
                if (response.success && response.data.form?.length) {
                    const formData = response.data.form[0];
                    setForm(formData);

                    // totalDuration vem em minutos
                    const totalSeconds = formData.totalDuration * 60;
                    setTimeLeft(totalSeconds);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchForm();
    }, [id]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    /**
     * @description Renderiza uma tela de carregamento enquanto os dados são buscados.
     */
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                Carregando simulado...
            </div>
        );
    }

    /**
     * @description Renderiza uma tela de erro quando nenhum formulário é encontrado.
     */
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

    /**
     * @description Renderiza o conteúdo principal do formulário:
     * título, descrição, data, pontuação e lista de perguntas com alternativas.
     */
    return (
        <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-cyan-50 px-6 py-10">
            <div className="max-w-5xl mx-auto">
                {/* Cabeçalho */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-cyan-500 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{form.title}</h1>
                        <p className="text-gray-500 mt-1">
                            {form.description || "Sem descrição"}
                        </p>
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

                {/* Lista de perguntas */}
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

                                    <ul className="space-y-2">
                                        {q.options?.map((opt) => (
                                            <li
                                                key={opt.id}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all ${opt.correct
                                                        ? "border-emerald-400 bg-emerald-50"
                                                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {opt.correct ? (
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-gray-400" />
                                                )}
                                                <span
                                                    className={`text-sm ${opt.correct
                                                            ? "text-emerald-800 font-medium"
                                                            : "text-gray-700"
                                                        }`}
                                                >
                                                    {opt.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botão Voltar */}
                <div className="flex justify-end mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-cyan-400 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-cyan-500 shadow-md hover:shadow-lg transition-all"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}
