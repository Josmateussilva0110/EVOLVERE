import { useState } from "react";
import { Check, X, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CorrigirSimulado
 *
 * Componente React para corrigir respostas de alunos em um simulado de forma interativa.
 *
 * Funcionalidades principais:
 * - Exibe uma lista de respostas dos alunos
 * - Permite marcar cada resposta como "correto" ou "incorreto"
 * - Permite adicionar comentários a cada resposta
 * - Mostra barra de progresso da correção
 * - Modal de resultado final com todas as correções e comentários
 *
 * Estados internos:
 * - correcao: objeto, chave = id da resposta, valor = "correto" | "incorreto"
 * - comentarios: objeto, chave = id da resposta, valor = texto do comentário
 * - comentando: id da resposta atualmente sendo comentada
 * - mostrarResultado: boolean, controla a exibição do modal de resultado final
 *
 * Funções internas:
 * - marcarCorrecao(id, valor): marca ou desmarca a correção de uma resposta
 * - salvarComentario(id, texto): salva o comentário de uma resposta
 *
 * Estatísticas:
 * - total: número total de respostas
 * - corrigidas: número de respostas corrigidas
 * - progresso: porcentagem de respostas corrigidas (para barra de progresso)
 *
 * Entrada:
 * - Nenhuma entrada externa; respostas são mockadas internamente
 *
 * Saída:
 * - JSX que renderiza:
 *   - Cabeçalho do componente
 *   - Barra de progresso com número de respostas corrigidas e percentual
 *   - Lista de respostas, com botões para marcar correto/incorreto e adicionar comentário
 *   - Feedback visual do status de cada resposta
 *   - Modal com resultado final contendo aluno, resposta, status e comentário
 *
 * Observações:
 * - Utiliza `framer-motion` para animações suaves na lista de respostas e modal
 * - Permite adicionar/remover comentários dinamicamente
 * - Botões possuem feedback visual de hover, tap e mudança de status
 * - Modal exibe scroll para grandes listas de respostas
 * - Feedback de status usa cores: verde para correto, vermelho para incorreto
 */

export default function CorrigirSimulado() {
  const [correcao, setCorrecao] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [comentando, setComentando] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const respostas = [
    { id: 1, aluno: "João Silva", resposta: "A Revolução Francesa começou em 1789." },
    { id: 2, aluno: "Maria Oliveira", resposta: "A água é composta por hidrogênio e oxigênio." },
    { id: 3, aluno: "Pedro Santos", resposta: "O Brasil foi descoberto em 1500." },
    { id: 4, aluno: "Ana Souza", resposta: "A Terra é plana." },
    { id: 5, aluno: "Carlos Oliveira", resposta: "O Sol é um planeta." },
    { id: 6, aluno: "Lucas Santos", resposta: "A Lua é um satélite da Terra." },
    { id: 7, aluno: "Mariana Oliveira", resposta: "A Terra é redonda." },
    { id: 8, aluno: "Rafael Silva", resposta: "O Mar é um planeta." },
    { id: 9, aluno: "Julia Santos", resposta: "A Terra é uma esfera." },
    { id: 10, aluno: "Bruno Oliveira", resposta: "O Sol é uma estrela." },
  ];

  // ✅ Marca correção ou desmarca se clicar de novo
  const marcarCorrecao = (id, valor) => {
    setCorrecao((prev) => {
      if (prev[id] === valor) {
        const atualizado = { ...prev };
        delete atualizado[id];
        return atualizado;
      }
      return { ...prev, [id]: valor };
    });
  };

  const salvarComentario = (id, texto) => {
    setComentarios((prev) => ({ ...prev, [id]: texto }));
    setComentando(null);
  };

  // 📊 Estatísticas
  const total = respostas.length;
  const corrigidas = Object.keys(correcao).length;
  const progresso = Math.round((corrigidas / total) * 100);

  // Resultado final para exibir no modal
  const resultadoFinal = respostas.map((r) => ({
    ...r,
    status: correcao[r.id] || "Pendente",
    comentario: comentarios[r.id] || "—",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col items-center p-20">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Correção de Simulado
        </h1>
        <p className="text-gray-600 mt-2">
          Corrija as respostas dos alunos de forma interativa
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{corrigidas} de {total} corrigidas</span>
          <span>{progresso}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progresso}%` }}
            transition={{ duration: 0.6 }}
            className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
          />
        </div>
      </div>

      {/* Lista de respostas */}
      <div className="space-y-6 w-full max-w-2xl">
        {respostas.map((r) => (
          <motion.div
            key={r.id}
            className="bg-white shadow-lg rounded-2xl p-5 border relative hover:shadow-xl transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <p className="font-semibold text-gray-800">{r.aluno}</p>
            <p className="text-gray-600 mt-1">{r.resposta}</p>

            {/* Ações */}
            <div className="flex items-center gap-3 mt-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => marcarCorrecao(r.id, "correto")}
                className={`p-3 rounded-full shadow transition ${
                  correcao[r.id] === "correto"
                    ? "bg-green-500 text-white shadow-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-green-100"
                }`}
              >
                <Check size={20} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => marcarCorrecao(r.id, "incorreto")}
                className={`p-3 rounded-full shadow transition ${
                  correcao[r.id] === "incorreto"
                    ? "bg-red-500 text-white shadow-red-300"
                    : "bg-gray-100 text-gray-600 hover:bg-red-100"
                }`}
              >
                <X size={20} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setComentando(comentando === r.id ? null : r.id)}
                className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition shadow"
              >
                <MessageSquare size={20} />
              </motion.button>
            </div>

            {/* Campo de comentário */}
            <AnimatePresence>
              {comentando === r.id && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4"
                >
                  <textarea
                    defaultValue={comentarios[r.id] || ""}
                    className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                    placeholder="Escreva um comentário..."
                  />
                  <button
                    onClick={(e) =>
                      salvarComentario(r.id, e.target.previousSibling.value)
                    }
                    className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                  >
                    Salvar comentário
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feedback visual do status */}
            {correcao[r.id] && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-lg text-white shadow ${
                  correcao[r.id] === "correto" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {correcao[r.id] === "correto" ? "✔ Correto" : "✘ Incorreto"}
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Botão de salvar correção */}
      <button
        onClick={() => setMostrarResultado(true)}
        className="mt-10 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition"
      >
        Salvar Correção
      </button>

      {/* Modal com resultado final */}
      <AnimatePresence>
        {mostrarResultado && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-2xl"
            >
              <h2 className="text-xl font-bold text-indigo-600 mb-4">Resultado Final</h2>
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2 border">Aluno</th>
                      <th className="p-2 border">Resposta</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Comentário</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultadoFinal.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{r.aluno}</td>
                        <td className="p-2 border">{r.resposta}</td>
                        <td
                          className={`p-2 border font-semibold ${
                            r.status === "correto"
                              ? "text-green-600"
                              : r.status === "incorreto"
                              ? "text-red-600"
                              : "text-gray-500"
                          }`}
                        >
                          {r.status}
                        </td>
                        <td className="p-2 border italic text-gray-600">{r.comentario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {/* Botão Salvar */}
                <button
                    onClick={() => {
                    alert("Correção salva com sucesso! ✅");
                    setMostrarResultado(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Salvar
                </button>

                {/* Botão Fechar */}
                <button
                    onClick={() => setMostrarResultado(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Fechar
                </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
