import { useState, useEffect, useContext } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import requestData from "../../../utils/requestApi";
import { Context } from "../../../context/UserContext"

/**
 * Componente de gerenciamento de professores.
 * Exibe uma tabela com os professores e suas disciplinas,
 * incluindo busca, ações de editar e excluir, e botão de voltar.
 *
 * @component
 * @example
 * return <ProfessoresManagement />
 */
function ProfessoresManagement() {
  /**
   * Estado que armazena o valor do campo de busca.
   * @type {[string, Function]}
   */
  const [search, setSearch] = useState("")
  const [teachers, setTeachers] = useState([])
  const { user } = useContext(Context)

  useEffect(() => {
    async function fetchTeachers() {
      const response = await requestData(`/user/teachers/${user.id}`, 'GET', {}, true) 
      if(response.success) {
        setTeachers(response.data.teachers)
      }
    }
    fetchTeachers()
  }, [user])


  /**
   * Filtra a lista de professores com base no termo de busca.
   * Inclui busca pelo nome ou disciplina do professor.
   */
  const filterTeacher = teachers.filter(
    (prof) =>
      (prof?.username ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (prof?.disciplina ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const showCourseColumn = user?.id >= 1 && user?.id <= 4


  /**
   * Função para voltar à página anterior no histórico do navegador.
   */
  const handleVoltar = () => {
    window.history.back();
  };

    return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 relative">
      {/* Botão Voltar */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 flex items-center bg-white-100 text-white-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </button>

      <div className="w-full max-w-4xl mt-14">
        {/* Campo de busca */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou disciplina"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Nome</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Disciplina</th>
                {showCourseColumn && (
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Curso</th>
                )}
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filterTeacher.map((prof) => (
                <tr key={prof.professional_id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{prof?.username}</td>
                  <td className="py-3 px-4">{prof?.disciplina || '-'}</td>
                  {showCourseColumn && (
                    <td className="py-3 px-4">{prof?.course || '-'}</td>
                  )}
                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button className="bg-yellow-100 text-yellow-700 p-2 rounded-full hover:bg-yellow-200 transition">
                      🗑️ Excluir
                    </button>
                    <button className="bg-pink-100 text-pink-700 p-2 rounded-full hover:bg-pink-200 transition">
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
              {filterTeacher.length === 0 && (
                <tr>
                  <td colSpan={showCourseColumn ? 4 : 3} className="py-4 text-center text-gray-400 italic">
                    Nenhum professor encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfessoresManagement;
