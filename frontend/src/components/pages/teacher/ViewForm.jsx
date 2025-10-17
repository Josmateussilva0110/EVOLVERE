import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import requestData from "../../../utils/requestApi";
import formatDateRequests from "../../../utils/formatDateRequests"

export default function ViewForm() {
  const { id } = useParams(); // id do formulário
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForm() {
      const response = await requestData(`/form/view/${id}`, "GET", {}, true);
      console.log(response)
      if (response.success) {
        setForm(response.data.form[0]);
      }
      setLoading(false);
    }
    fetchForm();
  }, [id]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 py-10">
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

        {/* Informações */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <Clock className="w-4 h-4" />
          Última atualização:{" "}
          <span className="text-slate-200 font-medium">
            {formatDateRequests(form.updated_at)}
          </span>
        </div>

        {/* Lista de perguntas */}
        <div className="space-y-6">
          {form.questions?.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-start gap-3">
                <div className="bg-indigo-500/20 text-indigo-300 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium text-lg">
                        {q.text}
                    </h3>
                    <div className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-sm font-semibold border border-yellow-300/40">
                        {q.points ?? 0} {q.points === 1 ? "ponto" : "pontos"}
                    </div>
                    </div>


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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão voltar */}
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
