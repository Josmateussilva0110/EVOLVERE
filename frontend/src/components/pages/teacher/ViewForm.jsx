/**
 * @file ViewForm.jsx
 * @description Página de visualização de um formulário/simulado específico.
 * Exibe título, descrição, data de atualização, pontuação total,
 * perguntas e alternativas (destacando as corretas).
 * 
 * @module pages/Form/ViewForm
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import requestData from "../../../utils/requestApi";
import formatDateRequests from "../../../utils/formatDateRequests";

/**
 * @component ViewForm
 * @description Exibe os detalhes completos de um formulário específico, incluindo
 * suas perguntas, opções e informações gerais. 
 * 
 * O componente busca os dados do formulário com base no ID passado pela URL
 * e renderiza as informações com destaque visual para as alternativas corretas.
 */
export default function ViewForm() {
  /** 
   * @constant {string} id - ID do formulário obtido dos parâmetros da URL.
   */
  const { id } = useParams();

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
   * @function useEffect
   * @description Efeito responsável por buscar os dados do formulário assim que
   * o componente é montado ou o ID muda.
   */
  useEffect(() => {
    /**
     * @async
     * @function fetchForm
     * @description Realiza uma requisição à API para buscar os dados do formulário.
     */
    async function fetchForm() {
      const response = await requestData(`/form/view/${id}`, "GET", {}, true)
      console.log(response)

      if (response.success) {
        setForm(response.data.form[0]);
      }
      setLoading(false);
    }

    fetchForm();
  }, [id]);

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
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {form.title}
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              {form.description || "Sem descrição"}
            </p>
          </div>
        </div>

        {/* Informações gerais */}
        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              Última atualização:{" "}
              <span className="text-slate-200 font-medium">
                {formatDateRequests(form.updated_at)}
              </span>
            </span>
          </div>

          {/* Pontuação total */}
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-semibold">
            Total: {form.total_points ?? 0}{" "}
            {form.total_points === 1 ? "ponto" : "pontos"}
          </div>
        </div>

        {/* Lista de perguntas */}
        <div className="space-y-6">
          {form.questions?.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-start gap-3">
                {/* Número da pergunta */}
                <div className="bg-indigo-500/20 text-indigo-300 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  {idx + 1}
                </div>

                <div className="flex-1">
                  {/* Texto da pergunta e pontos */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <h3 className="text-white font-medium text-lg flex-1 wrap-break-word">
                      {q.text}
                    </h3>
                    <div className="self-start px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-sm font-semibold border border-yellow-300/40 whitespace-nowrap">
                      {q.points ?? 0} {q.points === 1 ? "ponto" : "pontos"}
                    </div>
                  </div>

                  {/* Opções ou campo aberto */}
                  {q.type === "aberta" ? (
                    <div className="mt-3">
                      <label className="text-slate-300 text-sm mb-2 block">
                        Resposta:
                      </label>
                      <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-slate-200 text-sm resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40 transition"
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
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${
                            opt.correct
                              ? "border-emerald-500/40 bg-emerald-500/10"
                              : "border-white/10 bg-white/5"
                          }`}
                        >
                          {opt.correct ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-slate-200 text-sm">
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

        {/* Botão Voltar */}
        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
