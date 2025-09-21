import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../../form/Input"
import { Context } from "../../../context/UserContext"

function Login() {
  const [user, setUser] = useState({})
  const { login } = useContext(Context)
  const navigate = useNavigate()

  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  async function submitForm(event) {
    event.preventDefault()
    login(user)
  }

  return (
    <div className="flex items-center justify-center grow bg-[#060060] px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 md:p-16 w-full max-w-md text-center">
        {/* Título */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#060060] mb-8 sm:mb-10">
          Seja bem-vindo(a) <br /> de volta
        </h2>

        <form onSubmit={submitForm} className="space-y-3 sm:space-y-4">
          <div className="space-y-4 sm:space-y-5">
            <Input
              text=""
              type="email"
              name="email"
              placeholder="Insira seu endereço de e-mail"
              handleOnChange={handleChange}
            />

            <div>
              <Input
                text=""
                type="password"
                name="password"
                placeholder="Digite sua senha"
                handleOnChange={handleChange}
              />
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot_password")}
                  className="text-sm text-[#060060] hover:underline"
                >
                  Esqueci a senha
                </button>
              </div>
            </div>
          </div>

          {/* Botão Iniciar sessão */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 text-[#060060] font-bold rounded-lg 
                       hover:bg-yellow-500 transition"
          >
            Iniciar sessão
          </button>

          {/* Botão Criar conta */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-3 bg-gray-100 text-[#060060] font-bold rounded-lg 
                       hover:bg-gray-200 transition"
          >
            Criar conta
          </button>
        </form>

        {/* Rodapé */}
        <p className="text-xs sm:text-sm text-gray-500 mt-6">
          Está com problemas para entrar?{" "}
          <button
            type="button"
            onClick={() => navigate("/help")}
            className="text-[#060060] font-semibold hover:underline"
          >
            Central de Ajuda
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login