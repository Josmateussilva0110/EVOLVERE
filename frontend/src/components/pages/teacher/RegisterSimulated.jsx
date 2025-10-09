import { useState } from "react"
import { Plus, X } from "lucide-react"

/**
 * CreateQuiz
 *
 * Componente React para criação de simulados/quiz com perguntas e opções.
 *
 * Funcionalidades principais:
 * - Formulário para criar um simulado com título e descrição
 * - Adição e remoção dinâmica de perguntas
 * - Seleção do tipo de pergunta: Alternativa, Verdadeiro/Falso ou Discursiva
 * - Para perguntas do tipo Alternativa ou Verdadeiro/Falso:
 *   - Adição e remoção de opções
 *   - Marcação de opção correta (radio para alternativa, checkbox para VF)
 * - Botão para adicionar novas perguntas
 * - Botão de cadastro do simulado
 *
 * Estados internos:
 * - titulo: string, armazena o título do simulado
 * - descricao: string, armazena a descrição do simulado
 * - perguntas: array de objetos, cada objeto contém:
 *     - texto: string, texto da pergunta
 *     - tipo: string, tipo da pergunta ("alternativa", "vf", "discursiva")
 *     - opcoes: array de objetos com:
 *         - texto: string, texto da opção
 *         - correta: boolean, indica se a opção é correta
 *
 * Funções internas:
 * - adicionarPergunta(): adiciona uma nova pergunta com campo de texto vazio
 * - removerPergunta(idx): remove a pergunta de índice `idx`
 * - atualizarPergunta(idx, campo, valor): atualiza o campo de uma pergunta
 *      - Se o campo for `tipo`, reinicia as opções conforme tipo
 * - adicionarOpcao(idxPergunta): adiciona uma opção para a pergunta `idxPergunta`
 * - removerOpcao(idxPergunta, idxOpcao): remove a opção `idxOpcao` da pergunta `idxPergunta`
 * - atualizarOpcao(idxPergunta, idxOpcao, campo, valor): atualiza campo da opção
 *      - Para tipo "alternativa", garante apenas uma opção correta
 *
 * Entrada:
 * - Nenhuma entrada externa, todos os dados são inseridos pelo usuário
 *
 * Saída:
 * - JSX que renderiza:
 *   - Título e descrição do simulado
 *   - Lista dinâmica de perguntas e opções
 *   - Botões de adicionar/remover perguntas e opções
 *   - Botão de cadastro do simulado com estilo gradient
 *
 * Observações:
 * - Layout responsivo e centrado na tela
 * - Inputs e selects possuem efeitos de foco e hover
 * - Tipos VF possuem opções fixas ("Verdadeiro" e "Falso") e inputs desabilitados
 * - Alternativa permite adicionar/remover múltiplas opções
 */

const tiposPergunta = [
  { value: "alternativa", label: "Alternativa" },
  { value: "vf", label: "Verdadeiro/Falso" },
  { value: "discursiva", label: "Discursiva" }
]

export default function CreateQuiz() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [perguntas, setPerguntas] = useState([
    {
      texto: "",
      tipo: "",
      opcoes: [{ texto: "", correta: false }]
    }
  ])

  // Adiciona uma nova pergunta
  const adicionarPergunta = () => {
    setPerguntas([
      ...perguntas,
      { texto: "", tipo: "", opcoes: [{ texto: "", correta: false }] }
    ])
  }

  // Remove uma pergunta
  const removerPergunta = (idx) => {
    setPerguntas(perguntas.filter((_, i) => i !== idx))
  }

  // Atualiza campos da pergunta
  const atualizarPergunta = (idx, campo, valor) => {
    const novas = [...perguntas]
    novas[idx][campo] = valor
    // Se mudar o tipo, reseta opções
    if (campo === "tipo") {
      if (valor === "alternativa") {
        novas[idx].opcoes = [{ texto: "", correta: false }]
      } else if (valor === "vf") {
        novas[idx].opcoes = [
          { texto: "Verdadeiro", correta: false },
          { texto: "Falso", correta: false }
        ]
      } else {
        novas[idx].opcoes = []
      }
    }
    setPerguntas(novas)
  }

  // Atualiza opções de uma pergunta
  const atualizarOpcao = (idxPergunta, idxOpcao, campo, valor) => {
    const novas = [...perguntas]
    if (campo === "correta" && novas[idxPergunta].tipo === "alternativa") {
      // Só uma correta para alternativa
      novas[idxPergunta].opcoes = novas[idxPergunta].opcoes.map((op, i) => ({
        ...op,
        correta: i === idxOpcao ? valor : false
      }))
    } else {
      novas[idxPergunta].opcoes[idxOpcao][campo] = valor
    }
    setPerguntas(novas)
  }

  // Adiciona opção em uma pergunta
  const adicionarOpcao = (idxPergunta) => {
    const novas = [...perguntas]
    novas[idxPergunta].opcoes.push({ texto: "", correta: false })
    setPerguntas(novas)
  }

  // Remove opção de uma pergunta
  const removerOpcao = (idxPergunta, idxOpcao) => {
    const novas = [...perguntas]
    novas[idxPergunta].opcoes = novas[idxPergunta].opcoes.filter((_, i) => i !== idxOpcao)
    setPerguntas(novas)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-20 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold text-[#060060] text-center mb-8">Criar Simulado</h1>
        <form className="flex flex-col gap-6">
          {/* Título */}
          <div>
            <label className="block font-semibold text-[#060060] mb-1">Título *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Digite o título"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
          </div>
          {/* Descrição */}
          <div>
            <label className="block font-semibold text-[#060060] mb-1">Descrição</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Digite a descrição"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>

          {/* Perguntas */}
          {perguntas.map((pergunta, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-2 relative">
              {perguntas.length > 1 && (
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                  onClick={() => removerPergunta(idx)}
                  title="Remover pergunta"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className="mb-3">
                <label className="block font-semibold text-[#060060] mb-1">Pergunta *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Digite a pergunta"
                  value={pergunta.texto}
                  onChange={e => atualizarPergunta(idx, "texto", e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block font-semibold text-[#060060] mb-1">Tipo *</label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={pergunta.tipo}
                  onChange={e => atualizarPergunta(idx, "tipo", e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {tiposPergunta.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>

              {/* Opções para Alternativa ou Verdadeiro/Falso */}
              {(pergunta.tipo === "alternativa" || pergunta.tipo === "vf") && (
                <div>
                  <label className="block font-semibold text-[#060060] mb-1">Opções:</label>
                  <div className="flex flex-col gap-2">
                    {pergunta.opcoes.map((op, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Opção {i + 1}</span>
                        <input
                          type="text"
                          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                          placeholder={`Digite a opção`}
                          value={op.texto}
                          onChange={e => atualizarOpcao(idx, i, "texto", e.target.value)}
                          disabled={pergunta.tipo === "vf"}
                        />
                        {/* Marcar correta */}
                        <label className="flex items-center gap-1 text-xs text-gray-600 ml-2">
                          <input
                            type={pergunta.tipo === "alternativa" ? "radio" : "checkbox"}
                            checked={!!op.correta}
                            onChange={e => atualizarOpcao(idx, i, "correta", e.target.checked)}
                            name={`correta-${idx}`}
                          />
                          Opção correta?
                        </label>
                        {/* Remover opção */}
                        {pergunta.tipo === "alternativa" && pergunta.opcoes.length > 1 && (
                          <button
                            type="button"
                            className="text-gray-400 hover:text-red-500 ml-1"
                            onClick={() => removerOpcao(idx, i)}
                            title="Remover opção"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {/* Adicionar opção */}
                  {pergunta.tipo === "alternativa" && (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-blue-600 font-semibold mt-2 hover:underline"
                      onClick={() => adicionarOpcao(idx)}
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Opção
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Adicionar Pergunta */}
          <button
            type="button"
            className="flex items-center gap-1 text-blue-600 font-semibold mt-2 hover:underline"
            onClick={adicionarPergunta}
          >
            <Plus className="w-5 h-5" />
            Adicionar Pergunta
          </button>

          {/* Botão Cadastrar Simulado */}
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#060060] font-extrabold py-3 rounded-xl transition-all hover:scale-105 shadow-lg text-lg tracking-wide border-2 border-yellow-300/40"
          >
            Cadastrar Simulado
          </button>
        </form>
      </div>
    </div>
  )
}