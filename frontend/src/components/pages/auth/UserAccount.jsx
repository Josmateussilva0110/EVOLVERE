import { useNavigate } from "react-router-dom"
import Input from "../../form/Input"
import { useState, useContext } from "react"
import { Context } from "../../../context/UserContext"
import { FaUserGraduate, FaChalkboardTeacher, FaUniversity } from "react-icons/fa"

function UserAccount() {
  const [user, setUser] = useState({})
  const [role, setRole] = useState("aluno")
  const { register } = useContext(Context)
  const navigate = useNavigate()

  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  async function submitForm(e) {
    e.preventDefault()
    register({ ...user, role })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060060] px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 md:p-14 w-full max-w-xl text-center">

        {/* Logo canto superior esquerdo */}
        <div className="flex justify-start mb-4">
          <img
            src="/logo.png" // substitua pelo caminho do logo
            alt="Logo"
            className="w-10 h-10"
          />
        </div>

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
              onClick={() => setRole("aluno")}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === "aluno" ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaUserGraduate size={28} />
              <span className="mt-1 font-semibold">Aluno</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("professor")}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === "professor" ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaChalkboardTeacher size={28} />
              <span className="mt-1 font-semibold">Professor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("coordenacao")}
              className={`flex flex-col items-center px-6 py-3 rounded-lg border transition
                ${role === "coordenacao" ? "bg-[#060060] text-white" : "border-gray-400 text-gray-700"}`}
            >
              <FaUniversity size={28} />
              <span className="mt-1 font-semibold">Coordenação</span>
            </button>
          </div>

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
