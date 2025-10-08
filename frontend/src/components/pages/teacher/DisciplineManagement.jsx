import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"
import { FaEye } from "react-icons/fa"

/**
 * Componente ViewSubjects
 *
 * Tela responsável por exibir a listagem de disciplinas.
 * Inclui:
 *  - Cabeçalho da página
 *  - Filtros de busca (disciplinas e status)
 *  - Botão para limpar os filtros aplicados
 *  - Tabela com dados das disciplinas (nome, curso, turma, status e ações)
 *  - Paginação na parte inferior da tabela
 * 
 * Melhorias aplicadas:
 *  - Layout responsivo para diferentes tamanhos de tela
 *  - Estilo mais moderno e espaçamento adequado entre os elementos
 *  - Status apresentado em forma de "badge" colorido (verde = ativo)
 *  - Botões com feedback visual (hover e transições suaves)
 */
function ViewSubjects() {

  const { user } = useContext(Context)
  const [ data, setData ] = useState([])
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()



  useEffect(() => {
    async function fetchSubjects() {
      const response = await requestData(`/subjects/teacher/${user.id}`, 'GET', {}, true)
      console.log(response)
      if(response.success) {
        setData(response.data.subjects)
      }
    }
    fetchSubjects()
  }, [user])
  

   return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060060] px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl p-8 md:p-10 shadow-2xl relative">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-2xl hover:bg-gray-200 transition-all"
        >
          &lt;
        </button>

        {/* Título */}
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[#060060]">
          Disciplinas
        </h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex gap-4 flex-wrap w-full md:w-auto justify-center md:justify-start">
            <select className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-[180px] focus:ring-2 focus:ring-blue-400 outline-none">
              <option>Disciplinas</option>
            </select>

            <select className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-[150px] focus:ring-2 focus:ring-blue-400 outline-none">
              <option>Status</option>
            </select>
          </div>

          <button className="bg-yellow-400 px-6 py-2 rounded-lg font-medium text-black hover:bg-yellow-500 transition-all shadow w-full sm:w-auto">
            Limpar filtros
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">Curso</th>
                <th className="px-5 py-3">Turma</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-gray-50 transition border-t border-gray-100"
                  >
                    <td className="px-5 py-4 break-words">{subject.name}</td>
                    <td className="px-5 py-4 break-words">{subject.course_name}</td>
                    <td className="px-5 py-4">{subject.period}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm text-white ${
                          subject.status ? "bg-green-500" : "bg-gray-400"
                        }`}
                      >
                        {subject.status ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="text-gray-600 hover:text-[#060060] text-xl transition">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-6 text-center text-gray-500"
                  >
                    Nenhuma disciplina encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-center md:justify-end items-center mt-8 gap-2">
          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition">
            &lt;
          </button>
          <button className="w-8 h-8 rounded-full bg-[#060060] text-white flex items-center justify-center shadow">
            1
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition">
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewSubjects
