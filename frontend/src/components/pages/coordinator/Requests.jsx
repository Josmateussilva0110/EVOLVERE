import { useState, useEffect, useContext } from "react"
import {
  FiArrowLeft, FiSearch, FiCheck, FiTrash2, FiExternalLink,
  FiUser, FiBookOpen, FiMapPin, FiFileText, FiBriefcase, FiCalendar
} from "react-icons/fi"

import { FaChalkboardTeacher } from "react-icons/fa"

import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Context } from "../../../context/UserContext"
import formatDateRequests from "../../../utils/formatDateRequests"

/**
 * RequestsTeachers
 * 
 * Exibe solicitações de professores pendentes, permitindo buscar, aprovar ou remover.
 * 
 * Entrada: nenhuma
 * Saída: interface com a lista de professores pendentes
 * Exemplo de saída: [
 *   { id: 1, username: "João Silva", course: "Matemática", flag: "SP", diploma: "joao.pdf", role: "Professor", created_at: "2024-10-01" }
 * ]
 */

/**
 * fetchRequests
 * 
 * Busca todas as solicitações pendentes da API e atualiza o estado `teachers`.
 * Entrada: nenhuma
 * Saída: atualiza `teachers` com array de professores
 * Exemplo de saída: [{ id: 1, username: "João Silva", course: "Matemática", ... }]
 */

/**
 * removeRequest
 * 
 * Remove uma solicitação de professor pelo ID.
 * Entrada: id (number)
 * Saída: atualiza o estado removendo o professor da lista
 * Exemplo de saída: array de professores sem o professor removido
 */

/**
 * approveRequest
 * 
 * Aprova uma solicitação de professor pelo ID.
 * Entrada: id (number)
 * Saída: atualiza o estado removendo o professor aprovado
 * Exemplo de saída: array de professores sem o professor aprovado
 */

/**
 * professoresFiltrados
 * 
 * Filtra a lista de professores pelo nome ou curso com base no campo de busca.
 * Entrada: search (string)
 * Saída: array filtrado de professores
 * Exemplo de saída: [{ id: 1, username: "João Silva", course: "Matemática", ... }]
 */

/**
 * handleVoltar
 * 
 * Volta para a página anterior do navegador.
 * Entrada: nenhuma
 * Saída: navegação de volta
 * Exemplo de saída: usuário retorna à página anterior
 */

/**
 * @typedef {Object} TeacherRequest
 * @property {number} id - ID do professor
 * @property {string} username - Nome do professor
 * @property {string} course - Nome do curso
 * @property {string} flag - Sigla do campus/instituição
 * @property {string} diploma - Nome do arquivo do diploma
 */

/**
 * Componente RequestsTeachers
 * 
 * Exibe a lista de solicitações de professores pendentes de aprovação.
 * Permite pesquisar, aprovar ou remover solicitações.
 *
 * @component
 * @example
 * <RequestsTeachers />
 */
function RequestsTeachers() {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([])
  const { setFlashMessage } = useFlashMessage()
  const { user } = useContext(Context)

  /**
   * Busca todas as solicitações de professores pendentes ao carregar o componente.
   * Atualiza o estado `teachers` com o resultado da API.
   */
  useEffect(() => {
    async function fetchRequests() {
      const response = await requestData(`/user/requests/${user.id}`, 'GET', {}, true)
      console.log(response)
      if (response.success) {
        setTeachers(response.data.users)
      }
    }
    fetchRequests()
  }, [user])


  /**
   * Remove uma solicitação de professor pelo ID.
   * Atualiza o estado removendo o professor da lista.
   *
   * @param {number} id - ID do professor
   */
  async function removeRequest(id) {
    const response = await requestData(`/user/request/${id}`, "DELETE", {}, true)
    if (response.success) {
      setFlashMessage(response.data.message, "success")

      setTeachers((prev) => prev.filter((prof) => prof.id !== id))
    } else {
      setFlashMessage(response.message, "error")
    }
  }


  /**
   * Aprova uma solicitação de professor pelo ID.
   * Atualiza o estado removendo o professor da lista.
   *
   * @param {number} id - ID do professor
   */
  async function approveRequest(id) {
    const response = await requestData(`/user/request/approved/${id}`, 'PATCH', {}, true)
    if (response.success) {
      setTeachers((prev) => prev.filter((prof) => prof.id !== id))
      setFlashMessage(response.data.message, "success")
    }
    else {
      setFlashMessage(response.message, "error")
    }
  }



  /**
   * Filtra a lista de professores com base no campo de busca.
   * Procura por `username` ou `course` que contenham o termo digitado.
   */
  const professoresFiltrados = teachers.filter(
    (prof) =>
      prof.username.toLowerCase().includes(search.toLowerCase()) ||
      prof.course.toLowerCase().includes(search.toLowerCase())
  );


  /**
   * Volta para a página anterior do navegador.
   */
  const handleVoltar = () => {
    window.history.back()
  }

  const showRoleColumn = user?.id >= 1 && user?.id <= 4

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#060060] p-6">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleVoltar} className="inline-flex items-center gap-2 rounded-lg ring-1 ring-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-50">
            <FiArrowLeft /> Voltar
          </button>
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-900">Solicitações de Professores</h2>
            <p className="text-xs text-gray-600">Aprovar ou remover pedidos pendentes</p>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou curso"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl ring-1 ring-gray-200">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-1"><FiUser /> Nome</div>
                </th>

                {showRoleColumn && (
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                    <div className="flex items-center gap-1"><FiBookOpen /> Curso</div>
                  </th>
                )}

                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-1"><FiMapPin /> Campus</div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-1"><FiFileText /> Diploma</div>
                </th>

                {showRoleColumn && (
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                    <div className="flex items-center gap-1"><FiBriefcase /> Cargo</div>
                  </th>
                )}

                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600">
                  <div className="flex items-center gap-1"><FiCalendar /> Criada em</div>
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>

            <tbody>
              {professoresFiltrados.map((prof) => (
                <tr key={prof.id} className="bg-white ring-1 ring-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {prof.username}
                  </td>

                  {/* Curso */}
                  {showRoleColumn && (
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <FiBookOpen className="text-gray-500" />
                        {prof.course}
                      </div>
                    </td>
                  )}


                  {/* Campus */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-gray-500" />
                      {prof.flag}
                    </div>
                  </td>

                  {/* Diploma */}
                  <td className="py-3 px-4 text-sm">
                    {prof.diploma ? (
                      <a
                        href={`${import.meta.env.VITE_BASE_URL}/diplomas/${prof.diploma}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#060060] hover:underline"
                      >
                        <FiFileText className="text-gray-500" />
                        {prof.diploma}
                        <FiExternalLink className="ml-1" />
                      </a>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        <FiFileText /> Sem diploma
                      </div>
                    )}
                  </td>

                  {/* Cargo */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      {prof.role === "Professor" ? (
                        <FaChalkboardTeacher className="text-gray-500" />
                      ) : (
                        <FiBriefcase className="text-gray-500" />
                      )}
                      {prof.role}
                    </div>
                  </td>


                  {/* Criado em */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-gray-500" />
                      {formatDateRequests(prof.created_at)}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => approveRequest(prof.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2 text-xs font-medium ring-1 ring-emerald-200 hover:bg-emerald-100 transition">
                        <FiCheck /> Aprovar
                      </button>
                      <button
                        onClick={() => removeRequest(prof.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-rose-50 text-rose-700 px-3 py-2 text-xs font-medium ring-1 ring-rose-200 hover:bg-rose-100 transition"
                      >
                        <FiTrash2 /> Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {professoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan={showRoleColumn ? 7 : 5} className="py-6 text-center text-gray-500">
                    Nenhuma solicitação encontrada
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default RequestsTeachers
