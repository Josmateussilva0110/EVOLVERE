import { useState, useEffect } from "react"
import { FaArrowLeft, FaSearch, FaCheckCircle, FaTrash} from "react-icons/fa"
import requestData from "../../../utils/requestApi"
import useFlashMessage from "../../../hooks/useFlashMessage"


function RequestsTeachers() {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]) // array agora
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    async function fetchRequests() {
      const response = await requestData('/user/requests', 'GET', {}, true)
      console.log(response)
      if(response.success) {
        setTeachers(response.data.teachers)
      } 
    }
    fetchRequests()
  }, [])

  async function removeRequest(id) {
    const response = await requestData(`/user/request/${id}`, "DELETE", {}, true)
    if (response.success) {
      setFlashMessage(response.data.message, "success")

      setTeachers((prev) => prev.filter((prof) => prof.id !== id))
    } else {
      setFlashMessage(response.message, "error")
    }
  }

  async function approveRequest(id) {
    const response = await requestData(`/user/request/approved/${id}`, 'PATCH', {}, true)
    if(response.success) {
      setTeachers((prev) => prev.filter((prof) => prof.id !== id))
      setFlashMessage(response.data.message, "success")
    }
    else {
      setFlashMessage(response.message, "error")
    }
  }



  const professoresFiltrados = teachers.filter(
    (prof) =>
      prof.username.toLowerCase().includes(search.toLowerCase()) ||
      prof.course.toLowerCase().includes(search.toLowerCase())
  );

  const handleVoltar = () => {
    window.history.back()
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 relative">
      <button
        onClick={handleVoltar}
        className="absolute top-6 left-6 flex items-center bg-white-100 text-white-700 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
      >
        <FaArrowLeft className="mr-2" /> Voltar
      </button>

      <div className="w-full max-w-4xl mt-14">
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
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Nome</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Curso</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Campus</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700">Diploma</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {professoresFiltrados.map((prof) => (
                <tr key={prof.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{prof.username}</td>
                  <td className="py-3 px-4">{prof.course}</td>
                  <td className="py-3 px-4">{prof.flag}</td>
                  <td className="py-3 px-4">
                    {prof.diploma ? (
                      <a
                        href={`${import.meta.env.VITE_BASE_URL}/diplomas/${prof.diploma}`}
                        target="_blank" // abre em nova aba
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {prof.diploma}
                      </a>
                    ) : (
                      "Sem diploma"
                    )}
                  </td>

                  <td className="py-3 px-4 flex justify-center space-x-2">
                    <button 
                      onClick={() => approveRequest(prof.id)}
                      className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition">
                      
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
              ))}
              {professoresFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400 italic">
                    Nenhum solicitação encontrada
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
