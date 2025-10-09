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

/**
 * Dados de exemplo — respostas dos alunos
 *
 * Estrutura de cada item:
 * - id: number — identificador único do aluno/resposta
 * - aluno: string — nome do aluno
 * - resposta: string — texto com a resposta submetida pelo aluno
 *
 * Uso:
 * - Fonte estática para demo/local; em produção, substituir por fetch ou props.
 */
const respostas = [
  { id: 1, aluno: "João Silva", resposta: "A Revolução Francesa começou em 1789, impulsionada pela crise econômica e social, culminando na Queda da Bastilha." },
  { id: 2, aluno: "Maria Oliveira", resposta: "A água (H₂O) é uma molécula polar composta por dois átomos de hidrogênio e um de oxigênio." },
  { id: 3, aluno: "Pedro Santos", resposta: "O Brasil foi oficialmente descoberto pela esquadra portuguesa de Pedro Álvares Cabral em 22 de abril de 1500." },
  { id: 4, aluno: "Ana Souza", resposta: "A Terra é plana." },
  { id: 5, aluno: "Carlos Oliveira", resposta: "O Sol é um planeta gasoso, assim como Júpiter." },
  { id: 6, aluno: "Lucas Santos", resposta: "A Lua é o único satélite natural da Terra, influenciando as marés." },
  { id: 7, aluno: "Mariana Oliveira", resposta: "A Terra é uma esfera achatada nos polos, conhecida como geoide." },
  { id: 8, aluno: "Rafael Silva", resposta: "O Mar é um planeta." },
  { id: 9, aluno: "Julia Santos", resposta: "A Terra é uma esfera perfeita." },
  { id: 10, aluno: "Bruno Oliveira", resposta: "O Sol é a estrela central do nosso Sistema Solar, classificado como uma anã amarela." },
];

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
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(1); // Começa com o primeiro aluno
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle"); // Estado para o botão salvar: 'idle' | 'saving' | 'saved'

  const alunoSelecionado = respostas.find(r => r.id === alunoSelecionadoId);

  /**
   * Sincronização de comentário e reset do estado de salvar
   *
   * Ao mudar de aluno (alunoSelecionadoId) ou quando `comentarios` são atualizados,
   * atualizamos o campo `textoComentario` com o comentário existente (ou vazio),
   * e retornamos o status do botão para 'idle' (pronto para nova ação).
   */
  useEffect(() => {
    setTextoComentario(comentarios[alunoSelecionadoId] || "");
    setSaveStatus("idle"); 
  }, [alunoSelecionadoId, comentarios]);

  /**
   * marcarCorrecao
   *
   * Toggle para marcar ou desmarcar a correção de um aluno.
   * - Se o valor atual para aquele id for igual ao `valor` informado, a marcação é removida.
   * - Caso contrário, o par id->valor é definido no estado `correcao`.
   *
   * Uso:
   * - marcarCorrecao(alunoId, "correto")
   * - marcarCorrecao(alunoId, "incorreto")
   *
   * @param {number} id - id do aluno / resposta
   * @param {"correto" | "incorreto"} valor - nova marcação desejada
   */
  const marcarCorrecao = (id, valor) => {
    setCorrecao(prev => {
      const copy = { ...prev };
      if (prev[id] === valor) {
        delete copy[id];
      } else {
        copy[id] = valor;
      }
      return copy;
    });
  };

  /**
   * salvarComentario
   *
   * Simula a persistência de um comentário com feedback visual:
   * - Bloqueia cliques enquanto `saveStatus` === 'saving'
   * - Define `saveStatus` para 'saving', aguarda a "resposta" (setTimeout),
   *   salva o comentário no estado `comentarios` e exibe 'saved' por um curto período.
   *
   * Em produção:
   * - Substituir o setTimeout por chamada real à API (fetch/axios).
   * - Tratar erros de rede e exibir mensagens apropriadas.
   */
  const salvarComentario = () => {
    if (saveStatus === 'saving') return; // Evita cliques múltiplos

    setSaveStatus('saving');
    // Simula uma chamada de API
    setTimeout(() => {
      setComentarios(prev => ({ ...prev, [alunoSelecionadoId]: textoComentario }));
      setSaveStatus('saved');

      // Volta para o estado 'idle' após um tempo
      setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
    }, 700);
  };

  /**
   * limparComentario
   *
   * Limpa o campo de comentário atual e persiste a limpeza no estado `comentarios`.
   * Utilizado também para permitir desfazer rapidamente um comentário indevido.
   */
  const limparComentario = () => {
    setTextoComentario("");
    // Opcional: Salvar a limpeza imediatamente
    setComentarios(prev => ({ ...prev, [alunoSelecionadoId]: "" }));
  };
  
  const total = respostas.length;
  const corrigidas = Object.keys(correcao).length;
  const progresso = total > 0 ? Math.round((corrigidas / total) * 100) : 0;
  //simulated/response/list
  const resultadoFinal = respostas.map((r) => ({
    ...r,
    status: correcao[r.id] || "Pendente",
    comentario: comentarios[r.id] || "—",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Correção de Simulado</h1>
            <p className="text-slate-400 mt-1">Simulado de Conhecimentos Gerais</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMostrarResultado(true)}
              disabled={corrigidas < total}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed ${
                corrigidas < total
                  ? "bg-slate-700 text-slate-400"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 shadow-yellow-400/20"
              }`}
            >
              <CheckCircle className={`w-5 h-5 ${corrigidas < total ? "text-slate-400" : "text-slate-900"}`} />
              Finalizar Correção
            </button>
          </div>
        </header>

        {/* Barra de progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Progresso</span>
            <span className="font-semibold text-slate-200">{corrigidas} de {total} corrigidas</span>
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

        {/* Layout Principal (2 colunas) */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Coluna da Lista de Alunos */}
          <aside className="lg:col-span-1 bg-slate-800/60 border border-white/10 rounded-2xl p-4 self-start">
            <h2 className="text-lg font-semibold text-white px-2 pb-2">Alunos</h2>
            <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
              {respostas.map((r) => {
                const status = correcao[r.id];
                return (
                  <button
                    key={r.id}
                    onClick={() => setAlunoSelecionadoId(r.id)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      alunoSelecionadoId === r.id ? "bg-slate-700" : "hover:bg-slate-700/50"
                    }`}
                  >
                    {status === "correto" && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                    {status === "incorreto" && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                    {!status && <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />}
                    <span className="flex-grow truncate text-white">{r.aluno}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Coluna de Correção (Área de Trabalho) */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {alunoSelecionado && (
                <motion.div
                  key={alunoSelecionado.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/60 border border-white/10 rounded-2xl shadow-lg p-8"
                >
                  <p className="font-bold text-xl text-white mb-2">{alunoSelecionado.aluno}</p>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700 min-h-[100px]">
                    {alunoSelecionado.resposta}
                  </p>

                  <div className="mt-6 border-t border-slate-700 pt-6">
                    <h3 className="font-semibold text-white mb-4">Avaliação</h3>
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => marcarCorrecao(alunoSelecionado.id, "correto")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all border-2 ${
                          correcao[alunoSelecionado.id] === "correto"
                            ? "bg-green-500/10 border-green-500 text-green-400"
                            : "bg-slate-700/50 border-slate-700 text-slate-300 hover:border-green-500"
                        }`}
                      >
                        <Check size={20} /> Correto
                      </button>
                      <button
                        onClick={() => marcarCorrecao(alunoSelecionado.id, "incorreto")}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all border-2 ${
                          correcao[alunoSelecionado.id] === "incorreto"
                            ? "bg-red-500/10 border-red-500 text-red-400"
                            : "bg-slate-700/50 border-slate-700 text-slate-300 hover:border-red-500"
                        }`}
                      >
                        <X size={20} /> Incorreto
                      </button>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <MessageSquare size={18} className="text-blue-400" />
                        Comentário (Opcional)
                      </h3>
                      <textarea
                        value={textoComentario}
                        onChange={(e) => setTextoComentario(e.target.value)}
                        className="w-full p-3 bg-slate-900/60 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition text-slate-100 placeholder:text-slate-400"
                        placeholder="Adicione um feedback para o aluno..."
                        rows={4}
                      />
                      {/* ==== ÁREA DOS BOTÕES MELHORADOS ==== */}
                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={limparComentario}
                            disabled={!textoComentario}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 className="w-4 h-4" />
                            Limpar
                        </button>

                        <button
                            type="button"
                            onClick={salvarComentario}
                            disabled={saveStatus !== 'idle'}
                            className={`relative flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold text-white transition-all duration-300 overflow-hidden w-40
                              ${saveStatus === 'saved' ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'}
                              disabled:opacity-70 disabled:cursor-wait
                            `}
                        >
                            <AnimatePresence mode="wait">
                                {saveStatus === 'idle' && (
                                    <motion.span key="idle" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                                      Salvar
                                    </motion.span>
                                )}
                                {saveStatus === 'saving' && (
                                    <motion.span key="saving" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Salvando...
                                    </motion.span>
                                )}
                                {saveStatus === 'saved' && (
                                    <motion.span key="saved" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4" />
                                      Salvo!
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                      </div>
                      {/* ===================================== */}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modal de Resultado Final */}
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
                <h2 className="text-xl font-bold text-white">Resultado Final da Correção</h2>
                <button onClick={() => setMostrarResultado(false)} className="p-2 rounded-full hover:bg-slate-700 transition">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-left">
                    <tr className="border-b border-slate-700">
                      <th className="p-3 font-semibold text-slate-300">Aluno</th>
                      <th className="p-3 font-semibold text-slate-300">Resposta</th>
                      <th className="p-3 font-semibold text-slate-300">Status</th>
                      <th className="p-3 font-semibold text-slate-300">Comentário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadoFinal.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-700/50 border-b border-slate-800 last:border-b-0">
                        <td className="p-3 align-top font-medium text-white">{r.aluno}</td>
                        <td className="p-3 align-top text-slate-400 max-w-xs truncate">{r.resposta}</td>
                        <td className={`p-3 align-top font-semibold ${r.status === "correto" ? "text-green-400" : r.status === "incorreto" ? "text-red-400" : "text-slate-500"}`}>{r.status}</td>
                        <td className="p-3 align-top italic text-slate-400">{r.comentario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-4">
                <button onClick={() => setMostrarResultado(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition">
                  Voltar
                    </button>
                <button
                  onClick={() => { alert("Correção salva com sucesso! ✅"); setMostrarResultado(false); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 hover:from-yellow-500 hover:to-yellow-600 transition shadow"
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
