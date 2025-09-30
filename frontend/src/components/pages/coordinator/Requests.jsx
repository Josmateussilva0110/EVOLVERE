import { useState, useEffect, useContext } from "react"
import { FaArrowLeft, FaSearch, FaCheckCircle, FaTrash, FaFileAlt, FaUserTie, FaChalkboardTeacher, FaCalendarAlt, FaFlag } from "react-icons/fa"
import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"
import { Context } from "../../../context/UserContext"
import formatDate from "../../../utils/formatDate"


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
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 relative">
      <button
        onClick={handleVoltar}
        className="absolute top-6 left-6 flex items-center bg-white-100 text-white-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </button>

      <div className="w-full max-w-7xl mt-14">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou curso"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 w-1/5">Nome</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 w-1/5">Curso</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 w-1/12">Campus</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 w-1/5">Diploma</th>
                {showRoleColumn && (
                  <th className="py-3 px-4 text-center font-semibold text-gray-700 w-1/12">Cargo</th>
                )}
                <th className="py-3 px-4 text-center font-semibold text-gray-700 w-1/6">Criada em</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 w-1/12">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {professoresFiltrados.length > 0 ? (
                professoresFiltrados.map((prof) => (
                  <tr key={prof.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 flex items-center gap-2 whitespace-nowrap">
                      <FaUserTie className="text-gray-500" /> {prof.username}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{prof.course}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="flex items-center justify-center gap-1">
                        <FaFlag className="text-red-500" /> {prof.flag}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {prof.diploma ? (
                        <a
                          href={`${import.meta.env.VITE_BASE_URL}/diplomas/${prof.diploma}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <FaFileAlt /> {prof.diploma}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Sem diploma</span>
                      )}
                    </td>
                    {showRoleColumn && (
                      <td className="py-3 px-4 text-center">
                        {prof.role === "Professor" ? (
                          <span className="flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            <FaChalkboardTeacher /> Professor
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            <FaUserTie /> Coordenador
                          </span>
                        )}
                      </td>
                    )}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="flex items-center justify-center gap-1">
                        <FaCalendarAlt className="text-gray-500" /> {formatDate(prof.created_at)}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex justify-center space-x-2">
                      <button
                        onClick={() => approveRequest(prof.id)}
                        className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() => removeRequest(prof.id)}
                        className="bg-pink-100 text-pink-700 p-2 rounded-full hover:bg-pink-200 transition"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={showRoleColumn ? 7 : 6}
                    className="py-6 px-4 text-center text-gray-500 italic"
                  >
                    Nenhuma solicitação disponível
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
