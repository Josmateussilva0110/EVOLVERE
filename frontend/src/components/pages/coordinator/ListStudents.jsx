import React, { useState } from "react"
import { FaEye, FaTrash, FaArrowLeft } from "react-icons/fa"

/**
 * Componente principal de listagem de estudantes.
 * 
 * Permite:
 * - Buscar alunos por nome, e-mail ou turma
 * - Filtrar por turma e status
 * - Paginar resultados
 * - Excluir usuários da lista
 * - Voltar para a tela anterior
 */
function ListStudents() {
  // Estado da barra de busca
  const [busca, setBusca] = useState("")

  // Estado do filtro de turma
  const [turma, setTurma] = useState("")

  // Estado do filtro de status (Ativo/Inativo)
  const [status, setStatus] = useState("")

  // Estado da página atual da paginação
  const [pagina, setPagina] = useState(1)

  // Lista de opções de turmas
  const turmas = ["2022.1", "2022.2", "2023.1"]

  // Lista de opções de status
  const statusList = ["Ativo", "Inativo"]

  // Estado inicial da lista de usuários
  const [usuarios, setUsuarios] = useState([
    { nome: "Lucas", email: "lucasema@gmail.com", inicio: "2022.1", status: "Ativo" },
    { nome: "Maria", email: "maria@gmail.com", inicio: "2022.2", status: "Inativo" },
    { nome: "João", email: "joao@gmail.com", inicio: "2023.1", status: "Ativo" },
    { nome: "Ana", email: "ana@gmail.com", inicio: "2022.1", status: "Inativo" },
    { nome: "Pedro", email: "pedro@gmail.com", inicio: "2022.1", status: "Inativo" }
  ])

  // Estado para cadastro de novo usuário (não utilizado neste código ainda)
  const [novo, setNovo] = useState({ nome: "", email: "", inicio: "", status: "Ativo" })

  /**
   * Aplica filtros de busca, turma e status à lista de usuários.
   * 
   * @returns {Array} Lista de usuários filtrados
   */
  const usuariosFiltrados = usuarios.filter(u => {
    const buscaLower = busca.toLowerCase()

    // Busca por nome, email ou turma
    const matchBusca =
      u.nome.toLowerCase().includes(buscaLower) ||
      u.email.toLowerCase().includes(buscaLower) ||
      u.inicio.toLowerCase().includes(buscaLower)

    // Verifica filtro de turma
    const matchTurma = turma ? u.inicio === turma : true

    // Verifica filtro de status
    const matchStatus = status ? u.status === status : true

    return matchBusca && matchTurma && matchStatus
  })

  // Configuração da paginação
  const itensPorPagina = 5
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina)
  const inicioIndex = (pagina - 1) * itensPorPagina
  const usuariosPagina = usuariosFiltrados.slice(inicioIndex, inicioIndex + itensPorPagina)

  /**
   * Reseta todos os filtros aplicados (busca, turma, status).
   */
  const handleLimparFiltros = () => {
    setBusca("")
    setTurma("")
    setStatus("")
  }

  /**
   * Retorna para a página anterior do navegador.
   */
  const handleVoltar = () => {
    window.history.back()
  }

  /**
   * Exclui um usuário da lista de acordo com o índice.
   * 
   * @param {number} index - Índice do usuário na lista
   */
  const handleExcluir = (index) => {
    if (window.confirm("Deseja realmente excluir este usuário?")) {
      setUsuarios(usuarios.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="relative flex flex-col items-center min-h-full bg-white py-4 px-6">
      
      {/* Botão voltar no canto superior esquerdo */}
      <button
        onClick={handleVoltar}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-[#060060] font-medium"
      >
        <FaArrowLeft /> Voltar
      </button>

      <div className="w-full max-w-5xl mt-10">
        {/* Barra de busca */}
        <input
          type="text"
          placeholder="Buscar nome, e-mail ou turma"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-4 text-gray-700"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="flex-1 min-w-[120px] px-4 py-3 rounded-lg border border-gray-300 text-gray-700 "
            value={turma}
            onChange={e => setTurma(e.target.value)}
          >
            <option value="">Turma</option>
            {turmas.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="flex-1 min-w-[120px] px-4 py-3 rounded-lg border border-gray-300 text-gray-700 "
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Status</option>
            {statusList.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>

          <button
            onClick={handleLimparFiltros}
            className="px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors "
          >
            Limpar filtros
          </button>
        </div>

        {/* Caixa da tabela + paginação */}
        <div className="overflow-x-auto bg-white shadow rounded-lg mb-10">
          <table className="w-full border-collapse text-gray-700">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Início</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPagina.map((u, i) => (
                <tr key={i} className="border-t">
                  <td className="p-4">{u.nome}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.inicio}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.status === "Ativo"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-4">
                    <button className="text-gray-500 hover:text-blue-600 text-lg">
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleExcluir(i + inicioIndex)}
                      className="text-gray-500 hover:text-red-600 text-lg"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Linha + paginação dentro da caixa */}
          <div className="flex justify-end items-center border-t px-3 py-1 gap-2">
            <button
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
              className={`px-2 py-1 text-sm ${
                pagina === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-[#060060] "
              }`}
            >
              ◀
            </button>
            <span className="px-3 py-1 bg-[#060060] text-white rounded-md font-semibold text-sm">
              {pagina}
            </span>
            <button
              disabled={pagina === totalPaginas || totalPaginas === 0}
              onClick={() => setPagina(pagina + 1)}
              className={`px-2 py-1 text-sm ${
                pagina === totalPaginas || totalPaginas === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-[#060060]"
              }`}
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListStudents
