import React, { useState } from "react"

/**
 * Componente principal responsável pelo gerenciamento de disciplinas.
 * Permite cadastrar uma disciplina associada a um curso e professor.
 *
 * @component
 * @example
 * return (
 *   <DisciplineManagement />
 * )
 */
function DisciplineManagement() {
  /**
   * Estado para armazenar o nome da disciplina.
   * @type {[string, Function]}
   */
  const [nome, setNome] = useState("")

  /**
   * Estado para armazenar o curso selecionado.
   * @type {[string, Function]}
   */
  const [curso, setCurso] = useState("")

  /**
   * Estado para armazenar o professor selecionado.
   * @type {[string, Function]}
   */
  const [professor, setProfessor] = useState("")

  /**
   * Lista de cursos disponíveis.
   * (Substituir pelos dados reais vindos da API ou BD)
   * @type {string[]}
   */
  const cursos = ["Engenharia", "Direito", "Administração"]

  /**
   * Lista de professores disponíveis.
   * (Substituir pelos dados reais vindos da API ou BD)
   * @type {string[]}
   */
  const professores = ["João Silva", "Maria Souza", "Carlos Lima"]

  /**
   * Manipula o envio do formulário de cadastro da disciplina.
   * @param {React.FormEvent<HTMLFormElement>} e - Evento de envio do formulário
   * @returns {void}
   */
  function handleSubmit(e) {
    e.preventDefault()
    // TODO: Implementar lógica de cadastro (ex: requisição para API)
  }

  /**
   * Volta para a página anterior no histórico do navegador.
   * @returns {void}
   */
  const handleVoltar = () => {
    window.history.back()
  }

  return (
    <div className="flex items-start justify-center min-h-[400px] bg-gray-150 py-15">
      <div className="w-full max-w-md bg-white rounded-xl p-8">

        {/* Botão Voltar */}
        <button 
          onClick={handleVoltar}
          className="absolute top-25 left-5 w-14 h-13 bg-gray rounded-xl flex items-center justify-center text-gray-700 transition-all duration-200 text-base font cursor-pointer"
        >
          <span className="text-base font mr-1">←</span>
          Voltar
        </button>

        <h2 className="text-2xl font-bold text-[#060060] text-center mb-15">
          Cadastro de Disciplinas
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo Nome da Disciplina */}
          <input
            type="text"
            placeholder="Nome da Disciplina"
            className="w-full px-4 py-3 rounded-lg bg-[#F7F1F1] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#060060]"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />

          {/* Select Curso */}
          <select
            className="w-full px-4 py-3 rounded-lg bg-[#F7F1F1] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#060060]"
            value={curso}
            onChange={e => setCurso(e.target.value)}
            required
          >
            <option value="">Selecione o Curso</option>
            {cursos.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          {/* Select Professor */}
          <select
            className="w-full px-4 py-3 rounded-lg bg-[#F7F1F1] border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#060060]"
            value={professor}
            onChange={e => setProfessor(e.target.value)}
            required
          >
            <option value="">Selecione o Professor</option>
            {professores.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>

          {/* Botão de envio */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              className="px-16 py-2.5 bg-yellow-400 text-[#1e1e5f] font-bold rounded-xl hover:bg-yellow-500 transition-all text-lg"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DisciplineManagement
