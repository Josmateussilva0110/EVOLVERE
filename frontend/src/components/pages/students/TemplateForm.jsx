/**
 * @file TemplateForm.jsx
 * @description Página de visualização de um formulário/simulado específico.
 * Exibe título, descrição, data de atualização, pontuação total,
 * perguntas e alternativas (destacando as corretas).
 * 
 * @module pages/Form/TemplateForm
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import requestData from "../../../utils/requestApi";

/**
 * @component TemplateForm
 * @description Exibe os detalhes completos de um formulário específico, incluindo
 * suas perguntas, opções e informações gerais. 
 * 
 * O componente busca os dados do formulário com base no ID passado pela URL
 * e renderiza as informações com destaque visual para as alternativas corretas.
 */
export default function TemplateForm() {
    /** 
     * @constant {string} id - ID do formulário obtido dos parâmetros da URL.
     */
    const { form_id } = useParams();


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



    // Busca os dados do formulário
    useEffect(() => {
        async function fetchForm() {
            try {
                const response = await requestData(`/form/view/${form_id}`, "GET", {}, true);
                console.log('form: ', response)
                if (response.success) {
                    const formData = response.data.form[0];
                    setForm(formData);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchForm();
    }, [form_id]);



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
                        onClick={() => navigate(`/student/simulated/result/${form_id}`)}
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
                                                disabled
                                            />
                                        </div>
                                    ) : (

                                        <ul className="space-y-2">
                                            {q.options?.map((opt) => (
                                                <li
                                                    key={opt.id}
                                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${opt.correct
                                                            ? "border-emerald-500/40 bg-emerald-500/10"
                                                            : "border-white/10 bg-white/5"
                                                        }`}
                                                >
                                                    {opt.correct ? (
                                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-400" />
                                                    )}
                                                    <span className="text-black-200 text-sm">
                                                        {opt.text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-10">
                    <button
                        onClick={() => window.print()}
                        className="p-2.5 rounded-2xl bg-linear-to-r from-emerald-500 to-green-400 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
}
