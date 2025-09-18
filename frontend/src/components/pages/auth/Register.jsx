import Input from "../../form/Input"
import { useState, useContext } from "react"
import { Context } from "../../../context/UserContext"

function Register() {
  const [user, setUser] = useState({})
  const { register } = useContext(Context)

  function handleChange(event) {
    setUser({ ...user, [event.target.name]: event.target.value })
  }

  async function submitForm(e) {
    e.preventDefault()
    register(user)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060060] px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 md:p-16 w-full max-w-md text-center">
        
        {/* Título */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#060060] mb-8 sm:mb-10">
          Novo por aqui ?
        </h2>

        <form onSubmit={submitForm} className="space-y-3 sm:space-y-4">
          <div className="space-y-3 sm:space-y-4">
            <Input
              text=""
              type="text"
              name="username"
              placeholder="Insira seu nome completo"
              handleOnChange={handleChange}
            />

              <Input
                text=""
                type="email"
                name="email"
                placeholder="Insira seu endereço de email"
                handleOnChange={handleChange}
              />

              <Input
                text=""
                type="password"
                name="password"
                placeholder="Digite sua senha"
                handleOnChange={handleChange}
              />

              <Input
                text=""
                type="password"
                name="confirm_password"
                placeholder="Confirmar senha"
                handleOnChange={handleChange}
              />
          </div>

          {/* Botão Iniciar sessão */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 text-[#060060] font-bold rounded-lg 
                       hover:bg-yellow-500 transition"
          >
            Inscreva-se
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

export default Register
