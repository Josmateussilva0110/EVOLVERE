import { useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * Tela de listagem de disciplinas com busca, edição e exclusão.
 * Baseada no layout fornecido (UI anexa).
 *
 * @component
 * @example
 * return (
 *   <DisciplineList />
 * )
 */
function DisciplineList() {
  /**
   * Estado para armazenar a lista de disciplinas.
   * (Substituir futuramente por dados vindos de API/BD)
   */
  const [disciplinas, setDisciplinas] = useState([
    { id: 1, nome: "Matemática", responsaveis: ["Maria", "Humberto"] },
    { id: 2, nome: "Física", responsaveis: ["Maria", "Humberto"] },
    { id: 3, nome: "Inglês", responsaveis: ["Maria", "Humberto"] },
    { id: 4, nome: "Contabilidade", responsaveis: ["Maria", "Humberto"] },
  ])

  const [busca, setBusca] = useState("")
  const navigate = useNavigate()

  /**
   * Exclui disciplina da lista.
   * @param {number} id - ID da disciplina a ser excluída
   */
  const handleExcluir = (id) => {
    setDisciplinas(disciplinas.filter(d => d.id !== id))
  }

  /**
   * Edita disciplina (apenas simulação).
   * @param {number} id - ID da disciplina
   */
  const handleEditar = (id) => {
    alert(`Editar disciplina ID: ${id}`)
  }


  // Filtra disciplinas conforme busca
  const disciplinasFiltradas = disciplinas.filter(d =>
    d.nome.toLowerCase().includes(busca.toLowerCase()) ||
    d.id.toString().includes(busca)
  )

  return (
    <div className="p-4 bg-white min-h-[500px]">
      {/* Campo de busca */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
        <input
          type="text"
          placeholder="Pesquisar por nome ou id"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        <span className="text-gray-500 cursor-pointer">🔍</span>
      </div>

      {/* Lista de disciplinas */}
      <div className="space-y-3">
        {disciplinasFiltradas.map(d => (
          <div
            key={d.id}
            className="flex justify-between items-center bg-gray-200 rounded-xl px-4 py-3"
          >
            <div>
              <p className="font-semibold text-gray-800">{d.nome}</p>
              <p className="text-sm text-gray-600">
                responsável: {d.responsaveis.join(", ")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExcluir(d.id)}
                className="flex items-center gap-1 text-sm bg-yellow-200 text-000000-800 px-2 py-1 rounded-md hover:bg-yellow-300 transition"
              >
                🗑️ Excluir
              </button>
              <button
                onClick={() => handleEditar(d.id)}
                className="flex items-center gap-1 text-sm bg-red-200 text-000000-700 px-2 py-1 rounded-md hover:bg-red-300 transition"
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão adicionar */}
      <button
        onClick={() => navigate("/coordinator/discipline/register")}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-100 text-indigo-900 font-medium py-3 rounded-xl shadow-sm hover:bg-indigo-200 transition"
      >
        ➕ Adicionar Disciplinas
      </button>
    </div>
  )
}

export default DisciplineList
