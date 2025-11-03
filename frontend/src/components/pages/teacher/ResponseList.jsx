import { useState, useEffect } from "react";
import {
  Check,
  X,
  MessageSquare,
  Circle,
  CheckCircle,
  XCircle,
  Trash2,     // Ícone melhorado para limpar
  Loader2,    // Ícone para o estado "salvando"
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import requestData from "../../../utils/requestApi"
import { useParams } from "react-router-dom"


/**
 * CorrigirSimulado
 *
 * Componente principal para correção de simulados.
 * Fornece:
 * - Lista de alunos com status visual (pendente, correto, incorreto).
 * - Área de correção para leitura da resposta, marcação de correto/incorreto e comentário.
 * - Botão com feedback visual para salvar comentários (estados: idle, saving, saved).
 * - Barra de progresso indicando quantas respostas já foram corrigidas.
 * - Modal com o resultado final (status + comentários) e opção de salvar/notificar alunos.
 *
 * Estado gerenciado:
 * - correcao: { [id]: "correto" | "incorreto" } — map de marcações por id do aluno.
 * - comentarios: { [id]: string } — comentários por id do aluno.
 * - alunoSelecionadoId: number — id do aluno atualmente aberto para correção.
 * - mostrarResultado: boolean — controla visibilidade do modal de resultado final.
 * - textoComentario: string — texto do comentário em edição.
 * - saveStatus: "idle" | "saving" | "saved" — estado do botão salvar, usado para animações e bloqueio.
 *
 * Observações:
 * - O componente usa dados estáticos (`respostas`) para demonstração; adapte para receber via props ou API.
 * - A função `salvarComentario` simula uma chamada assíncrona com setTimeout; substitua por integração real quando necessário.
 *
 * @returns {JSX.Element} Interface completa de correção do simulado.
 */
export default function CorrigirSimulado() {
    const [correcao, setCorrecao] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const { form_id } = useParams();
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForm() {
      const response = await requestData(`/form/answers/${form_id}`, "GET", {}, true);
      console.log(response)
      if (response.success) {
        setForm(response.data.form);
        if (response.data.form.length > 0) {
          setAlunoSelecionadoId(response.data.form[0].user_id);
        }
      }
      setLoading(false);
    }
    fetchForm();
  }, [form_id]);

  const alunosAgrupados = form.reduce((acc, item) => {
    if (!acc[item.user_id]) {
      acc[item.user_id] = {
        username: item.username,
        respostas: [],
      };
    }
    acc[item.user_id].respostas.push({
      question_id: item.question_id,
      question_text: item.question_text,
      open_answer: item.open_answer,
    });
    return acc;
  }, {});

  const alunoSelecionado = form.find((r) => r.user_id === alunoSelecionadoId);

  const marcarCorrecao = (questionId, valor) => {
    setCorrecao((prev) => {
      const novo = { ...prev };
      novo[questionId] = valor;
      return novo;
    });
  };

  const salvarComentario = (questionId, texto) => {
    setComentarios((prev) => ({ ...prev, [questionId]: texto }));
  };

  const total = Object.keys(
    Object.fromEntries(form.map((r) => [r.question_id, true]))
  ).length;
  const corrigidas = Object.keys(correcao).length;
  const progresso = total > 0 ? Math.round((corrigidas / total) * 100) : 0;

  const resultadoFinal = Object.values(alunosAgrupados).flatMap((aluno) =>
    aluno.respostas.map((resp) => ({
      aluno: aluno.username,
      pergunta: resp.question_text,
      resposta: resp.open_answer,
      status: correcao[resp.question_id] || "Pendente",
      comentario: comentarios[resp.question_id] || "—",
    }))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Carregando respostas...
      </div>
    );
  }

  if (!form.length) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        Nenhuma resposta aberta encontrada para este formulário.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">
            Correção de Simulado "{form[0]?.form_name}"
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarResultado(true)}
              disabled={corrigidas < total}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed ${
                corrigidas < total
                  ? "bg-slate-700 text-slate-400"
                  : "bg-linear-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 shadow-yellow-400/20"
              }`}
            >
              <CheckCircle
                className={`w-5 h-5 ${
                  corrigidas < total ? "text-slate-400" : "text-slate-900"
                }`}
              />
              Finalizar Correção
            </button>
          </div>
        </header>

        {/* Barra de progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progresso</span>
            <span className="font-semibold text-slate-200">
              {corrigidas} de {total} corrigidas
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="h-full bg-green-500 rounded-full"
            />
          </div>
        </div>

        {/* Layout Principal */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Alunos */}
          <aside className="lg:col-span-1 bg-slate-800/60 border border-white/10 rounded-2xl p-4 self-start">
            <h2 className="text-lg font-semibold text-white px-2 pb-2">Alunos</h2>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {Object.entries(alunosAgrupados).map(([id, aluno]) => (
                <button
                  key={id}
                  onClick={() => setAlunoSelecionadoId(parseInt(id))}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    alunoSelecionadoId === parseInt(id)
                      ? "bg-slate-700"
                      : "hover:bg-slate-700/50"
                  }`}
                >
                  <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  <span className="grow truncate text-white">{aluno.username}</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Área de Correção */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {alunoSelecionado && (
                <motion.div
                  key={alunoSelecionado.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/60 border border-white/10 rounded-2xl shadow-lg p-8"
                >
                  <h2 className="font-bold text-xl text-white mb-4">
                    {alunoSelecionado.username}
                  </h2>

                  <div className="space-y-6">
                    {alunosAgrupados[alunoSelecionadoId]?.respostas.map((resp, i) => (
                      <div
                        key={resp.question_id}
                        className="bg-slate-900/50 p-5 rounded-lg border border-slate-700"
                      >
                        <p className="text-yellow-400 font-semibold mb-1">
                          Pergunta {i + 1}:
                        </p>
                        <p className="text-slate-200 mb-2">
                          {resp.question_text}
                        </p>
                        <p className="text-slate-400 italic mb-4">
                          {resp.open_answer}
                        </p>

                        {/* Botões de Correção */}
                        <div className="flex gap-4 mb-4">
                          <button
                            onClick={() =>
                              marcarCorrecao(resp.question_id, "correto")
                            }
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all border-2 ${
                              correcao[resp.question_id] === "correto"
                                ? "bg-green-500/10 border-green-500 text-green-400"
                                : "bg-slate-700/50 border-slate-700 text-slate-300 hover:border-green-500"
                            }`}
                          >
                            <Check size={18} /> Correto
                          </button>

                          <button
                            onClick={() =>
                              marcarCorrecao(resp.question_id, "incorreto")
                            }
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all border-2 ${
                              correcao[resp.question_id] === "incorreto"
                                ? "bg-red-500/10 border-red-500 text-red-400"
                                : "bg-slate-700/50 border-slate-700 text-slate-300 hover:border-red-500"
                            }`}
                          >
                            <X size={18} /> Incorreto
                          </button>
                        </div>

                        {/* Comentário individual */}
                        <textarea
                          value={comentarios[resp.question_id] || ""}
                          onChange={(e) =>
                            salvarComentario(resp.question_id, e.target.value)
                          }
                          className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition text-slate-100 placeholder:text-slate-400"
                          placeholder="Adicione um comentário..."
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modal Resultado */}
      <AnimatePresence>
        {mostrarResultado && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl border border-white/10"
            >
              <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Resultado Final da Correção
                </h2>
                <button
                  onClick={() => setMostrarResultado(false)}
                  className="p-2 rounded-full hover:bg-slate-700 transition"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-left">
                    <tr className="border-b border-slate-700">
                      <th className="p-3 font-semibold text-slate-300">
                        Aluno
                      </th>
                      <th className="p-3 font-semibold text-slate-300">
                        Pergunta
                      </th>
                      <th className="p-3 font-semibold text-slate-300">
                        Resposta
                      </th>
                      <th className="p-3 font-semibold text-slate-300">
                        Status
                      </th>
                      <th className="p-3 font-semibold text-slate-300">
                        Comentário
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadoFinal.map((r, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-700/50 border-b border-slate-800 last:border-b-0"
                      >
                        <td className="p-3 font-medium text-white">
                          {r.aluno}
                        </td>
                        <td className="p-3 text-slate-300">{r.pergunta}</td>
                        <td className="p-3 text-slate-400">{r.resposta}</td>
                        <td
                          className={`p-3 font-semibold ${
                            r.status === "correto"
                              ? "text-green-400"
                              : r.status === "incorreto"
                              ? "text-red-400"
                              : "text-slate-500"
                          }`}
                        >
                          {r.status}
                        </td>
                        <td className="p-3 italic text-slate-400">
                          {r.comentario}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-4">
                <button
                  onClick={() => setMostrarResultado(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={() => {
                    alert("Correção salva com sucesso! ✅");
                    setMostrarResultado(false);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-linear-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 transition shadow"
                >
                  Salvar e Notificar Alunos
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}