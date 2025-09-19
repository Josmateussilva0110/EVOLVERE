import { useNavigate } from "react-router-dom"
import Input from "../../form/Input"
import FileUpload from "../../form/FileUpload"
import { useState, useEffect } from "react"
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity } from "react-icons/fa"
import requestData from "../../../utils/requestApi"
import userService from "./service/userService"
import useFlashMessage from "../../../hooks/useFlashMessage"

function UserAccount() {
  const [user, setUser] = useState({})
  const [role, setRole] = useState(4)
  const [loading, setLoading] = useState(true)
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSession() {
      const response = await requestData("/user/session", "GET", {}, true)
      if (response.success) {
        setUser(response.data.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    }
    checkSession()
  }, [])

  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  function handleFileChange(file) {
    setUser({ ...user, diploma: file })
  }

  async function submitForm(event) {
    event.preventDefault()
    if(user) {
      const formData = new FormData()
      if (user.id) formData.append("id", user.id)
      if (user.institution) formData.append("institution", user.institution)
      if (user.access_code) formData.append("access_code", user.access_code)
      if (user.diploma) formData.append("diploma", user.diploma)

      formData.append("role", role)

      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }

      await userService.registerAccount(formData, navigate, setFlashMessage)
    }
    else {
      setFlashMessage("Usuário não autenticado", "error")
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060060] px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 md:p-14 w-full max-w-xl text-center">
        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-[#060060] mb-3">
          Estamos quase lá
        </h2>

        {/* Subtítulo */}
        <p className="text-gray-600 text-sm sm:text-base mb-8">
          Escolha sua instituição, informe o código de acesso e identifique seu perfil para continuar.
        </p>

        <form onSubmit={submitForm} className="space-y-4">
          <Input
            text=""
            type="text"
            name="institution"
            placeholder="Nome da instituição"
            handleOnChange={handleChange}
          />

          <Input
            text=""
            type="text"
            name="access_code"
            placeholder="Código de acesso"
            handleOnChange={handleChange}
          />

          {/* Botões de seleção de perfil */}
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => setRole(4)}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === 4 ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaUserGraduate size={28} />
              <span className="mt-1 font-semibold">Aluno</span>
            </button>

            <button
              type="button"
              onClick={() => setRole(3)}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === 3 ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaChalkboardTeacher size={28} />
              <span className="mt-1 font-semibold">Professor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole(2)}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === 2 ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaUniversity size={28} />
              <span className="mt-1 font-semibold">Coordenação</span>
            </button>
          </div>

          {/* Upload de diploma (apenas para professor ou coordenação) */}
          {(role === 2 || role === 3) && (
            <FileUpload name="diploma" label="Anexar diploma (PDF)" onFileChange={handleFileChange} />
          )}

          {/* Botão avançar */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 text-[#060060] font-bold rounded-lg hover:bg-yellow-500 transition mt-6"
          >
            Avançar
          </button>
        </form>

        {/* Rodapé */}
        <p className="text-xs sm:text-sm text-gray-600 mt-6">
          Já está na Evolvere?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#060060] font-semibold hover:underline"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  )
}

export default UserAccount
