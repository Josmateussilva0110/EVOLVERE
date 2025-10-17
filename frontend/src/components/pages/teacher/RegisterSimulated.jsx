import { useState, useRef, useEffect, useContext } from "react";
import { Plus, X, Trash2, Check, FileText } from "lucide-react";
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import { useNavigate } from "react-router-dom"
import useFlashMessage from "../../../hooks/useFlashMessage"

/**
 * AutoResizeTextarea
 *
 * Textarea controlado que ajusta sua altura automaticamente ao conteúdo.
 * Mantém a API de um elemento <textarea> padrão — recebe todas as props e as repassa.
 *
 * Comportamento:
 * - Ao montar e sempre que `props.value` mudar, recalcula `scrollHeight` e define a altura
 *   do elemento para que o conteúdo não gere barra de rolagem interna.
 *
 * Props:
 * @param {object} props - Props padrão de um textarea (value, onChange, placeholder, className, rows, etc.)
 * @returns {JSX.Element} Elemento textarea com auto-resize aplicado via style.height.
 */
const AutoResizeTextarea = (props) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]);
  return <textarea ref={textareaRef} {...props} />;
};

/**
 * tiposPergunta
 *
 * Lista estática de tipos de pergunta disponíveis ao criar um simulado.
 * Cada item contém:
 * - value: identificador interno (ex.: "alternativa", "vf", "discursiva")
 * - label: texto exibido na UI
 *
 * Uso:
 * - Renderizado como botões para alternar o tipo da questão.
 */
const tiposPergunta = [
  { value: "alternativa", label: "Múltipla Escolha" },
  { value: "vf", label: "Verdadeiro/Falso" },
  { value: "discursiva", label: "Discursiva" },
];

/**
 * CreateQuiz
 *
 * Componente principal para criação de um simulado/prova.
 *
 * Funcionalidades principais:
 * - Cadastro de título e descrição do simulado.
 * - Inserção dinâmica de questões com tipos: Múltipla Escolha, Verdadeiro/Falso e Discursiva.
 * - Em perguntas de múltipla escolha, gerencia opções e marcação de alternativa correta (single-choice).
 * - Em perguntas VF, fornece duas opções pré-definidas (Verdadeiro / Falso) e permite selecionar a correta.
 * - Em perguntas discursivas, exibe bloco informativo indicando que o aluno responderá em texto.
 * - Auto-resize para enunciados das questões via `AutoResizeTextarea`.
 * - Simulação de envio (handleSubmit faz console.log e alert).
 *
 * Estado interno (useState):
 * - title: string — título do simulado.
 * - description: string — descrição/instruções (opcional).
 * - perguntas: Array — lista de perguntas contendo { texto, tipo, opcoes }.
 *
 * Estrutura de `perguntas`:
 * - texto: string — enunciado da questão.
 * - tipo: string — "alternativa" | "vf" | "discursiva".
 * - opcoes: Array<{ texto: string, correta: boolean }> — opções da questão.
 *
 * Observações de integração:
 * - handleSubmit atualmente simula envio; em produção, substitua por integração com API (fetch/axios), validando campos e formatando payload.
 *
 * Retorno:
 * @returns {JSX.Element} Formulário completo para criar e publicar um simulado.
 */
export default function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(Context)
  const [class_id, setClassId] = useState(null)
  const [subject_id, setSubjectId] = useState(null)
  const { setFlashMessage } = useFlashMessage()
  const [perguntas, setPerguntas] = useState([
    {
      texto: "",
      tipo: "alternativa",
      opcoes: [{ texto: "", correta: false }, { texto: "", correta: false }],
    },
  ]);

  useEffect(() => {
    async function fetchRelations() {
      const response = await requestData(`/form/relations/${user.id}`, 'GET', {}, true)
      if(response.success) {
        setClassId(response.data.class_id.id)
        setSubjectId(response.data.subject_id.id)
      }
    }
    fetchRelations()
  }, [user])


  
  /**
   * adicionarPergunta
   *
   * Acrescenta uma nova pergunta padrão ao final da lista.
   * A nova pergunta já vem configurada com o tipo "alternativa" e duas opções vazias.
   */
  const adicionarPergunta = () => {
    setPerguntas([
      ...perguntas,
      { texto: "", tipo: "alternativa", opcoes: [{ texto: "", correta: false }, { texto: "", correta: false }] },
    ]);
  };

  /**
   * removerPergunta
   *
   * Remove a pergunta no índice informado.
   *
   * @param {number} idx - índice da pergunta a remover
   */
  const removerPergunta = (idx) => {
    setPerguntas(perguntas.filter((_, i) => i !== idx));
  };

  /**
   * atualizarPergunta
   *
   * Atualiza um campo da pergunta (texto, tipo, etc.). Ao alterar o tipo,
   * a função também ajusta as opções conforme o tipo selecionado:
   * - "alternativa": garante 2 opções vazias iniciais.
   * - "vf": define opções fixas "Verdadeiro" e "Falso" com uma marcada como correta por padrão.
   * - "discursiva": zera as opções.
   *
   * @param {number} idx - índice da pergunta a atualizar
   * @param {string} campo - nome do campo a atualizar ("texto" | "tipo" | ...)
   * @param {any} valor - novo valor a ser atribuído
   */
  const atualizarPergunta = (idx, campo, valor) => {
    const novas = [...perguntas];
    novas[idx][campo] = valor;
    if (campo === "tipo") {
      if (valor === "alternativa") {
        novas[idx].opcoes = [{ texto: "", correta: false }, { texto: "", correta: false }];
      } else if (valor === "vf") {
        novas[idx].opcoes = [{ texto: "Verdadeiro", correta: true }, { texto: "Falso", correta: false }];
      } else {
        novas[idx].opcoes = [];
      }
    }
    setPerguntas(novas);
  };

  /**
   * atualizarOpcao
   *
   * Atualiza uma opção específica de uma pergunta.
   * Regras:
   * - Para "alternativa": marca apenas a opção selecionada como correta (single-choice).
   * - Para outros tipos (ex.: VF): permite setar corretamente o booleano `correta`.
   *
   * @param {number} idxPergunta - índice da pergunta
   * @param {number} idxOpcao - índice da opção dentro da pergunta
   * @param {string} campo - campo da opção a atualizar ("texto" | "correta")
   * @param {any} valor - novo valor para o campo
   */
  const atualizarOpcao = (idxPergunta, idxOpcao, campo, valor) => {
    const novas = [...perguntas];
    const pergunta = novas[idxPergunta];

    if (campo === "correta") {
      if (pergunta.tipo === "alternativa") {
        pergunta.opcoes.forEach((op, i) => (op.correta = i === idxOpcao));
      } else {
        pergunta.opcoes[idxOpcao].correta = valor;
      }
    } else {
      pergunta.opcoes[idxOpcao][campo] = valor;
    }

    setPerguntas(novas);
  };

  /**
   * handleVfSelect
   *
   * Define qual opção (Verdadeiro ou Falso) está marcada como correta para uma pergunta do tipo VF.
   *
   * @param {number} idxPergunta - índice da pergunta VF
   * @param {"Verdadeiro"|"Falso"} opcaoCorreta - string indicando a opção correta
   */
  const handleVfSelect = (idxPergunta, opcaoCorreta) => {
    const novas = [...perguntas];
    novas[idxPergunta].opcoes = [
      { texto: "Verdadeiro", correta: opcaoCorreta === "Verdadeiro" },
      { texto: "Falso", correta: opcaoCorreta === "Falso" },
    ];
    setPerguntas(novas);
  };

  /**
   * adicionarOpcao
   *
   * Acrescenta uma nova opção vazia à pergunta indicada (usado em múltipla escolha).
   *
   * @param {number} idxPergunta - índice da pergunta onde adicionar a opção
   */
  const adicionarOpcao = (idxPergunta) => {
    const novas = [...perguntas];
    novas[idxPergunta].opcoes.push({ texto: "", correta: false });
    setPerguntas(novas);
  };

  /**
   * removerOpcao
   *
   * Remove a opção no índice informado de uma pergunta específica.
   *
   * @param {number} idxPergunta - índice da pergunta
   * @param {number} idxOpcao - índice da opção a remover
   */
  const removerOpcao = (idxPergunta, idxOpcao) => {
    const novas = [...perguntas];
    novas[idxPergunta].opcoes = novas[idxPergunta].opcoes.filter((_, i) => i !== idxOpcao);
    setPerguntas(novas);
  };

  /**
   * handleSubmit
   *
   * Handler do envio do formulário.
   * Atualmente realiza:
   * - e.preventDefault() para prevenir reload.
   * - console.log do payload { title, description, perguntas }.
   * - alert informando que o simulado foi criado (simulação).
   *
   * Em produção:
   * - Substituir por chamada a API (FormData / JSON conforme backend).
   * - Fazer validações adicionais (ex.: número mínimo de opções, pelo menos uma correta, títulos não vazios).
   *
   * @param {React.FormEvent} e - evento de submissão do formulário
   */
  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      class_id,
      subject_id,
      created_by: user.id
    }

    console.log('data: ',data)

    const response = await requestData("/form/publish", 'POST', data, true)
    if(response.success) {
      setFlashMessage(response.data.message, 'success')
    }
    else {
      setFlashMessage(response.message, 'error')
    }
  }




  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      <div className="max-w-4xl mx-auto py-12 px-4">

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção de Informações Gerais */}
          <div className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Informações Gerais</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-semibold text-slate-200 mb-2">Título *</label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-white placeholder:text-slate-400"
                  placeholder="Ex: Prova de Algoritmos I"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-200 mb-2">Descrição</label>
                <textarea
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-white placeholder:text-slate-400"
                  placeholder="Instruções para os alunos, tópicos abordados, etc."
                  value={description}
                  rows={3}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Seção de Perguntas */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white ml-2">Perguntas</h2>

            {perguntas.map((pergunta, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-white/10 transition-all"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Questão {idx + 1}</h3>
                  {perguntas.length > 1 && (
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-red-400 font-semibold transition-colors"
                      onClick={() => removerPergunta(idx)}
                      title="Remover pergunta"
                    >
                      <Trash2 className="w-4 h-4 text-blue-400" /> Remover
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <AutoResizeTextarea
                    className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-lg text-white placeholder:text-slate-400"
                    placeholder="Digite o enunciado da pergunta aqui..."
                    value={pergunta.texto}
                    onChange={(e) => atualizarPergunta(idx, "texto", e.target.value)}
                    required
                    rows={2}
                  />

                  <div>
                    <label className="block font-semibold text-slate-200 mb-3">Tipo da Pergunta *</label>
                    <div className="flex gap-2 flex-wrap">
                      {tiposPergunta.map((tipo) => (
                        <button
                          key={tipo.value}
                          type="button"
                          onClick={() => atualizarPergunta(idx, "tipo", tipo.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            pergunta.tipo === tipo.value
                              ? "bg-yellow-400 text-slate-900 shadow-md"
                              : "bg-white/5 text-slate-200 hover:bg-white/10"
                          }`}
                        >
                          {tipo.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Múltipla Escolha */}
                  {pergunta.tipo === "alternativa" && (
                    <div className="space-y-3 pt-2">
                      {pergunta.opcoes.map((op, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                            op.correta ? "border-green-400 bg-green-900/20" : "border-white/10 bg-white/2"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => atualizarOpcao(idx, i, "correta", true)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              op.correta ? "bg-green-500 border-green-500" : "border-white/20 hover:border-indigo-400"
                            }`}
                          >
                            {op.correta && <Check className="w-4 h-4 text-white" />}
                          </button>

                          <input
                            type="text"
                            className="flex-1 bg-transparent focus:outline-none text-white placeholder:text-slate-400"
                            placeholder={`Opção ${i + 1}`}
                            value={op.texto}
                            onChange={(e) => atualizarOpcao(idx, i, "texto", e.target.value)}
                          />

                          {pergunta.opcoes.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removerOpcao(idx, i)}
                              className="text-slate-300 hover:text-red-400"
                            >
                              <X className="w-4 h-4 text-blue-400" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => adicionarOpcao(idx)}
                        className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 font-semibold mt-3"
                      >
                        <Plus className="w-4 h-4 text-blue-400" /> Adicionar Opção
                      </button>
                    </div>
                  )}

                  {/* Verdadeiro/Falso */}
                  {pergunta.tipo === "vf" && (
                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => handleVfSelect(idx, "Verdadeiro")}
                        className={`flex-1 p-4 rounded-lg text-lg font-bold transition-all border-2 ${
                          pergunta.opcoes.find((o) => o.texto === "Verdadeiro")?.correta
                            ? "bg-green-500 text-white border-green-500 shadow-lg"
                            : "bg-white/5 text-white hover:bg-white/10 border-white/10"
                        }`}
                      >
                        Verdadeiro
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVfSelect(idx, "Falso")}
                        className={`flex-1 p-4 rounded-lg text-lg font-bold transition-all border-2 ${
                          pergunta.opcoes.find((o) => o.texto === "Falso")?.correta
                            ? "bg-green-500 text-white border-green-500 shadow-lg"
                            : "bg-white/5 text-white hover:bg-white/10 border-white/10"
                        }`}
                      >
                        Falso
                      </button>
                    </div>
                  )}

                  {/* Discursiva */}
                  {pergunta.tipo === "discursiva" && (
                    <div className="bg-white/2 p-4 rounded-lg text-center border-dashed border-2 border-white/10">
                      <FileText className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                      <p className="text-sm font-semibold text-slate-200">O aluno responderá com um texto.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Botão Adicionar Pergunta */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={adicionarPergunta}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center gap-2 border border-yellow-300/30"
              >
                <Plus className="w-5 h-5 text-blue-700" />
                Adicionar Nova Pergunta
              </button>
            </div>
          </div>

          {/* Ações Finais */}
          <div className="bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col sm:flex-row gap-4 justify-end mt-10">
            <button
              type="button"
              className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 transition"
            >
              Salvar como Rascunho
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg text-sm font-extrabold text-slate-900 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all hover:scale-105 shadow-lg shadow-yellow-400/30 flex items-center gap-2"
            >
              <Check className="w-5 h-5 text-blue-700" /> Publicar Simulado
            </button>
          </div>
        </form>
      </div>

      {/* Estilos locais (animação leve) */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
